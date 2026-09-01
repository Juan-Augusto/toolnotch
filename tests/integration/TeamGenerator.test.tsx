import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import TeamGenerator from '@/components/fun/TeamGenerator'

jest.mock('next-intl', () => ({
  useTranslations: (namespace?: string) => {
    return (key: string, params?: Record<string, string | number>) => {
      let text = `${namespace}.${key}`
      if (params) {
        Object.entries(params).forEach(([k, v]) => {
          text = text.replace(`{${k}}`, String(v))
        })
      }
      return text
    }
  },
}))

describe('TeamGenerator Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn().mockResolvedValue(undefined),
      },
    })
  })

  test('renders initial empty participants list and mode options', () => {
    render(<TeamGenerator />)

    expect(screen.getByText('fun.teamGenerator.participants.title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('fun.teamGenerator.participants.inputPlaceholder')).toBeInTheDocument()
    expect(screen.getByText('fun.teamGenerator.participants.empty')).toBeInTheDocument()
    expect(screen.getByText('fun.teamGenerator.mode.byTeams')).toBeInTheDocument()
    expect(screen.getByText('fun.teamGenerator.mode.byTeamSize')).toBeInTheDocument()
    expect(screen.getByText('fun.teamGenerator.mode.byTeamNames')).toBeInTheDocument()
    const generateBtn = screen.getByRole('button', { name: /fun\.teamGenerator\.button\.generate/i })
    expect(generateBtn).toBeDisabled()
  })

  test('adds and removes participants', async () => {
    render(<TeamGenerator />)

    const input = screen.getByPlaceholderText('fun.teamGenerator.participants.inputPlaceholder')
    const addBtn = screen.getByRole('button', { name: /fun\.teamGenerator\.participants\.addButton/i })

    // Add new participant
    fireEvent.change(input, { target: { value: 'Zack Walker' } })
    fireEvent.click(addBtn)

    expect(screen.getByText('Zack Walker')).toBeInTheDocument()

    // Remove participant
    const removeBtn = screen.getByLabelText('Remover Zack Walker')
    fireEvent.click(removeBtn)

    await waitFor(() => {
      expect(screen.queryByText('Zack Walker')).not.toBeInTheDocument()
    })
  })

  test('loads sample participants and validates team count', async () => {
    render(<TeamGenerator />)

    // Load sample participants
    const sampleBtn = screen.getByRole('button', { name: /fun\.teamGenerator\.participants\.loadSample/i })
    fireEvent.click(sampleBtn)

    const teamCountInput = screen.getByRole('spinbutton')
    const generateBtn = screen.getByRole('button', { name: /fun\.teamGenerator\.button\.generate/i })

    expect(generateBtn).not.toBeDisabled()

    // Enter invalid team count > participants count (e.g. 15)
    fireEvent.change(teamCountInput, { target: { value: '15' } })

    expect(screen.getByText(/fun\.teamGenerator\.errors\.invalidTeamCountMax/i)).toBeInTheDocument()
    expect(teamCountInput).toHaveAttribute('aria-invalid', 'true')
    expect(generateBtn).toBeDisabled()

    // Enter invalid team count < 2 (e.g. 1)
    fireEvent.change(teamCountInput, { target: { value: '1' } })
    expect(screen.getByText(/fun\.teamGenerator\.errors\.invalidTeamCountMin/i)).toBeInTheDocument()
    expect(generateBtn).toBeDisabled()

    // Fix to valid team count (e.g. 3)
    fireEvent.change(teamCountInput, { target: { value: '3' } })
    expect(screen.queryByText(/fun\.teamGenerator\.errors\.invalidTeamCount/i)).not.toBeInTheDocument()
    expect(generateBtn).not.toBeDisabled()
  })

  test('switches to team size mode and validates team size', async () => {
    render(<TeamGenerator />)

    // Load sample participants (10 participants)
    const sampleBtn = screen.getByRole('button', { name: /fun\.teamGenerator\.participants\.loadSample/i })
    fireEvent.click(sampleBtn)

    // Switch to By Team Size tab
    const sizeTab = screen.getByText('fun.teamGenerator.mode.byTeamSize')
    fireEvent.click(sizeTab)

    expect(screen.getByText('fun.teamGenerator.teamSize.label')).toBeInTheDocument()

    const sizeInput = screen.getByRole('spinbutton')
    const generateBtn = screen.getByRole('button', { name: /fun\.teamGenerator\.button\.generate/i })

    // Set invalid size >= total (e.g. 10)
    fireEvent.change(sizeInput, { target: { value: '10' } })

    expect(screen.getByText(/fun\.teamGenerator\.errors\.invalidTeamSizeMax/i)).toBeInTheDocument()
    expect(generateBtn).toBeDisabled()

    // Set invalid size < 1 (e.g. 0)
    fireEvent.change(sizeInput, { target: { value: '0' } })
    expect(screen.getByText(/fun\.teamGenerator\.errors\.invalidTeamSizeMin/i)).toBeInTheDocument()
    expect(generateBtn).toBeDisabled()

    // Set valid size (e.g. 3)
    fireEvent.change(sizeInput, { target: { value: '3' } })
    expect(screen.queryByText(/fun\.teamGenerator\.errors/i)).not.toBeInTheDocument()
    expect(generateBtn).not.toBeDisabled()

    // Generate teams
    fireEvent.click(generateBtn)
    await waitFor(() => {
      expect(screen.getByText(/fun\.teamGenerator\.results\.title/i)).toBeInTheDocument()
    })
  })

  test('switches to custom team names mode, configures teams and generates groups', async () => {
    render(<TeamGenerator />)

    // Load sample participants
    const sampleBtn = screen.getByRole('button', { name: /fun\.teamGenerator\.participants\.loadSample/i })
    fireEvent.click(sampleBtn)

    // Switch to By Team Names tab
    const teamNamesTab = screen.getByText('fun.teamGenerator.mode.byTeamNames')
    fireEvent.click(teamNamesTab)

    expect(screen.getByText('fun.teamGenerator.teamNames.title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('fun.teamGenerator.teamNames.inputPlaceholder')).toBeInTheDocument()

    const teamInput = screen.getByPlaceholderText('fun.teamGenerator.teamNames.inputPlaceholder')
    const addTeamBtn = screen.getByRole('button', { name: /fun\.teamGenerator\.teamNames\.addButton/i })
    const generateBtn = screen.getByRole('button', { name: /fun\.teamGenerator\.button\.generate/i })

    // Initially custom teams empty -> error min teams & button disabled
    expect(screen.getByText(/fun\.teamGenerator\.errors\.invalidCustomTeamNamesMin/i)).toBeInTheDocument()
    expect(generateBtn).toBeDisabled()

    // Add first team
    fireEvent.change(teamInput, { target: { value: 'Time Backend' } })
    fireEvent.click(addTeamBtn)
    expect(screen.getByText('Time Backend')).toBeInTheDocument()
    expect(generateBtn).toBeDisabled()

    // Add second team
    fireEvent.change(teamInput, { target: { value: 'Time Frontend' } })
    fireEvent.click(addTeamBtn)
    expect(screen.getByText('Time Frontend')).toBeInTheDocument()

    // Now valid!
    expect(screen.queryByText(/fun\.teamGenerator\.errors/i)).not.toBeInTheDocument()
    expect(generateBtn).not.toBeDisabled()

    // Generate teams
    fireEvent.click(generateBtn)

    await waitFor(() => {
      expect(screen.getAllByText('Time Backend').length).toBeGreaterThanOrEqual(2)
      expect(screen.getAllByText('Time Frontend').length).toBeGreaterThanOrEqual(2)
    })
  })

  test('generates teams and displays identifier badge on teams with fewer members', async () => {
    render(<TeamGenerator />)

    // Add 7 participants
    const input = screen.getByPlaceholderText('fun.teamGenerator.participants.inputPlaceholder')
    const addBtn = screen.getByRole('button', { name: /fun\.teamGenerator\.participants\.addButton/i })
    const names = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace']
    for (const name of names) {
      fireEvent.change(input, { target: { value: name } })
      fireEvent.click(addBtn)
    }

    // Set 2 teams (7 participants divided into 2 teams -> sizes 4 and 3)
    const teamCountInput = screen.getByRole('spinbutton')
    fireEvent.change(teamCountInput, { target: { value: '2' } })

    const generateBtn = screen.getByRole('button', { name: /fun\.teamGenerator\.button\.generate/i })
    fireEvent.click(generateBtn)

    await waitFor(() => {
      expect(screen.getByText(/fun\.teamGenerator\.results\.title/i)).toBeInTheDocument()
      expect(screen.getByText(/fun\.teamGenerator\.results\.balancedNotice/i)).toBeInTheDocument()
      // One team will have fewer members (3 members vs 4 members) and display the fewerMembers badge
      expect(screen.getByText(/fun\.teamGenerator\.results\.fewerMembers/i)).toBeInTheDocument()
    })
  })

  test('copies generated teams to clipboard', async () => {
    render(<TeamGenerator />)

    // Load sample participants
    const sampleBtn = screen.getByRole('button', { name: /fun\.teamGenerator\.participants\.loadSample/i })
    fireEvent.click(sampleBtn)

    const generateBtn = screen.getByRole('button', { name: /fun\.teamGenerator\.button\.generate/i })
    fireEvent.click(generateBtn)

    await waitFor(() => {
      expect(screen.getByText(/fun\.teamGenerator\.results\.title/i)).toBeInTheDocument()
    })

    const copyBtn = screen.getByRole('button', { name: /fun\.teamGenerator\.results\.copyAll/i })
    fireEvent.click(copyBtn)

    expect(navigator.clipboard.writeText).toHaveBeenCalled()
    await waitFor(() => {
      expect(screen.getByText(/fun\.teamGenerator\.results\.copied/i)).toBeInTheDocument()
    })
  })
})
