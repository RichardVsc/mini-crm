import { useState } from 'react'
import { useLeads } from '../hooks/useLeads'
import { LeadForm } from '../components/LeadForm'
import { SortableHeader } from '../components/SortableHeader'
import { Pagination } from '../components/Pagination'
import { STATUS_LABELS, STATUS_COLORS } from '../constants/lead'
import { LEAD_STATUSES } from '../types'
import type { Lead } from '../types'

export function LeadsPage() {
  const [showForm, setShowForm] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | undefined>()

  const {
    leads, search, setSearch, statusFilter, setStatusFilter,
    loading, error, sortBy, sortOrder, handleSort,
    page, setPage, totalPages, total,
    deleteLead, refetch,
  } = useLeads()

  function handleFormSuccess() {
    setShowForm(false)
    setEditingLead(undefined)
    refetch()
  }

  function handleEdit(lead: Lead) {
    setEditingLead(lead)
    setShowForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800">Leads</h2>
        <button
          onClick={() => { setEditingLead(undefined); setShowForm(true) }}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Novo Lead
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <LeadForm
            lead={editingLead}
            onSuccess={handleFormSuccess}
            onCancel={() => { setShowForm(false); setEditingLead(undefined) }}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome ou empresa..."
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      {loading && <p className="text-gray-500 text-sm">Carregando...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && leads.length === 0 && (
        <p className="text-gray-500 text-sm">Nenhum lead encontrado.</p>
      )}

      {!loading && leads.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg border border-gray-200">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <SortableHeader label="Nome" field="name" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Empresa</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Contato</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">Status</th>
                  <SortableHeader label="Criado em" field="createdAt" currentSort={sortBy} currentOrder={sortOrder} onSort={handleSort} />
                  <th className="text-right px-4 py-3 text-sm font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-800">{lead.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lead.company}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lead.contact?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[lead.status]}`}>
                        {STATUS_LABELS[lead.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(lead.createdAt).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-sm text-right space-x-2">
                      <button onClick={() => handleEdit(lead)} className="text-yellow-600 hover:underline">Editar</button>
                      <button onClick={() => deleteLead(lead)} className="text-red-600 hover:underline">Remover</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} totalPages={totalPages} total={total} label="lead" onPageChange={setPage} />
        </>
      )}
    </div>
  )
}