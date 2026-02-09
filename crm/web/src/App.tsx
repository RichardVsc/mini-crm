import { useState } from 'react'
import { LeadsPage } from './pages/LeadsPage'
import { ContactsPage } from './pages/ContactsPage'

function App() {
  const [currentPage, setCurrentPage] = useState<'leads' | 'contacts'>('leads')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600">MINI CRM</h1>
          <nav className="flex gap-2">
            <button
              onClick={() => setCurrentPage('leads')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'leads'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Leads
            </button>
            <button
              onClick={() => setCurrentPage('contacts')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === 'contacts'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Contatos
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        {currentPage === 'leads' ? <LeadsPage /> : <ContactsPage />}
      </main>
    </div>
  )
}

export default App