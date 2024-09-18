import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { describe, it } from 'node:test'
 
describe('Page', () => {
  it('renders a heading', () => {
    render(
      <div>
        <p>Jest is working</p>
      </div>
    )
 
    const heading = screen.getByRole('heading', { level: 1 })
 
    expect(heading).toBeInTheDocument()
  })
})