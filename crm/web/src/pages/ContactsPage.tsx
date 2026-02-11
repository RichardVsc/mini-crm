import { useState } from 'react'
import { useContacts } from '../hooks/useContacts'
import { ContactForm } from '../components/ContactForm'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { SortableHeader } from '../components/SortableHeader'
import { Pagination } from '../components/Pagination'
import type { Contact } from '../types'

export function ContactsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | undefined>()

  const {
    contacts, search, setSearch, loading, error,
    sortBy, sortOrder, handleSort,
    page, setPage, totalPages, total,
    selectedContact, contactLeads, loadingLeads,
    fetchContactLeads,
    pendingDelete, deleting, requestDelete, confirmDelete, cancelDelete,
    refetch,
  } = useContacts()

  function handleFormSuccess() {
    setShowForm(false)
    setEditingContact(undefined)
    refetch()
  }

  function handleEdit(contact: Contact) {
    setEditingContact(contact)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Contatos</h2>
        <button
          onClick={() => { setEditingContact(undefined); setShowForm(true) }}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Novo Contato
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <ContactForm
            contact={editingContact}
            onSuccess={handleFormSuccess}
            onCancel={() => { setShowForm(false); setEditingContact(undefined) }}
          />
        </div>
      )}

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar por nome ou email..."
        className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && <p className="text-gray-500 text-sm">Carregando...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && contacts.length === 0 && (
        <p className="text-gray-500 text-sm">Nenhum contato encontrado.</p>
      )}

      {!loading && contacts.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg border border-gray-200">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <SortableHeader label="Nome" field="name" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Email</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Telefone</th>
                  <SortableHeader label="Criado em" field="createdAt" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">{contact.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{contact.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{contact.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(contact.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-sm text-right space-x-2">
                      <button onClick={() => fetchContactLeads(contact)} className="text-blue-600 hover:underline">Leads</button>
                      <button onClick={() => handleEdit(contact)} className="text-yellow-600 hover:underline">Editar</button>
                      <button onClick={() => requestDelete(contact)} className="text-red-600 hover:underline">Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} total={total} label="contato" loading={loading} onPageChange={setPage} />
        </>
      )}

      {selectedContact && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Leads de {selectedContact.name}
          </h3>
          {loadingLeads && <p className="text-gray-500 text-sm">Carregando...</p>}
          {!loadingLeads && contactLeads.length === 0 && (
            <p className="text-gray-500 text-sm">Nenhum lead vinculado.</p>
          )}
          {!loadingLeads && contactLeads.length > 0 && (
            <ul className="space-y-2">
              {contactLeads.map((lead) => (
                <li key={lead.id} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-md text-sm">
                  <span className="text-gray-800">{lead.name} — {lead.company}</span>
                  <span className="text-gray-500 capitalize">{lead.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Remover Contato"
        message={`Deseja realmente remover o contato "${pendingDelete?.name}"? Os leads vinculados também serão removidos.`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        loading={deleting}
      />
    </div>
  )
}
