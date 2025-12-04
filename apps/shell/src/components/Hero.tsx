import { Button } from '@xentri/ui'

export function Hero() {
  return (
    <div className="shell">
      <h1>Xentri Shell</h1>
      <p>Your Business OS is initializing...</p>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Button variant="default">Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </div>
  )
}
