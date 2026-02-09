import { useState, useEffect } from 'react'
import { api } from '../services/api'
import { LEAD_STATUSES } from '../types'
import type { Contact, Lead } from '../types'

interface LeadFormProps {
  lead?: Lead
  onSuccess: () => void
  onCancel: () => void
}

export function LeadForm({ lead, onSuccess, onCancel }: LeadFormProps) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [contactId, setContactId] = useState(lead?.contactId ?? '')
  const [name, setName] = useState(lead?.name ?? '')
  const [company, setCompany] = useState(lead?.company ?? '')
  const [status, setStatus] = useState(lead?.status ?? 'novo')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isEditing = !!lead

  useEffect(() => {
    api.getContacts().then(setContacts).catch(() => setContacts([]))
  }, [])

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isEditing) {
        await api.updateLead(lead.id, { name, company, status })
      } else {
        await api.createLead({ contactId, name, company, status })
      }
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar lead')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">
        {isEditing ? 'Editar Lead' : 'Novo Lead'}
      </h3>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      {!isEditing && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contato</label>
          <select
            value={contactId}
            onChange={(e) => setContactId(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Selecione um contato</option>
            {contacts.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Lead</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Projeto Website"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
        <input
          type="text"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nome da empresa"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Lead['status'])}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
        </button>
      </div>
    </form>
  )
}