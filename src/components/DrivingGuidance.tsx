import { useState } from 'react';
import { Navigation, AlertTriangle, Route, MapPin, Clock, TrendingUp } from 'lucide-react';

export function DrivingGuidance() {
  const [laneAssist, setLaneAssist] = useState(true);
  const [brakeAssist, setBrakeAssist] = useState(true);
  const [speedLimit] = useState(65);
  const [currentSpeed] = useState(58);

  const [route] = useState({
    destination: 'Downtown Office',
    distance: '12.4 mi',
    duration: '24 min',
    arrival: '2:45 PM',
  });

  const [laneWarning, setLaneWarning] = useState(false);
  const [brakeWarning, setBrakeWarning] = useState(false);

  const upcomingTurns = [
    { id: 1, instruction: 'Continue on Highway 101', distance: '3.2 mi', icon: '↑' },
    { id: 2, instruction: 'Take exit 42B toward Downtown', distance: '8.1 mi', icon: '↗' },
    { id: 3, instruction: 'Turn right onto Main Street', distance: '11.8 mi', icon: '→' },
  ];

  return (
    <div className="h-full bg-neutral-900 text-white p-8 overflow-auto">
      <h1 className="text-3xl mb-8">Driving Guidance</h1>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Main Navigation Map */}
        <div className="col-span-2 space-y-6">
          {/* Map View */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700 h-96">
            <div className="flex items-center gap-3 mb-4">
              <Navigation className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl">Active Navigation</h2>
            </div>
            
            {/* Simplified map visualization */}
            <div className="relative h-72 bg-neutral-900 rounded-xl overflow-hidden">
              {/* Grid pattern */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={`h${i}`} className="absolute w-full border-t border-neutral-700" style={{ top: `${i * 10}%` }}></div>
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={`v${i}`} className="absolute h-full border-l border-neutral-700" style={{ left: `${i * 10}%` }}></div>
                ))}
              </div>

              {/* Route line */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d="M 50 280 Q 100 200, 150 180 T 250 120 T 350 80 T 450 40"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="4"
                  strokeDasharray="10,5"
                />
              </svg>

              {/* Current position marker */}
              <div className="absolute bottom-8 left-12">
                <div className="relative">
                  <div className="w-6 h-6 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="absolute -inset-2 bg-blue-500/30 rounded-full animate-ping"></div>
                </div>
              </div>

              {/* Destination marker */}
              <div className="absolute top-8 right-12">
                <MapPin className="w-8 h-8 text-red-500" fill="currentColor" />
              </div>

              {/* Next turn indicator */}
              <div className="absolute bottom-8 left-1/3 bg-blue-600 rounded-lg px-4 py-2">
                <div className="text-3xl mb-1">↑</div>
                <div className="text-xs">Continue 3.2 mi</div>
              </div>
            </div>
          </div>

          {/* Lane Assist Visualization */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Route className="w-6 h-6 text-green-400" />
                <h2 className="text-xl">Lane Assist</h2>
              </div>
              <button
                onClick={() => setLaneAssist(!laneAssist)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  laneAssist ? 'bg-green-600 text-white' : 'bg-neutral-700 text-neutral-400'
                }`}
              >
                {laneAssist ? 'Active' : 'Off'}
              </button>
            </div>

            {laneAssist && (
              <div className="relative h-32 bg-neutral-900 rounded-xl overflow-hidden">
                {/* Road visualization */}
                <div className="absolute inset-0 bg-gradient-to-b from-neutral-700 to-neutral-800">
                  {/* Lane markers */}
                  <div className="absolute left-1/3 top-0 bottom-0 w-1 border-l-2 border-dashed border-yellow-400/50"></div>
                  <div className="absolute left-2/3 top-0 bottom-0 w-1 border-l-2 border-dashed border-yellow-400/50"></div>
                  
                  {/* Lane boundaries */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${laneWarning ? 'bg-red-500 animate-pulse' : 'bg-white'}`}></div>
                  <div className={`absolute right-0 top-0 bottom-0 w-1 ${laneWarning ? 'bg-red-500 animate-pulse' : 'bg-white'}`}></div>

                  {/* Vehicle position */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                    <div className="w-16 h-24 bg-blue-500 rounded-lg border-2 border-blue-300 flex items-center justify-center">
                      <div className="text-xs">YOU</div>
                    </div>
                  </div>

                  {/* Lane centering indicator */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 rounded-full px-3 py-1 text-xs">
                    Centered
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setLaneWarning(!laneWarning)}
              className="mt-4 w-full py-2 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm transition-colors"
            >
              {laneWarning ? 'Clear Warning' : 'Simulate Lane Departure'}
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Route Info */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5" />
              <div className="text-sm">{route.destination}</div>
            </div>
            <div className="text-4xl mb-4">{route.duration}</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Route className="w-4 h-4" />
                <span>{route.distance}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Arrive {route.arrival}</span>
              </div>
            </div>
          </div>

          {/* Speed & Brake Assist */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <h2 className="text-xl mb-4">Speed Monitor</h2>
            
            <div className="text-center mb-6">
              <div className="text-6xl mb-2">{currentSpeed}</div>
              <div className="text-neutral-400">mph</div>
              <div className="text-sm text-neutral-500 mt-2">Limit: {speedLimit} mph</div>
            </div>

            {/* Speed gauge */}
            <div className="relative h-3 bg-neutral-900 rounded-full overflow-hidden mb-6">
              <div 
                className={`h-full transition-all ${
                  currentSpeed > speedLimit ? 'bg-red-500' : 'bg-green-500'
                }`}
                style={{ width: `${(currentSpeed / 100) * 100}%` }}
              ></div>
              <div 
                className="absolute top-0 h-full w-0.5 bg-yellow-400"
                style={{ left: `${(speedLimit / 100) * 100}%` }}
              ></div>
            </div>

            {/* Brake Assist */}
            <div className="bg-neutral-900 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-400" />
                  <span>Brake Assist</span>
                </div>
                <button
                  onClick={() => setBrakeAssist(!brakeAssist)}
                  className={`w-14 h-7 rounded-full transition-colors relative ${
                    brakeAssist ? 'bg-green-600' : 'bg-neutral-700'
                  }`}
                >
                  <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                    brakeAssist ? 'translate-x-7' : 'translate-x-0.5'
                  }`}></div>
                </button>
              </div>

              {brakeAssist && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-400">Following Distance</span>
                    <span className={brakeWarning ? 'text-red-400' : 'text-green-400'}>
                      {brakeWarning ? 'Too Close' : 'Safe'}
                    </span>
                  </div>
                  <button
                    onClick={() => setBrakeWarning(!brakeWarning)}
                    className={`w-full py-2 rounded-lg text-sm transition-colors ${
                      brakeWarning 
                        ? 'bg-red-600 text-white' 
                        : 'bg-neutral-700 hover:bg-neutral-600'
                    }`}
                  >
                    {brakeWarning ? 'Warning Active' : 'Simulate Close Vehicle'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Turns */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <h2 className="text-xl mb-4">Upcoming Turns</h2>
            <div className="space-y-3">
              {upcomingTurns.map((turn) => (
                <div key={turn.id} className="bg-neutral-900 rounded-lg p-3 flex items-center gap-3">
                  <div className="text-2xl w-10 text-center">{turn.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm mb-1">{turn.instruction}</div>
                    <div className="text-xs text-neutral-400">in {turn.distance}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Info */}
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h3>Traffic Status</h3>
            </div>
            <p className="text-sm text-neutral-300">Light traffic on your route. Conditions are good.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
