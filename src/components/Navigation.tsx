import { Gauge, Settings, Navigation as NavIcon, Cpu, Smartphone } from 'lucide-react';
import type { Screen } from '../App';

interface NavigationProps {
  activeScreen: Screen;
  onScreenChange: (screen: Screen) => void;
}

const navItems = [
  { id: 'monitoring' as Screen, icon: Gauge, label: 'Monitor' },
  { id: 'devices' as Screen, icon: Settings, label: 'Devices' },
  { id: 'guidance' as Screen, icon: NavIcon, label: 'Guidance' },
  { id: 'automated' as Screen, icon: Cpu, label: 'Automated' },
  { id: 'mobile' as Screen, icon: Smartphone, label: 'Mobile' },
];

export function Navigation({ activeScreen, onScreenChange }: NavigationProps) {
  return (
    <nav className="w-24 bg-neutral-950 border-r border-neutral-800 flex flex-col items-center py-8 gap-6">
      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-8">
        <span className="text-white">EV</span>
      </div>
      
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeScreen === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onScreenChange(item.id)}
            className={`flex flex-col items-center gap-2 px-3 py-3 rounded-lg transition-all ${
              isActive 
                ? 'bg-blue-600 text-white' 
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
