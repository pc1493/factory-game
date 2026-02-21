import { Component, type ReactNode } from 'react'
import { GameBoard } from './components/GameBoard'

class ErrorBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state = { error: null }
  static getDerivedStateFromError(e: Error) {
    // Nuke any bad save so next reload is clean
    try { localStorage.removeItem('factory-automation-save') } catch (_) {}
    return { error: e.message }
  }
  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-4 p-8">
          <div className="text-4xl">💥</div>
          <h1 className="text-xl font-bold">Something crashed</h1>
          <p className="text-white/50 text-sm font-mono max-w-md text-center">{this.state.error}</p>
          <button
            className="mt-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-semibold hover:bg-indigo-500"
            onClick={() => { localStorage.removeItem('factory-automation-save'); window.location.reload() }}
          >
            Clear save &amp; reload
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <GameBoard />
    </ErrorBoundary>
  )
}
