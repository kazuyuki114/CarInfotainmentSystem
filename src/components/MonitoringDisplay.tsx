import { useState } from 'react';
import { Gauge, Thermometer, Droplet, Battery, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';

export function MonitoringDisplay() {
  const [selectedTire, setSelectedTire] = useState<number | null>(null);
  
  const tires = [
    { id: 1, position: 'Front Left', pressure: 32, status: 'optimal', x: 30, y: 25 },
    { id: 2, position: 'Front Right', pressure: 31, status: 'warning', x: 70, y: 25 },
    { id: 3, position: 'Rear Left', pressure: 32, status: 'optimal', x: 30, y: 75 },
    { id: 4, position: 'Rear Right', pressure: 32, status: 'optimal', x: 70, y: 75 },
  ];

  const [fuelData] = useState({
    current: 5.8,
    average: 6.2,
    trend: 'down' as 'up' | 'down',
    range: 412,
  });

  return (
    <div className="h-full bg-neutral-900 text-white p-8">
      <h1 className="text-3xl mb-8">Vehicle Monitoring</h1>
      
      <div className="grid grid-cols-3 gap-6 h-[calc(100%-5rem)]">
        {/* Tire Pressure Monitor */}
        <div className="col-span-2 bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
          <div className="flex items-center gap-3 mb-6">
            <Gauge className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl">Tire Pressure Monitor</h2>
          </div>
          
          <div className="relative h-[400px] bg-neutral-900 rounded-xl p-8">
            {/* Car visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-96 border-4 border-neutral-600 rounded-3xl">
                {/* Car body outline */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-32 h-48 border-2 border-neutral-600 rounded-lg"></div>
              </div>
            </div>
            
            {/* Tire indicators */}
            {tires.map((tire) => (
              <button
                key={tire.id}
                onClick={() => setSelectedTire(tire.id)}
                style={{ left: `${tire.x}%`, top: `${tire.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-2xl border-2 transition-all ${
                  tire.status === 'warning' 
                    ? 'bg-amber-500/20 border-amber-500' 
                    : 'bg-green-500/20 border-green-500'
                } ${selectedTire === tire.id ? 'scale-110 ring-4 ring-blue-500' : 'hover:scale-105'}`}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-2xl">{tire.pressure}</span>
                  <span className="text-xs text-neutral-400">PSI</span>
                </div>
              </button>
            ))}
          </div>
          
          {selectedTire && (
            <div className="mt-4 p-4 bg-neutral-900 rounded-xl">
              <h3 className="mb-2">{tires.find(t => t.id === selectedTire)?.position}</h3>
              <div className="flex gap-4 text-sm text-neutral-400">
                <span>Pressure: <span className="text-white">{tires.find(t => t.id === selectedTire)?.pressure} PSI</span></span>
                <span>Recommended: <span className="text-white">32-35 PSI</span></span>
                <span>Temperature: <span className="text-white">68°F</span></span>
              </div>
            </div>
          )}
        </div>

        {/* Right column - Stats */}
        <div className="flex flex-col gap-6">
          {/* Outside Temperature */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Thermometer className="w-6 h-6" />
              <h2 className="text-lg">Outside Temp</h2>
            </div>
            <div className="text-5xl">72°F</div>
            <div className="text-sm text-blue-200 mt-2">Comfortable conditions</div>
          </div>

          {/* Fuel Consumption */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700 flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Droplet className="w-6 h-6 text-green-400" />
              <h2 className="text-lg">Fuel Economy</h2>
            </div>
            
            <div className="flex items-end gap-3 mb-4">
              <div className="text-4xl">{fuelData.current}</div>
              <div className="text-neutral-400 mb-2">L/100km</div>
              {fuelData.trend === 'down' ? (
                <TrendingDown className="w-6 h-6 text-green-400 mb-2" />
              ) : (
                <TrendingUp className="w-6 h-6 text-amber-400 mb-2" />
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-400">Average</span>
                <span>{fuelData.average} L/100km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Range</span>
                <span>{fuelData.range} km</span>
              </div>
            </div>

            {/* Fuel consumption chart */}
            <div className="mt-4 flex items-end gap-1 h-20">
              {[6.5, 6.2, 5.9, 6.1, 5.8, 5.7, 5.8, 6.0, 5.9, 5.8].map((value, i) => (
                <div key={i} className="flex-1 bg-green-500/30 rounded-t" style={{ height: `${(value / 7) * 100}%` }}></div>
              ))}
            </div>
          </div>

          {/* Battery Status */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <div className="flex items-center gap-3 mb-4">
              <Battery className="w-6 h-6 text-green-400" />
              <h2 className="text-lg">Battery</h2>
            </div>
            
            <div className="text-3xl mb-2">87%</div>
            <div className="h-3 bg-neutral-900 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-gradient-to-r from-green-500 to-green-400 w-[87%]"></div>
            </div>
            <div className="text-sm text-neutral-400">~342 km remaining</div>
          </div>

          {/* Alerts */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <h2 className="text-sm">Alert</h2>
            </div>
            <p className="text-sm text-neutral-300">Front right tire pressure slightly low. Check soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
