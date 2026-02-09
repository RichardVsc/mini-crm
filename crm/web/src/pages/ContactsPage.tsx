import { useEffect, useState } from 'react'
import { api } from '../services/api'
import { ContactForm } from '../components/ContactForm'
import type { Contact, Lead } from '../types'

export function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | undefined>()
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [contactLeads, setContactLeads] = useState<Lead[]>([])
  const [loadingLeads, setLoadingLeads] = useState(false)

  async function fetchContacts() {
    setLoading(true)
    setError('')
    try {
      const data = await api.getContacts(search || undefined)
      setContacts(data)
    } catch {
      setError('Erro ao carregar contatos')
    } finally {
      setLoading(false)
    }
  }

  async function fetchContactLeads(contact: Contact) {
    setSelectedContact(contact)
    setLoadingLeads(true)
    try {
      const data = await api.getContactLeads(contact.id)
      setContactLeads(data)
    } catch {
      setContactLeads([])
    } finally {
      setLoadingLeads(false)
    }
  }

  async function handleDelete(contact: Contact) {
    if (!confirm(`Deseja realmente remover o contato "${contact.name}"? Os leads vinculados também serão removidos.`)) {
      return
    }
    try {
      await api.deleteContact(contact.id)
      if (selectedContact?.id === contact.id) {
        setSelectedContact(null)
        setContactLeads([])
      }
      fetchContacts()
    } catch {
      alert('Erro ao remover contato')
    }
  }

  function handleFormSuccess() {
    setShowForm(false)
    setEditingContact(undefined)
    fetchContacts()
  }

  function handleEdit(contact: Contact) {
    setEditingContact(contact)
    setShowForm(true)
  }

  useEffect(() => {
    fetchContacts()
  }, [search])

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
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg border border-gray-200">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Nome</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Telefone</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Criado em</th>
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
                    <button
                      onClick={() => fetchContactLeads(contact)}
                      className="text-blue-600 hover:underline"
                    >
                      Leads
                    </button>
                    <button
                      onClick={() => handleEdit(contact)}
                      className="text-yellow-600 hover:underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(contact)}
                      className="text-red-600 hover:underline"
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
    </div>
  )
}