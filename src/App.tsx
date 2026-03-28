import { useState } from 'react'
import { Sidebar, Header, MissionControl, PayloadFactory, MultiStageAccess, Infrastructure } from './components'

export default function App() {
  const [currentView, setCurrentView] = useState('mission-control')

  const renderView = () => {
    switch (currentView) {
      case 'mission-control':
        return <MissionControl />
      case 'payload-factory':
        return <PayloadFactory />
      case 'multi-stage':
        return <MultiStageAccess />
      case 'infrastructure':
        return <Infrastructure />
      default:
        return <MissionControl />
    }
  }

  const getViewTitle = () => {
    switch (currentView) {
      case 'mission-control':
        return 'Mission Control'
      case 'payload-factory':
        return 'Payload Factory'
      case 'multi-stage':
        return 'Multi-Stage Access'
      case 'infrastructure':
        return 'Infrastructure'
      default:
        return 'Mission Control'
    }
  }

  return (
    <div className="flex h-screen bg-charcoal">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getViewTitle()} />
        <main className="flex-1 overflow-auto bg-charcoal">
          <div className="p-8">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  )
}
