import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import RetroBoardTool from '@/app/[locale]/tools/agile/retro-board/RetroBoardTool'
import PlanningPokerClient from '@/app/[locale]/tools/agile/planning-poker/PlanningPokerClient'
import SprintDateCalculatorClient from '@/app/[locale]/tools/agile/sprint-date-calculator/SprintDateCalculatorClient'
import StandupGeneratorClient from '@/app/[locale]/tools/agile/standup-generator/StandupGeneratorClient'
import UserStoryWriterClient from '@/app/[locale]/tools/agile/user-story-writer/UserStoryWriterClient'

describe('Agile Tools Integration Tests', () => {
  describe('RetroBoardTool', () => {
    const defaultProps = {
      columns: {
        wentWell: 'Funcionou Bem',
        toImprove: 'A Melhorar',
        actionItems: 'Itens de Ação',
      },
      labels: {
        placeholder: 'Adicionar nota...',
        addButton: 'Adicionar',
        voteAriaLabel: 'Votar neste item',
        deleteAriaLabel: 'Excluir esta nota',
        exportButton: 'Exportar como Markdown',
        clearButton: 'Limpar Quadro',
        clearConfirm: 'Limpar o quadro inteiro?',
        emptyHint: 'Sem notas ainda',
        exportHeading: 'Retrospectiva de Sprint',
        copiedToast: 'Copiado para a área de transferência!',
      },
    }

    test('renders 3 columns with empty states and adds a note', () => {
      render(<RetroBoardTool {...defaultProps} />)

      expect(screen.getByText('Funcionou Bem')).toBeInTheDocument()
      expect(screen.getByText('A Melhorar')).toBeInTheDocument()
      expect(screen.getByText('Itens de Ação')).toBeInTheDocument()

      const inputs = screen.getAllByPlaceholderText('Adicionar nota...')
      expect(inputs.length).toBe(3)

      // Add a note to the first column
      fireEvent.change(inputs[0], { target: { value: 'Entregamos o MVP no prazo' } })
      const addButtons = screen.getAllByRole('button', { name: /adicionar/i })
      fireEvent.click(addButtons[0])

      expect(screen.getByText('Entregamos o MVP no prazo')).toBeInTheDocument()
    })

    test('allows voting and deleting notes', () => {
      render(<RetroBoardTool {...defaultProps} />)
      const inputs = screen.getAllByPlaceholderText('Adicionar nota...')
      fireEvent.change(inputs[0], { target: { value: 'Boa comunicação' } })
      const addButtons = screen.getAllByRole('button', { name: /adicionar/i })
      fireEvent.click(addButtons[0])

      // Vote
      const voteBtn = screen.getByLabelText('Votar neste item')
      expect(voteBtn).toHaveTextContent('0')
      fireEvent.click(voteBtn)
      expect(voteBtn).toHaveTextContent('1')

      // Delete
      const deleteBtn = screen.getByLabelText('Excluir esta nota')
      fireEvent.click(deleteBtn)
      expect(screen.queryByText('Boa comunicação')).not.toBeInTheDocument()
    })
  })

  describe('PlanningPokerClient', () => {
    const labels = {
      storyLabel: 'História / Tarefa',
      storyPlaceholder: 'Descreva a história ou tarefa a estimar (ex: API de Autenticação)',
      pickCardHeading: 'Escolha sua carta',
      yourPickLabel: 'Sua escolha',
      revealButton: 'Revelar Cartas',
      resetButton: 'Nova Rodada',
      consensusLabel: 'Consenso',
      averageLabel: 'Média',
      noConsensusLabel: 'Discutir',
      tabTeam: 'Modo Time / Sessão',
      tabCamera: 'Carta para Câmera',
      tabGuide: 'Guia Fibonacci',
      participantsTitle: 'Participantes da Rodada',
      addParticipant: 'Adicionar Membro',
      votingPrompt: 'Selecione o participante e clique na carta:',
      revealAll: 'Revelar Todos os Votos',
      divergenceTitle: 'Debate Recomendado',
      minVote: 'Menor',
      maxVote: 'Maior',
      saveToBacklog: 'Salvar no Backlog da Sprint',
      backlogTitle: 'Histórias Estimadas na Sessão',
      totalPoints: 'Total da Sprint',
      clearAllParticipants: 'Excluir todos',
      removeParticipant: 'Remover participante',
      noParticipantsMessage: 'Nenhum participante na rodada. Adicione os membros da equipe acima para iniciar a votação.',
    }

    test('allows team voting, reveals votes, and calculates statistics', () => {
      render(<PlanningPokerClient labels={labels} locale="pt" />)

      expect(screen.getByText('Participantes da Rodada')).toBeInTheDocument()

      // Vote 5 for first participant (Alice)
      const card5 = screen.getByRole('button', { name: '5' })
      fireEvent.click(card5)

      // Alice should have vote registered
      const revealBtn = screen.getByRole('button', { name: /revelar todos os votos/i })
      expect(revealBtn).not.toBeDisabled()
      fireEvent.click(revealBtn)

      // Results should show
      expect(screen.getByText('Resultado da Estimativa')).toBeInTheDocument()
      expect(screen.getAllByText(/5 pts/i).length).toBeGreaterThanOrEqual(1)
    })

    test('detects divergence when estimates differ and shows debate alert', () => {
      render(<PlanningPokerClient labels={labels} locale="pt" />)

      // Vote 2 for Alice
      const card2 = screen.getByRole('button', { name: '2' })
      fireEvent.click(card2)

      // Now Bruno is active: vote 8
      const card8 = screen.getByRole('button', { name: '8' })
      fireEvent.click(card8)

      // Reveal votes
      const revealBtn = screen.getByRole('button', { name: /revelar todos os votos/i })
      fireEvent.click(revealBtn)

      // Divergence banner should appear
      expect(screen.getByText('Debate Recomendado')).toBeInTheDocument()
      expect(screen.getAllByText(/2 pts/i).length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText(/8 pts/i).length).toBeGreaterThanOrEqual(1)
    })

    test('saves estimated story to sprint backlog', () => {
      render(<PlanningPokerClient labels={labels} locale="pt" />)

      const storyInput = screen.getByPlaceholderText(/Descreva a história ou tarefa a estimar/i)
      fireEvent.change(storyInput, { target: { value: 'API de Notificações' } })

      const card3 = screen.getByRole('button', { name: '3' })
      fireEvent.click(card3)

      const revealBtn = screen.getByRole('button', { name: /revelar todos os votos/i })
      fireEvent.click(revealBtn)

      const saveBacklogBtn = screen.getByRole('button', { name: /salvar no backlog/i })
      fireEvent.click(saveBacklogBtn)

      expect(screen.getByText('Histórias Estimadas na Sessão')).toBeInTheDocument()
      expect(screen.getByText('API de Notificações')).toBeInTheDocument()
      expect(screen.getByText('3 pts')).toBeInTheDocument()
    })

    test('switches to camera mode', () => {
      render(<PlanningPokerClient labels={labels} locale="pt" />)

      const cameraTab = screen.getByRole('tab', { name: /carta para câmera/i })
      fireEvent.click(cameraTab)

      expect(screen.getByText(/contagem regressiva/i)).toBeInTheDocument()
    })

    test('allows deleting all participants with clear all button and shows empty state', () => {
      render(<PlanningPokerClient labels={labels} locale="pt" />)

      expect(screen.getAllByText(/Alice/i).length).toBeGreaterThanOrEqual(1)
      const clearAllBtn = screen.getByRole('button', { name: /excluir todos/i })
      fireEvent.click(clearAllBtn)

      expect(screen.queryByText(/Alice/i)).not.toBeInTheDocument()
      expect(screen.getByText(/Nenhum participante na rodada/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /revelar todos os votos/i })).toBeDisabled()
    })

    test('allows deleting individual participants down to zero', () => {
      render(<PlanningPokerClient labels={labels} locale="pt" />)

      const removeBtns = screen.getAllByRole('button', { name: /remover participante/i })
      removeBtns.forEach((btn) => fireEvent.click(btn))

      expect(screen.getByText(/Nenhum participante na rodada/i)).toBeInTheDocument()
    })

    test('renders practical fibonacci scale and complexity guide with readable descriptions', () => {
      render(<PlanningPokerClient labels={labels} locale="pt" />)

      const guideTab = screen.getByRole('tab', { name: /guia fibonacci/i })
      fireEvent.click(guideTab)

      expect(screen.getByText('Guia Prático da Escala Fibonacci e Complexidade')).toBeInTheDocument()
      expect(screen.getByText('1 Ponto (Muito Simples / PP)')).toBeInTheDocument()
      expect(screen.getByText(/Alterações pontuais, correção de texto ou ajuste de estilo/i)).toBeInTheDocument()
      expect(screen.getByText('13 Pontos (Muito Grande / GG)')).toBeInTheDocument()
    })
  })

  describe('SprintDateCalculatorClient', () => {
    const labels = {
      startDateLabel: 'Data de Início do Sprint',
      sprintLengthLabel: 'Duração do Sprint',
      twoWeeks: '2 semanas',
      threeWeeks: '3 semanas',
      fourWeeks: '4 semanas',
      calculateButton: 'Calcular Datas',
      copyButton: 'Copiar',
      copiedButton: 'Copiado!',
      sprintNumber: 'Sprint',
      planningLabel: 'Sprint Planning',
      reviewLabel: 'Sprint Review',
      retroLabel: 'Sprint Retrospective',
      sprintEndLabel: 'Fim do Sprint',
      dailyStandupsLabel: 'Standups Diários',
      weekdaysOnlyNote: 'Apenas dias úteis',
    }

    test('calculates sprint dates and renders ceremonies in Portuguese', () => {
      render(<SprintDateCalculatorClient labels={labels} locale="pt" />)

      const calcBtn = screen.getByRole('button', { name: /calcular datas/i })
      fireEvent.click(calcBtn)

      expect(screen.getByText('Cronograma da Sprint')).toBeInTheDocument()
      expect(screen.getByText(/Sprint Planning \(Início\)/i)).toBeInTheDocument()
      expect(screen.getByText(/Sprint Review/i)).toBeInTheDocument()
      expect(screen.getByText(/Sprint Retrospective/i)).toBeInTheDocument()
    })
  })

  describe('StandupGeneratorClient', () => {
    const labels = {
      yesterday: 'Ontem',
      yesterdayPlaceholder: 'O que você completou ontem? (um item por linha)',
      today: 'Hoje',
      todayPlaceholder: 'No que você está trabalhando hoje? (um item por linha)',
      blockers: 'Bloqueios',
      blockersPlaceholder: 'Algum bloqueio?',
      noBlockers: 'Nenhum',
      prsAndTickets: 'PRs e Tickets (opcional)',
      prsAndTicketsPlaceholder: 'ex: #142',
      status: 'Disponibilidade / Status (opcional)',
      statusNormal: 'Normal (em desenvolvimento)',
      formatSlack: 'Slack / Discord',
      formatTeams: 'Microsoft Teams',
      formatMarkdown: 'Markdown',
      formatPlain: 'Texto Puro',
      autoBullets: 'Formatar linhas como tópicos',
      saveHistory: 'Salvar Hoje para Amanhã',
      loadYesterday: "Carregar 'Hoje' de Ontem",
      loadExample: 'Carregar Exemplo',
      historyLoaded: 'Ontem carregado do histórico!',
      historySaved: 'Salvo no navegador para amanhã!',
      generateButton: 'Gerar Standup',
      copyButton: 'Copiar Standup',
      copiedButton: 'Copiado!',
      clearButton: 'Limpar',
      outputHeading: 'Prévia do Standup',
      yesterdayHeading: 'Ontem',
      todayHeading: 'Hoje',
      blockersHeading: 'Bloqueios',
      prsHeading: 'PRs / Tickets',
      statusHeading: 'Status',
    }

    test('generates formatted standup summary with auto bullets in live preview', () => {
      render(<StandupGeneratorClient labels={labels} locale="pt" />)

      const yesterdayInput = screen.getByPlaceholderText('O que você completou ontem? (um item por linha)')
      const todayInput = screen.getByPlaceholderText('No que você está trabalhando hoje? (um item por linha)')

      fireEvent.change(yesterdayInput, { target: { value: 'Finalizei a refatoração' } })
      fireEvent.change(todayInput, { target: { value: 'Iniciando testes unitários' } })

      // Live preview should immediately display formatted content
      expect(screen.getByText('Prévia do Standup')).toBeInTheDocument()
      expect(screen.getAllByText(/Finalizei a refatoração/).length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText(/Iniciando testes unitários/).length).toBeGreaterThanOrEqual(1)
      expect(screen.getByText(/Nenhum/)).toBeInTheDocument()
    })

    test('allows switching output formats to Markdown and Teams', () => {
      render(<StandupGeneratorClient labels={labels} locale="pt" />)

      const yesterdayInput = screen.getByPlaceholderText('O que você completou ontem? (um item por linha)')
      const todayInput = screen.getByPlaceholderText('No que você está trabalhando hoje? (um item por linha)')

      fireEvent.change(yesterdayInput, { target: { value: 'Tarefa A' } })
      fireEvent.change(todayInput, { target: { value: 'Tarefa B' } })

      // Default is Slack format (with emojis)
      expect(screen.getByText(/✅ Ontem:/)).toBeInTheDocument()

      // Switch to Markdown
      const markdownTab = screen.getByRole('tab', { name: /markdown/i })
      fireEvent.click(markdownTab)

      expect(screen.getByText(/### Ontem/)).toBeInTheDocument()
    })

    test('loads realistic example and allows clearing all fields', () => {
      render(<StandupGeneratorClient labels={labels} locale="pt" />)

      const exampleBtn = screen.getByRole('button', { name: /carregar exemplo/i })
      fireEvent.click(exampleBtn)

      expect(screen.getAllByText(/Revisão e merge da PR #142/).length).toBeGreaterThanOrEqual(1)

      const clearBtn = screen.getByRole('button', { name: /limpar/i })
      fireEvent.click(clearBtn)

      const yesterdayInput = screen.getByPlaceholderText('O que você completou ontem? (um item por linha)')
      expect(yesterdayInput).toHaveValue('')
    })
  })

  describe('UserStoryWriterClient', () => {
    const labels = {
      roleLabel: 'Papel / Persona',
      rolePlaceholder: 'ex: cliente',
      featureLabel: 'Funcionalidade / Ação',
      featurePlaceholder: 'ex: pagar com Pix',
      benefitLabel: 'Benefício / Objetivo',
      benefitPlaceholder: 'ex: aprovar imediatamente',
      criteriaLabel: 'Critérios de Aceitação',
      criteriaPlaceholder: 'Dado/Quando/Então',
      generateButton: 'Gerar História',
      copyButton: 'Copiar',
      copiedButton: 'Copiado!',
      clearButton: 'Limpar',
      outputHeading: 'User Story',
      storyLabel: 'História',
      acceptanceCriteriaLabel: 'Critérios de Aceitação',
    }

    test('generates localized user story in Portuguese', () => {
      render(<UserStoryWriterClient labels={labels} locale="pt" />)

      fireEvent.change(screen.getByPlaceholderText('ex: cliente'), { target: { value: 'cliente' } })
      fireEvent.change(screen.getByPlaceholderText('ex: pagar com Pix'), { target: { value: 'pagar via Pix' } })
      fireEvent.change(screen.getByPlaceholderText('ex: aprovar imediatamente'), { target: { value: 'ter meu pedido aprovado na hora' } })

      const generateBtn = screen.getByRole('button', { name: /gerar história/i })
      fireEvent.click(generateBtn)

      expect(screen.getByText(/Como cliente, eu quero pagar via Pix, para que ter meu pedido aprovado na hora\./)).toBeInTheDocument()
    })

    test('generates localized user story in English', () => {
      render(<UserStoryWriterClient labels={labels} locale="en" />)

      fireEvent.change(screen.getByPlaceholderText('ex: cliente'), { target: { value: 'shopper' } })
      fireEvent.change(screen.getByPlaceholderText('ex: pagar com Pix'), { target: { value: 'pay with credit card' } })
      fireEvent.change(screen.getByPlaceholderText('ex: aprovar imediatamente'), { target: { value: 'complete checkout quickly' } })

      const generateBtn = screen.getByRole('button', { name: /gerar história/i })
      fireEvent.click(generateBtn)

      expect(screen.getByText(/As a shopper, I want to pay with credit card, so that complete checkout quickly\./)).toBeInTheDocument()
    })

    test('loads realistic example with BDD scenarios', () => {
      render(<UserStoryWriterClient labels={labels} locale="pt" />)

      const exampleBtn = screen.getByRole('button', { name: /e-commerce/i })
      fireEvent.click(exampleBtn)

      const generateBtn = screen.getByRole('button', { name: /gerar história/i })
      fireEvent.click(generateBtn)

      expect(screen.getByText(/Como cliente da loja, eu quero aplicar um cupom de desconto no checkout/)).toBeInTheDocument()
      expect(screen.getByText(/Cupom válido aplicado/)).toBeInTheDocument()
    })

    test('switches to technical enabler mode and generates technical story', () => {
      render(<UserStoryWriterClient labels={labels} locale="pt" />)

      const techTab = screen.getByRole('tab', { name: /enabler técnico/i })
      fireEvent.click(techTab)

      fireEvent.change(screen.getByPlaceholderText(/Backend, Infraestrutura/i), { target: { value: 'DevOps' } })
      fireEvent.change(screen.getByPlaceholderText(/implementar índices particionados/i), { target: { value: 'configurar pipeline CI/CD' } })
      fireEvent.change(screen.getByPlaceholderText(/reduzir latência/i), { target: { value: 'automatizar deploys sem downtime' } })

      const generateBtn = screen.getByRole('button', { name: /gerar história/i })
      fireEvent.click(generateBtn)

      expect(screen.getByText(/Como equipe de DevOps, precisamos configurar pipeline CI\/CD, para automatizar deploys sem downtime\./)).toBeInTheDocument()
    })

    test('saves generated story to session backlog', () => {
      render(<UserStoryWriterClient labels={labels} locale="pt" />)

      fireEvent.change(screen.getByPlaceholderText('ex: cliente'), { target: { value: 'usuário' } })
      fireEvent.change(screen.getByPlaceholderText('ex: pagar com Pix'), { target: { value: 'editar meu perfil' } })
      fireEvent.change(screen.getByPlaceholderText('ex: aprovar imediatamente'), { target: { value: 'manter dados atualizados' } })

      const generateBtn = screen.getByRole('button', { name: /gerar história/i })
      fireEvent.click(generateBtn)

      const saveBtn = screen.getByRole('button', { name: /salvar/i })
      fireEvent.click(saveBtn)

      expect(screen.getByText(/usuário - editar meu perfil/)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /copiar todas/i })).toBeInTheDocument()
    })
  })
})
