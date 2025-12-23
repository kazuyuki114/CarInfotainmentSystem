import { useState } from 'react';
import { MonitoringDisplay } from './components/MonitoringDisplay';
import { DeviceControls } from './components/DeviceControls';
import { DrivingGuidance } from './components/DrivingGuidance';
import { AutomatedFeatures } from './components/AutomatedFeatures';
import { MobileConnect } from './components/MobileConnect';
import { Navigation } from './components/Navigation';

export type Screen = 'monitoring' | 'devices' | 'guidance' | 'automated' | 'mobile';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('monitoring');

  return (
    <div className="h-screen w-screen bg-neutral-900 flex overflow-hidden">
      <Navigation activeScreen={activeScreen} onScreenChange={setActiveScreen} />
      
      <main className="flex-1 overflow-auto">
        {activeScreen === 'monitoring' && <MonitoringDisplay />}
        {activeScreen === 'devices' && <DeviceControls />}
        {activeScreen === 'guidance' && <DrivingGuidance />}
        {activeScreen === 'automated' && <AutomatedFeatures />}
        {activeScreen === 'mobile' && <MobileConnect />}
      </main>
    </div>
  );
}
