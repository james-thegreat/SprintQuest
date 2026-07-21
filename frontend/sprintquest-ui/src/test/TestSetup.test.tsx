import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

function TestGreeting() {
  return <h1>SprintQuest testing is ready</h1>
}

describe('frontend test setup', () => {
  it('renders a React component with Jest-DOM matchers', () => {
    // Act
    render(<TestGreeting />)

    // Assert
    expect(
      screen.getByRole('heading', {
        name: 'SprintQuest testing is ready',
      }),
    ).toBeInTheDocument()
  })
})
