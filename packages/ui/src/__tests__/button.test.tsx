import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button, buttonVariants } from '../components/button.js'

describe('Button', () => {
  it('renders with default variant and size', () => {
    render(<Button>Click me</Button>)
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeDefined()
  })

  it('renders with custom text', () => {
    render(<Button>Custom Text</Button>)
    expect(screen.getByText('Custom Text')).toBeDefined()
  })

  it('applies variant classes correctly', () => {
    const { container } = render(<Button variant="secondary">Secondary</Button>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('bg-[var(--color-secondary)]')
  })

  it('applies size classes correctly', () => {
    const { container } = render(<Button size="lg">Large</Button>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('h-12')
  })

  it('forwards ref correctly', () => {
    const ref = { current: null as HTMLButtonElement | null }
    render(<Button ref={ref}>With Ref</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('passes through HTML attributes', () => {
    render(
      <Button disabled data-testid="test-btn">
        Disabled
      </Button>
    )
    const button = screen.getByTestId('test-btn')
    expect(button).toHaveProperty('disabled', true)
  })

  it('merges custom className with variants', () => {
    const { container } = render(<Button className="custom-class">Custom</Button>)
    const button = container.querySelector('button')
    expect(button?.className).toContain('custom-class')
  })
})

describe('buttonVariants', () => {
  it('returns default classes without options', () => {
    const classes = buttonVariants()
    expect(classes).toContain('inline-flex')
    expect(classes).toContain('h-10')
  })

  it('returns variant-specific classes', () => {
    const outlineClasses = buttonVariants({ variant: 'outline' })
    expect(outlineClasses).toContain('border')
    expect(outlineClasses).toContain('bg-transparent')
  })

  it('returns size-specific classes', () => {
    const smClasses = buttonVariants({ size: 'sm' })
    expect(smClasses).toContain('h-8')
    expect(smClasses).toContain('text-xs')
  })
})
