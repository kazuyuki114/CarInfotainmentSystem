import { useState } from 'react';
import { Wind, Lightbulb, Armchair, Plus, Minus, Power, Fan, Droplet } from 'lucide-react';

export function DeviceControls() {
  const [acTemp, setAcTemp] = useState(22);
  const [acFanSpeed, setAcFanSpeed] = useState(3);
  const [acMode, setAcMode] = useState<'auto' | 'cool' | 'heat'>('auto');
  const [acPower, setAcPower] = useState(true);
  
  const [lights, setLights] = useState({
    headlights: true,
    interior: false,
    ambient: true,
    ambientColor: '#3b82f6',
  });

  const [seats, setSeats] = useState({
    driverHeat: 2,
    passengerHeat: 0,
    driverVent: false,
    passengerVent: false,
  });

  const ambientColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

  return (
    <div className="h-full bg-neutral-900 text-white p-8 overflow-auto">
      <h1 className="text-3xl mb-8">Device Controls</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Climate Control */}
        <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Wind className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl">Climate Control</h2>
            </div>
            <button
              onClick={() => setAcPower(!acPower)}
              className={`p-3 rounded-full transition-colors ${
                acPower ? 'bg-blue-600 text-white' : 'bg-neutral-700 text-neutral-400'
              }`}
            >
              <Power className="w-5 h-5" />
            </button>
          </div>

          {acPower && (
            <div className="space-y-6">
              {/* Temperature Control */}
              <div className="bg-neutral-900 rounded-xl p-6">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">{acTemp}°</div>
                  <div className="text-neutral-400">Target Temperature</div>
                </div>
                
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setAcTemp(Math.max(16, acTemp - 0.5))}
                    className="w-12 h-12 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="w-48 h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-red-500"
                      style={{ width: `${((acTemp - 16) / (30 - 16)) * 100}%` }}
                    ></div>
                  </div>
                  <button
                    onClick={() => setAcTemp(Math.min(30, acTemp + 0.5))}
                    className="w-12 h-12 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <div className="text-sm text-neutral-400 mb-3">Mode</div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setAcMode('auto')}
                    className={`py-3 px-4 rounded-lg capitalize transition-colors ${
                      acMode === 'auto'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                        : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                    }`}
                  >
                    auto
                  </button>
                  <button
                    onClick={() => setAcMode('cool')}
                    className={`py-3 px-4 rounded-lg capitalize transition-colors ${
                      acMode === 'cool'
                        ? 'bg-blue-600 text-white'
                        : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                    }`}
                  >
                    cool
                  </button>
                  <button
                    onClick={() => setAcMode('heat')}
                    className={`py-3 px-4 rounded-lg capitalize transition-colors ${
                      acMode === 'heat'
                        ? 'bg-orange-500 text-white'
                        : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                    }`}
                  >
                    heat
                  </button>
                </div>
              </div>

              {/* Fan Speed */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-neutral-400">Fan Speed</div>
                  <div className="text-sm">{acFanSpeed}/5</div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setAcFanSpeed(Math.max(1, acFanSpeed - 1))}
                    className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <div className="flex-1 flex items-center gap-2">
                    <Fan className="w-5 h-5 text-neutral-400" />
                    {[1, 2, 3, 4, 5].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => setAcFanSpeed(speed)}
                        className={`flex-1 h-2 rounded-full transition-all ${
                          speed <= acFanSpeed ? 'bg-blue-500' : 'bg-neutral-700'
                        }`}
                      ></button>
                    ))}
                  </div>

                  <button
                    onClick={() => setAcFanSpeed(Math.min(5, acFanSpeed + 1))}
                    className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Zone Control */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-700/50 rounded-lg p-4 text-center">
                  <div className="text-sm text-neutral-400 mb-2">Driver</div>
                  <div className="text-2xl">{acTemp}°</div>
                </div>
                <div className="bg-neutral-700/50 rounded-lg p-4 text-center">
                  <div className="text-sm text-neutral-400 mb-2">Passenger</div>
                  <div className="text-2xl">{acTemp}°</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Lighting Control */}
        <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl">Lighting</h2>
          </div>

          <div className="space-y-4">
            {/* Headlights */}
            <div className="bg-neutral-900 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="mb-1">Headlights</div>
                <div className="text-sm text-neutral-400">Auto mode enabled</div>
              </div>
              <button
                onClick={() => setLights({ ...lights, headlights: !lights.headlights })}
                className={`w-16 h-8 rounded-full transition-colors relative ${
                  lights.headlights ? 'bg-blue-600' : 'bg-neutral-700'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  lights.headlights ? 'translate-x-9' : 'translate-x-1'
                }`}></div>
              </button>
            </div>

            {/* Interior Lights */}
            <div className="bg-neutral-900 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="mb-1">Interior Lights</div>
                <div className="text-sm text-neutral-400">Cabin illumination</div>
              </div>
              <button
                onClick={() => setLights({ ...lights, interior: !lights.interior })}
                className={`w-16 h-8 rounded-full transition-colors relative ${
                  lights.interior ? 'bg-blue-600' : 'bg-neutral-700'
                }`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                  lights.interior ? 'translate-x-9' : 'translate-x-1'
                }`}></div>
              </button>
            </div>

            {/* Ambient Lighting */}
            <div className="bg-neutral-900 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="mb-1">Ambient Lighting</div>
                  <div className="text-sm text-neutral-400">Mood lighting</div>
                </div>
                <button
                  onClick={() => setLights({ ...lights, ambient: !lights.ambient })}
                  className={`w-16 h-8 rounded-full transition-colors relative ${
                    lights.ambient ? 'bg-blue-600' : 'bg-neutral-700'
                  }`}
                >
                  <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                    lights.ambient ? 'translate-x-9' : 'translate-x-1'
                  }`}></div>
                </button>
              </div>

              {lights.ambient && (
                <div>
                  <div className="text-sm text-neutral-400 mb-3">Color</div>
                  <div className="flex gap-2">
                    {ambientColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setLights({ ...lights, ambientColor: color })}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${
                          lights.ambientColor === color ? 'border-white scale-110' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: color }}
                      ></button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Seat Controls */}
        <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700 col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <Armchair className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl">Seat Comfort</h2>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Driver Seat */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h3 className="mb-6 text-center">Driver Seat</h3>
              
              {/* Heating */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-neutral-400">Heating</div>
                  <div className="text-sm">{seats.driverHeat}/3</div>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSeats({ ...seats, driverHeat: level })}
                      className={`flex-1 py-3 rounded-lg transition-colors ${
                        seats.driverHeat === level
                          ? 'bg-orange-500 text-white'
                          : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                      }`}
                    >
                      {level === 0 ? 'Off' : level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ventilation */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-neutral-400">Ventilation</div>
                  <Droplet className="w-4 h-4 text-blue-400" />
                </div>
                <button
                  onClick={() => setSeats({ ...seats, driverVent: !seats.driverVent })}
                  className={`w-full py-3 rounded-lg transition-colors ${
                    seats.driverVent
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                  }`}
                >
                  {seats.driverVent ? 'On' : 'Off'}
                </button>
              </div>
            </div>

            {/* Passenger Seat */}
            <div className="bg-neutral-900 rounded-xl p-6">
              <h3 className="mb-6 text-center">Passenger Seat</h3>
              
              {/* Heating */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-neutral-400">Heating</div>
                  <div className="text-sm">{seats.passengerHeat}/3</div>
                </div>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSeats({ ...seats, passengerHeat: level })}
                      className={`flex-1 py-3 rounded-lg transition-colors ${
                        seats.passengerHeat === level
                          ? 'bg-orange-500 text-white'
                          : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                      }`}
                    >
                      {level === 0 ? 'Off' : level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ventilation */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-neutral-400">Ventilation</div>
                  <Droplet className="w-4 h-4 text-blue-400" />
                </div>
                <button
                  onClick={() => setSeats({ ...seats, passengerVent: !seats.passengerVent })}
                  className={`w-full py-3 rounded-lg transition-colors ${
                    seats.passengerVent
                      ? 'bg-blue-600 text-white'
                      : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
                  }`}
                >
                  {seats.passengerVent ? 'On' : 'Off'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
