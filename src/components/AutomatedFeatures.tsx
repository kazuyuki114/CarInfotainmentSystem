import { useState } from 'react';
import { Car, ParkingCircle, ShieldAlert, Zap, AlertTriangle, Navigation, Eye } from 'lucide-react';

type AutopilotMode = 'off' | 'adaptive-cruise' | 'autopilot';
type ParkingMode = 'off' | 'searching' | 'parking';

export function AutomatedFeatures() {
  const [autopilotMode, setAutopilotMode] = useState<AutopilotMode>('off');
  const [parkingMode, setParkingMode] = useState<ParkingMode>('off');
  const [collisionAvoidance, setCollisionAvoidance] = useState(true);
  const [blindSpotMonitor, setBlindSpotMonitor] = useState(true);
  
  const [userIntervention, setUserIntervention] = useState(false);
  const [obstacleDetected, setObstacleDetected] = useState(false);

  const handleAutopilotChange = (mode: AutopilotMode) => {
    setAutopilotMode(mode);
    if (mode !== 'off') {
      setUserIntervention(false);
    }
  };

  const handleEmergencyTakeover = () => {
    setAutopilotMode('off');
    setUserIntervention(true);
    setTimeout(() => setUserIntervention(false), 3000);
  };

  const obstacles = [
    { id: 1, type: 'vehicle', distance: 45, direction: 'front', severity: 'low' },
    { id: 2, type: 'pedestrian', distance: 12, direction: 'right', severity: obstacleDetected ? 'high' : 'medium' },
  ];

  return (
    <div className="h-full bg-neutral-900 text-white p-8 overflow-auto">
      <h1 className="text-3xl mb-8">Automated Features</h1>
      
      <div className="grid grid-cols-2 gap-6">
        {/* Autopilot Control */}
        <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
          <div className="flex items-center gap-3 mb-6">
            <Car className="w-6 h-6 text-blue-400" />
            <h2 className="text-xl">Self-Driving</h2>
          </div>

          <div className="space-y-4 mb-6">
            {/* Mode Selection */}
            <div className="space-y-3">
              <button
                onClick={() => handleAutopilotChange('off')}
                className={`w-full p-4 rounded-xl transition-all ${
                  autopilotMode === 'off'
                    ? 'bg-neutral-700 border-2 border-blue-500'
                    : 'bg-neutral-900 border-2 border-transparent hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="mb-1">Manual Driving</div>
                    <div className="text-sm text-neutral-400">Full driver control</div>
                  </div>
                  {autopilotMode === 'off' && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleAutopilotChange('adaptive-cruise')}
                className={`w-full p-4 rounded-xl transition-all ${
                  autopilotMode === 'adaptive-cruise'
                    ? 'bg-blue-600 border-2 border-blue-400'
                    : 'bg-neutral-900 border-2 border-transparent hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="mb-1">Adaptive Cruise Control</div>
                    <div className="text-sm text-blue-200">Speed & distance control</div>
                  </div>
                  {autopilotMode === 'adaptive-cruise' && (
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  )}
                </div>
              </button>

              <button
                onClick={() => handleAutopilotChange('autopilot')}
                className={`w-full p-4 rounded-xl transition-all ${
                  autopilotMode === 'autopilot'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-2 border-blue-400'
                    : 'bg-neutral-900 border-2 border-transparent hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="mb-1">Full Self-Driving</div>
                    <div className={`text-sm ${autopilotMode === 'autopilot' ? 'text-blue-100' : 'text-neutral-400'}`}>
                      Autonomous navigation
                    </div>
                  </div>
                  {autopilotMode === 'autopilot' && (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  )}
                </div>
              </button>
            </div>

            {/* Active Status */}
            {autopilotMode !== 'off' && (
              <div className="bg-neutral-900 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-green-400">System Active</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Set Speed</span>
                    <span>65 mph</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Following Distance</span>
                    <span>Medium (2.5s)</span>
                  </div>
                  {autopilotMode === 'autopilot' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Lane Changes</span>
                        <span>Automatic</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Navigation</span>
                        <span className="text-green-400">Active</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Emergency Takeover */}
            {autopilotMode !== 'off' && (
              <button
                onClick={handleEmergencyTakeover}
                className="w-full py-4 bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-5 h-5" />
                <span>Emergency Takeover</span>
              </button>
            )}

            {userIntervention && (
              <div className="bg-amber-500/20 border border-amber-500 rounded-xl p-4 animate-pulse">
                <div className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Driver intervention detected</span>
                </div>
              </div>
            )}
          </div>

          {/* Visualization */}
          <div className="bg-neutral-900 rounded-xl p-4 h-48 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Road */}
              <div className="absolute bottom-0 w-full h-32 bg-neutral-700">
                <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full border-l-2 border-dashed border-yellow-400/50"></div>
              </div>
              
              {/* Vehicle */}
              <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all ${
                autopilotMode !== 'off' ? 'text-blue-400' : 'text-neutral-400'
              }`}>
                <Car className="w-12 h-12" />
                {autopilotMode === 'autopilot' && (
                  <div className="absolute -inset-4 border-2 border-blue-400 rounded-lg animate-pulse"></div>
                )}
              </div>

              {/* Sensors visualization */}
              {autopilotMode !== 'off' && (
                <>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-400/30 rounded-full animate-ping"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-blue-400/50 rounded-full"></div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Automated Parking */}
        <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
          <div className="flex items-center gap-3 mb-6">
            <ParkingCircle className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl">Automated Parking</h2>
          </div>

          <div className="space-y-4 mb-6">
            {/* Parking Mode Selection */}
            <div className="space-y-3">
              <button
                onClick={() => setParkingMode('off')}
                className={`w-full p-4 rounded-xl transition-all ${
                  parkingMode === 'off'
                    ? 'bg-neutral-700 border-2 border-purple-500'
                    : 'bg-neutral-900 border-2 border-transparent hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="mb-1">Manual Parking</div>
                    <div className="text-sm text-neutral-400">Driver controls parking</div>
                  </div>
                  {parkingMode === 'off' && (
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setParkingMode('searching')}
                className={`w-full p-4 rounded-xl transition-all ${
                  parkingMode === 'searching'
                    ? 'bg-purple-600 border-2 border-purple-400'
                    : 'bg-neutral-900 border-2 border-transparent hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="mb-1">Search for Parking</div>
                    <div className={`text-sm ${parkingMode === 'searching' ? 'text-purple-200' : 'text-neutral-400'}`}>
                      Scanning for spaces
                    </div>
                  </div>
                  {parkingMode === 'searching' && (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  )}
                </div>
              </button>

              <button
                onClick={() => setParkingMode('parking')}
                className={`w-full p-4 rounded-xl transition-all ${
                  parkingMode === 'parking'
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-2 border-purple-400'
                    : 'bg-neutral-900 border-2 border-transparent hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    <div className="mb-1">Auto Park</div>
                    <div className={`text-sm ${parkingMode === 'parking' ? 'text-purple-100' : 'text-neutral-400'}`}>
                      Executing parking maneuver
                    </div>
                  </div>
                  {parkingMode === 'parking' && (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  )}
                </div>
              </button>
            </div>

            {/* Available Parking Spots */}
            {parkingMode === 'searching' && (
              <div className="bg-neutral-900 rounded-xl p-4">
                <div className="text-sm text-neutral-400 mb-3">Available Spots Detected</div>
                <div className="space-y-2">
                  <button className="w-full p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-left transition-colors">
                    <div className="flex justify-between items-center">
                      <span>Parallel - Left Side</span>
                      <span className="text-xs text-green-400">15 ft ahead</span>
                    </div>
                  </button>
                  <button className="w-full p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-left transition-colors">
                    <div className="flex justify-between items-center">
                      <span>Perpendicular - Right</span>
                      <span className="text-xs text-green-400">32 ft ahead</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Parking Progress */}
            {parkingMode === 'parking' && (
              <div className="bg-neutral-900 rounded-xl p-4">
                <div className="text-sm text-neutral-400 mb-3">Parking Progress</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-sm">✓</div>
                    <span>Position aligned</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span>Steering...</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center text-sm">3</div>
                    <span className="text-neutral-500">Final positioning</span>
                  </div>
                </div>
                <button
                  onClick={() => setParkingMode('off')}
                  className="w-full mt-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Cancel Parking
                </button>
              </div>
            )}
          </div>

          {/* Parking Visualization */}
          <div className="bg-neutral-900 rounded-xl p-4 h-48 relative overflow-hidden">
            <div className="absolute inset-0">
              {/* Parking space outline */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-20 border-2 border-dashed border-neutral-600"></div>
              
              {/* Vehicle */}
              <div className={`absolute transition-all duration-1000 ${
                parkingMode === 'parking' 
                  ? 'bottom-4 left-1/2 -translate-x-1/2 rotate-0' 
                  : 'bottom-2 left-1/4 rotate-12'
              }`}>
                <div className={`w-16 h-24 rounded-lg border-2 flex items-center justify-center ${
                  parkingMode === 'parking' ? 'bg-purple-600 border-purple-400' : 'bg-neutral-700 border-neutral-600'
                }`}>
                  <Car className="w-8 h-8" />
                </div>
              </div>

              {/* Sensors */}
              {parkingMode !== 'off' && (
                <div className="absolute inset-0">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-purple-400/30 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-purple-400/50 rounded-full animate-ping"></div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Collision Avoidance System */}
        <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700 col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-green-400" />
              <h2 className="text-xl">Collision Avoidance System</h2>
            </div>
            <button
              onClick={() => setCollisionAvoidance(!collisionAvoidance)}
              className={`px-6 py-2 rounded-lg transition-colors ${
                collisionAvoidance ? 'bg-green-600 text-white' : 'bg-neutral-700 text-neutral-400'
              }`}
            >
              {collisionAvoidance ? 'Active' : 'Disabled'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* 360° Sensor View */}
            <div>
              <h3 className="text-sm text-neutral-400 mb-4">360° Sensor Coverage</h3>
              <div className="relative w-full aspect-square bg-neutral-900 rounded-xl p-8">
                {/* Center vehicle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Car className="w-10 h-10" />
                </div>

                {/* Sensor zones */}
                {collisionAvoidance && (
                  <>
                    {/* Front */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-green-500/20 rounded-t-full border-t-2 border-green-500"></div>
                    {/* Rear */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-green-500/20 rounded-b-full border-b-2 border-green-500"></div>
                    {/* Left */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-24 bg-green-500/20 rounded-l-full border-l-2 border-green-500"></div>
                    {/* Right */}
                    <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-24 h-24 rounded-r-full border-r-2 ${
                      obstacleDetected ? 'bg-red-500/30 border-red-500' : 'bg-green-500/20 border-green-500'
                    }`}></div>
                  </>
                )}

                {/* Detected obstacles */}
                <div className="absolute top-16 left-1/2 -translate-x-1/2 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-xs">
                  🚗
                </div>
                <div className={`absolute right-16 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-colors ${
                  obstacleDetected ? 'bg-red-500 animate-pulse' : 'bg-green-500'
                }`}>
                  🚶
                </div>

                {/* Detection rings */}
                {collisionAvoidance && (
                  <>
                    <div className="absolute inset-8 border border-green-400/30 rounded-full"></div>
                    <div className="absolute inset-16 border border-green-400/50 rounded-full"></div>
                  </>
                )}
              </div>
            </div>

            {/* Obstacle List & Controls */}
            <div className="space-y-4">
              <div>
                <h3 className="text-sm text-neutral-400 mb-4">Detected Objects</h3>
                <div className="space-y-2">
                  {obstacles.map((obstacle) => (
                    <div 
                      key={obstacle.id}
                      className={`bg-neutral-900 rounded-lg p-4 border-2 transition-all ${
                        obstacle.severity === 'high' 
                          ? 'border-red-500' 
                          : obstacle.severity === 'medium'
                          ? 'border-amber-500'
                          : 'border-green-500/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="capitalize">{obstacle.type}</div>
                        <div className={`text-xs px-2 py-1 rounded ${
                          obstacle.severity === 'high'
                            ? 'bg-red-500/20 text-red-400'
                            : obstacle.severity === 'medium'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-green-500/20 text-green-400'
                        }`}>
                          {obstacle.severity}
                        </div>
                      </div>
                      <div className="text-sm text-neutral-400">
                        {obstacle.distance} ft - {obstacle.direction}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blind Spot Monitor */}
              <div className="bg-neutral-900 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <span>Blind Spot Monitor</span>
                  </div>
                  <button
                    onClick={() => setBlindSpotMonitor(!blindSpotMonitor)}
                    className={`w-14 h-7 rounded-full transition-colors relative ${
                      blindSpotMonitor ? 'bg-blue-600' : 'bg-neutral-700'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                      blindSpotMonitor ? 'translate-x-7' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className={`p-2 rounded text-center ${
                    blindSpotMonitor ? 'bg-green-500/20 text-green-400' : 'bg-neutral-800 text-neutral-500'
                  }`}>
                    Left: Clear
                  </div>
                  <div className={`p-2 rounded text-center ${
                    blindSpotMonitor ? 'bg-green-500/20 text-green-400' : 'bg-neutral-800 text-neutral-500'
                  }`}>
                    Right: Clear
                  </div>
                </div>
              </div>

              {/* Test Controls */}
              <div className="bg-neutral-900 rounded-xl p-4">
                <div className="text-sm text-neutral-400 mb-3">Test Scenarios</div>
                <button
                  onClick={() => setObstacleDetected(!obstacleDetected)}
                  className={`w-full py-3 rounded-lg transition-colors ${
                    obstacleDetected
                      ? 'bg-red-600 text-white'
                      : 'bg-neutral-700 hover:bg-neutral-600'
                  }`}
                >
                  {obstacleDetected ? 'Clear Emergency' : 'Simulate Close Pedestrian'}
                </button>
              </div>

              {obstacleDetected && (
                <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 animate-pulse">
                  <div className="flex items-center gap-2 text-red-400 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Emergency Braking Engaged</span>
                  </div>
                  <div className="text-sm text-neutral-300">
                    Pedestrian detected in danger zone. Automatic braking applied.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
