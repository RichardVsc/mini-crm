import { contactRepository } from './repositories/contact.repository.js'
import { leadRepository } from './repositories/lead.repository.js'

export function seed() {
  const maria = contactRepository.create({
    name: 'Maria Silva',
    email: 'maria@clinicabeleza.com',
    phone: '(47) 99901-1234',
  })

  const joao = contactRepository.create({
    name: 'João Santos',
    email: 'joao@esteticapremium.com',
    phone: '(11) 98765-4321',
  })

  const ana = contactRepository.create({
    name: 'Ana Oliveira',
    email: 'ana@espacobemestar.com',
    phone: '(21) 97654-3210',
  })

  leadRepository.create({
    contactId: maria.id,
    name: 'Implantação CRM',
    company: 'Clínica Beleza Pura',
    status: 'novo',
  })

  leadRepository.create({
    contactId: maria.id,
    name: 'Automação WhatsApp',
    company: 'Clínica Beleza Pura',
    status: 'contactado',
  })

  leadRepository.create({
    contactId: joao.id,
    name: 'Sistema de Agendamento',
    company: 'Estética Premium',
    status: 'qualificado',
  })

  leadRepository.create({
    contactId: joao.id,
    name: 'Gestão de Estoque',
    company: 'Estética Premium',
    status: 'convertido',
  })

  leadRepository.create({
    contactId: ana.id,
    name: 'CRM Completo',
    company: 'Espaço Bem Estar',
    status: 'novo',
  })

  leadRepository.create({
    contactId: ana.id,
    name: 'Integração Pagamentos',
    company: 'Espaço Bem Estar',
    status: 'perdido',
  })

  console.log('🌱 Seed: 3 contatos e 6 leads criados')
}