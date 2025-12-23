import { useState } from 'react';
import { Smartphone, Bluetooth, Phone, MessageSquare, Music, Play, Pause, SkipForward, SkipBack, Volume2, Bell } from 'lucide-react';

interface Notification {
  id: number;
  app: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export function MobileConnect() {
  const [phoneConnected, setPhoneConnected] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(60);
  
  const [currentTrack] = useState({
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    duration: '4:01',
    currentTime: '1:23',
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, app: 'Messages', title: 'Sarah', message: 'Running 5 minutes late', time: '2m ago', read: false },
    { id: 2, app: 'Calendar', title: 'Meeting Reminder', message: 'Team standup in 15 minutes', time: '5m ago', read: false },
    { id: 3, app: 'Email', title: 'John Doe', message: 'Re: Project Update', time: '10m ago', read: true },
    { id: 4, app: 'Messages', title: 'Mom', message: 'Drive safe!', time: '1h ago', read: true },
  ]);

  const [recentCalls] = useState([
    { id: 1, name: 'Sarah Johnson', type: 'missed', time: '10:30 AM' },
    { id: 2, name: 'Work', type: 'outgoing', time: '9:15 AM' },
    { id: 3, name: 'Dad', type: 'incoming', time: 'Yesterday' },
  ]);

  const [notificationPreferences, setNotificationPreferences] = useState({
    Messages: true,
    Calls: true,
    Navigation: true,
    Calendar: true,
  });

  const [doNotDisturb, setDoNotDisturb] = useState(false);

  const handleMarkAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const toggleNotificationPref = (type: keyof typeof notificationPreferences) => {
    setNotificationPreferences({
      ...notificationPreferences,
      [type]: !notificationPreferences[type],
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-full bg-neutral-900 text-white p-8 overflow-auto">
      <h1 className="text-3xl mb-8">Mobile Connect</h1>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Connection Status & Phone Controls */}
        <div className="space-y-6">
          {/* Connection Status */}
          <div className={`rounded-2xl p-6 border ${
            phoneConnected 
              ? 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-500'
              : 'bg-neutral-800 border-neutral-700'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <Bluetooth className={`w-6 h-6 ${phoneConnected ? 'text-white' : 'text-neutral-400'}`} />
              <h2 className="text-xl">Phone Connection</h2>
            </div>
            
            {phoneConnected ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>iPhone 15 Pro</span>
                </div>
                <div className="text-sm text-blue-100">Battery: 78%</div>
                <div className="text-sm text-blue-100">Signal: ●●●●○</div>
                <button
                  onClick={() => setPhoneConnected(false)}
                  className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-neutral-400">No device connected</div>
                <button
                  onClick={() => setPhoneConnected(true)}
                  className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Connect Phone
                </button>
              </div>
            )}
          </div>

          {/* Recent Calls */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-green-400" />
              <h2 className="text-xl">Recent Calls</h2>
            </div>

            <div className="space-y-2">
              {recentCalls.map((call) => (
                <button
                  key={call.id}
                  className="w-full bg-neutral-900 hover:bg-neutral-700 rounded-lg p-3 text-left transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="mb-1">{call.name}</div>
                      <div className="text-sm text-neutral-400 flex items-center gap-2">
                        <span className={
                          call.type === 'missed' ? 'text-red-400' :
                          call.type === 'outgoing' ? 'text-blue-400' :
                          'text-green-400'
                        }>
                          {call.type === 'missed' ? '↙' : call.type === 'outgoing' ? '↗' : '↙'}
                        </span>
                        {call.time}
                      </div>
                    </div>
                    <Phone className="w-5 h-5 text-neutral-500 group-hover:text-green-400 transition-colors" />
                  </div>
                </button>
              ))}
            </div>

            <button className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              <span>Make Call</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <h2 className="text-xl mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-neutral-900 hover:bg-neutral-700 rounded-lg p-4 transition-colors flex flex-col items-center gap-2">
                <MessageSquare className="w-6 h-6 text-blue-400" />
                <span className="text-xs">Messages</span>
              </button>
              <button className="bg-neutral-900 hover:bg-neutral-700 rounded-lg p-4 transition-colors flex flex-col items-center gap-2">
                <Phone className="w-6 h-6 text-green-400" />
                <span className="text-xs">Dial</span>
              </button>
            </div>
          </div>
        </div>

        {/* Media Player */}
        <div className="space-y-6">
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <div className="flex items-center gap-3 mb-6">
              <Music className="w-6 h-6 text-purple-400" />
              <h2 className="text-xl">Now Playing</h2>
            </div>

            {/* Album Art */}
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-xl aspect-square mb-6 flex items-center justify-center">
              <Music className="w-20 h-20 text-white/30" />
            </div>

            {/* Track Info */}
            <div className="mb-6 text-center">
              <h3 className="text-xl mb-2">{currentTrack.title}</h3>
              <div className="text-neutral-400">{currentTrack.artist}</div>
              <div className="text-sm text-neutral-500">{currentTrack.album}</div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="h-1 bg-neutral-700 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-purple-500 w-1/3"></div>
              </div>
              <div className="flex justify-between text-sm text-neutral-400">
                <span>{currentTrack.currentTime}</span>
                <span>{currentTrack.duration}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button className="w-12 h-12 bg-neutral-700 hover:bg-neutral-600 rounded-full flex items-center justify-center transition-colors">
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7" fill="currentColor" />
                ) : (
                  <Play className="w-7 h-7 ml-1" fill="currentColor" />
                )}
              </button>
              <button className="w-12 h-12 bg-neutral-700 hover:bg-neutral-600 rounded-full flex items-center justify-center transition-colors">
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* Volume Control */}
            <div className="bg-neutral-900 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Volume2 className="w-5 h-5 text-neutral-400" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="flex-1 accent-purple-600"
                />
                <span className="text-sm text-neutral-400 w-10 text-right">{volume}%</span>
              </div>
            </div>
          </div>

          {/* Playlist */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <h2 className="text-xl mb-4">Up Next</h2>
            <div className="space-y-2">
              {[
                { title: 'Outro', artist: 'M83', duration: '7:25' },
                { title: 'Wait', artist: 'M83', duration: '5:47' },
                { title: 'Raconte-Moi Une Histoire', artist: 'M83', duration: '6:04' },
              ].map((track, i) => (
                <button
                  key={i}
                  className="w-full bg-neutral-900 hover:bg-neutral-700 rounded-lg p-3 text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm mb-1">{track.title}</div>
                    <div className="text-xs text-neutral-400">{track.artist}</div>
                  </div>
                  <div className="text-xs text-neutral-500">{track.duration}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl">Notifications</h2>
            </div>
            {unreadCount > 0 && (
              <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">
                {unreadCount}
              </div>
            )}
          </div>

          <div className="space-y-3 max-h-[calc(100vh-12rem)] overflow-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg p-4 border transition-all ${
                  notification.read
                    ? 'bg-neutral-900 border-neutral-800'
                    : 'bg-blue-500/10 border-blue-500/30'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      notification.read ? 'bg-neutral-600' : 'bg-blue-500'
                    }`}></div>
                    <span className="text-sm text-neutral-400">{notification.app}</span>
                  </div>
                  <span className="text-xs text-neutral-500">{notification.time}</span>
                </div>
                
                <div className="mb-1">{notification.title}</div>
                <div className="text-sm text-neutral-400 mb-3">{notification.message}</div>

                <div className="flex gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
                    >
                      Mark Read
                    </button>
                  )}
                  {notification.app === 'Messages' && (
                    <button className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-xs transition-colors">
                      Reply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Notification Settings */}
          <div className="mt-6 pt-6 border-t border-neutral-700">
            <h3 className="text-sm mb-3">Notification Preferences</h3>
            <div className="space-y-2">
              {['Messages', 'Calls', 'Navigation', 'Calendar'].map((type) => (
                <div key={type} className="flex items-center justify-between p-2 bg-neutral-900 rounded">
                  <span className="text-sm">{type}</span>
                  <button
                    onClick={() => toggleNotificationPref(type as keyof typeof notificationPreferences)}
                    className={`w-12 h-6 rounded-full relative transition-colors ${
                      notificationPreferences[type as keyof typeof notificationPreferences] ? 'bg-blue-600' : 'bg-neutral-700'
                    }`}
                  >
                    <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      notificationPreferences[type as keyof typeof notificationPreferences] ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Do Not Disturb */}
          <div className="mt-4 p-4 bg-neutral-900 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="mb-1">Do Not Disturb</div>
                <div className="text-sm text-neutral-400">While driving</div>
              </div>
              <button
                onClick={() => setDoNotDisturb(!doNotDisturb)}
                className={`w-14 h-7 rounded-full relative transition-colors ${
                  doNotDisturb ? 'bg-blue-600' : 'bg-neutral-700'
                }`}
              >
                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  doNotDisturb ? 'translate-x-7' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}