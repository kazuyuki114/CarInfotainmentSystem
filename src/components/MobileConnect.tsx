import { useState, useEffect, useRef } from 'react';
import { Bluetooth, Phone, MessageSquare, Music, Play, Pause, SkipForward, SkipBack, Volume2, Bell, X, PhoneOff, PhoneCall, Send, Mic, MicOff, ArrowLeft, User, Shuffle, Repeat, Heart, List } from 'lucide-react';

interface Notification {
  id: number;
  app: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

interface Message {
  id: number;
  text: string;
  sender: 'me' | 'other';
  time: string;
}

interface Contact {
  id: number;
  name: string;
  phone: string;
  avatar?: string;
  lastMessage?: string;
  unread?: number;
}

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number; // in seconds
  cover?: string;
}

type ViewMode = 'main' | 'dialer' | 'messages' | 'chat' | 'calling' | 'incoming';

export function MobileConnect() {
  const [phoneConnected, setPhoneConnected] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(60);
  const [viewMode, setViewMode] = useState<ViewMode>('main');
  const [dialNumber, setDialNumber] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [incomingCaller, setIncomingCaller] = useState<Contact | null>(null);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Music state
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(83); // 1:23
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [likedTracks, setLikedTracks] = useState<number[]>([1]);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const tracks: Track[] = [
    { id: 1, title: 'Midnight City', artist: 'M83', album: "Hurry Up, We're Dreaming", duration: 241 },
    { id: 2, title: 'Outro', artist: 'M83', album: "Hurry Up, We're Dreaming", duration: 445 },
    { id: 3, title: 'Wait', artist: 'M83', album: "Hurry Up, We're Dreaming", duration: 347 },
    { id: 4, title: 'Raconte-Moi Une Histoire', artist: 'M83', album: "Hurry Up, We're Dreaming", duration: 364 },
  ];

  const currentTrack = tracks[currentTrackIndex];

  const contacts: Contact[] = [
    { id: 1, name: 'Sarah Johnson', phone: '+1 234 567 8901', lastMessage: 'Running 5 minutes late', unread: 2 },
    { id: 2, name: 'Mom', phone: '+1 234 567 8902', lastMessage: 'Drive safe!' },
    { id: 3, name: 'Work', phone: '+1 234 567 8903', lastMessage: 'Meeting at 3pm' },
    { id: 4, name: 'Dad', phone: '+1 234 567 8904', lastMessage: 'Call me when you can' },
    { id: 5, name: 'John Doe', phone: '+1 234 567 8905', lastMessage: 'Re: Project Update' },
  ];

  const [conversations, setConversations] = useState<Record<number, Message[]>>({
    1: [
      { id: 1, text: 'Hey, are you on your way?', sender: 'other', time: '10:30 AM' },
      { id: 2, text: 'Yes, leaving now!', sender: 'me', time: '10:31 AM' },
      { id: 3, text: 'Running 5 minutes late', sender: 'other', time: '10:35 AM' },
    ],
    2: [
      { id: 1, text: 'Have a safe trip!', sender: 'other', time: '9:00 AM' },
      { id: 2, text: 'Thanks mom!', sender: 'me', time: '9:01 AM' },
      { id: 3, text: 'Drive safe!', sender: 'other', time: '9:02 AM' },
    ],
  });

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, app: 'Messages', title: 'Sarah', message: 'Running 5 minutes late', time: '2m ago', read: false },
    { id: 2, app: 'Calendar', title: 'Meeting Reminder', message: 'Team standup in 15 minutes', time: '5m ago', read: false },
    { id: 3, app: 'Email', title: 'John Doe', message: 'Re: Project Update', time: '10m ago', read: true },
    { id: 4, app: 'Messages', title: 'Mom', message: 'Drive safe!', time: '1h ago', read: true },
  ]);

  const [recentCalls, setRecentCalls] = useState([
    { id: 1, name: 'Sarah Johnson', phone: '+1 234 567 8901', type: 'missed' as const, time: '10:30 AM' },
    { id: 2, name: 'Work', phone: '+1 234 567 8903', type: 'outgoing' as const, time: '9:15 AM' },
    { id: 3, name: 'Dad', phone: '+1 234 567 8904', type: 'incoming' as const, time: 'Yesterday' },
  ]);

  const [notificationPreferences, setNotificationPreferences] = useState({
    Messages: true,
    Calls: true,
    Navigation: true,
    Calendar: true,
  });

  const [doNotDisturb, setDoNotDisturb] = useState(false);

  // Music playback simulation
  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= currentTrack.duration) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    }
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [isPlaying, currentTrackIndex]);

  // Call timer
  useEffect(() => {
    if (viewMode === 'calling') {
      callTimerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      setCallDuration(0);
    }
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
    };
  }, [viewMode]);

  // Simulate incoming call after 30 seconds on main view
  useEffect(() => {
    if (viewMode === 'main' && phoneConnected && !doNotDisturb) {
      const timeout = setTimeout(() => {
        setIncomingCaller(contacts[0]);
        setViewMode('incoming');
      }, 30000);
      return () => clearTimeout(timeout);
    }
  }, [viewMode, phoneConnected, doNotDisturb]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNextTrack = () => {
    if (isShuffled) {
      const nextIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(nextIndex);
    } else {
      setCurrentTrackIndex(prev => (prev + 1) % tracks.length);
    }
    setCurrentTime(0);
  };

  const handlePrevTrack = () => {
    if (currentTime > 3) {
      setCurrentTime(0);
    } else {
      setCurrentTrackIndex(prev => prev === 0 ? tracks.length - 1 : prev - 1);
      setCurrentTime(0);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    setCurrentTime(Math.floor(percentage * currentTrack.duration));
  };

  const toggleLike = (trackId: number) => {
    setLikedTracks(prev => 
      prev.includes(trackId) ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
  };

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

  const handleDial = (digit: string) => {
    if (dialNumber.length < 15) {
      setDialNumber(prev => prev + digit);
    }
  };

  const handleCall = (phone?: string, name?: string) => {
    const callNumber = phone || dialNumber;
    if (callNumber) {
      const contact = contacts.find(c => c.phone === callNumber) || { id: 0, name: name || callNumber, phone: callNumber };
      setSelectedContact(contact);
      setViewMode('calling');
      setDialNumber('');
      // Add to recent calls
      setRecentCalls(prev => [
        { id: Date.now(), name: contact.name, phone: contact.phone, type: 'outgoing', time: 'Just now' },
        ...prev.slice(0, 9)
      ]);
    }
  };

  const handleEndCall = () => {
    setViewMode('main');
    setSelectedContact(null);
    setIsMuted(false);
  };

  const handleAnswerCall = () => {
    if (incomingCaller) {
      setSelectedContact(incomingCaller);
      setViewMode('calling');
      setRecentCalls(prev => [
        { id: Date.now(), name: incomingCaller.name, phone: incomingCaller.phone, type: 'incoming', time: 'Just now' },
        ...prev.slice(0, 9)
      ]);
    }
  };

  const handleDeclineCall = () => {
    if (incomingCaller) {
      setRecentCalls(prev => [
        { id: Date.now(), name: incomingCaller.name, phone: incomingCaller.phone, type: 'missed', time: 'Just now' },
        ...prev.slice(0, 9)
      ]);
    }
    setViewMode('main');
    setIncomingCaller(null);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedContact) {
      const message: Message = {
        id: Date.now(),
        text: newMessage,
        sender: 'me',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setConversations(prev => ({
        ...prev,
        [selectedContact.id]: [...(prev[selectedContact.id] || []), message]
      }));
      setNewMessage('');
    }
  };

  const openChat = (contact: Contact) => {
    setSelectedContact(contact);
    setViewMode('chat');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Incoming Call View
  if (viewMode === 'incoming' && incomingCaller) {
    return (
      <div className="h-full bg-gradient-to-b from-neutral-900 to-neutral-800 text-white flex flex-col items-center justify-center p-8">
        <div className="text-center mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <User className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl mb-2">{incomingCaller.name}</h2>
          <p className="text-neutral-400">{incomingCaller.phone}</p>
          <p className="text-green-400 mt-4 animate-pulse">Incoming Call...</p>
        </div>
        
        <div className="flex gap-16">
          <button
            onClick={handleDeclineCall}
            className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all hover:scale-110"
          >
            <PhoneOff className="w-10 h-10" />
          </button>
          <button
            onClick={handleAnswerCall}
            className="w-20 h-20 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-all hover:scale-110 animate-bounce"
          >
            <PhoneCall className="w-10 h-10" />
          </button>
        </div>
      </div>
    );
  }

  // Active Call View
  if (viewMode === 'calling' && selectedContact) {
    return (
      <div className="h-full bg-gradient-to-b from-green-900 to-neutral-900 text-white flex flex-col items-center justify-center p-8">
        <div className="text-center mb-12">
          <div className="w-32 h-32 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-3xl mb-2">{selectedContact.name}</h2>
          <p className="text-neutral-400">{selectedContact.phone}</p>
          <p className="text-green-400 mt-4 text-2xl font-mono">{formatTime(callDuration)}</p>
        </div>
        
        <div className="flex gap-8 mb-12">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
              isMuted ? 'bg-red-600' : 'bg-neutral-700 hover:bg-neutral-600'
            }`}
          >
            {isMuted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
          </button>
          <button className="w-16 h-16 bg-neutral-700 hover:bg-neutral-600 rounded-full flex items-center justify-center transition-colors">
            <Volume2 className="w-7 h-7" />
          </button>
        </div>
        
        <button
          onClick={handleEndCall}
          className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all hover:scale-110"
        >
          <PhoneOff className="w-10 h-10" />
        </button>
      </div>
    );
  }

  // Dialer View
  if (viewMode === 'dialer') {
    return (
      <div className="h-full bg-neutral-900 text-white p-8 overflow-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setViewMode('main')}
            className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl">Phone</h1>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-neutral-800 rounded-2xl p-6 mb-6">
            <input
              type="text"
              value={dialNumber}
              readOnly
              placeholder="Enter number"
              className="w-full bg-transparent text-3xl text-center outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
              <button
                key={digit}
                onClick={() => handleDial(digit)}
                className="h-16 bg-neutral-800 hover:bg-neutral-700 rounded-xl text-2xl font-medium transition-colors active:scale-95"
              >
                {digit}
              </button>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => setDialNumber(prev => prev.slice(0, -1))}
              className="w-16 h-16 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={() => handleCall()}
              disabled={!dialNumber}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                dialNumber ? 'bg-green-600 hover:bg-green-700 hover:scale-110' : 'bg-neutral-700'
              }`}
            >
              <Phone className="w-7 h-7" />
            </button>
          </div>

          {/* Recent Calls in Dialer */}
          <div className="mt-8">
            <h3 className="text-lg mb-4 text-neutral-400">Recent</h3>
            <div className="space-y-2">
              {recentCalls.slice(0, 5).map((call) => (
                <button
                  key={call.id}
                  onClick={() => handleCall(call.phone, call.name)}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 rounded-lg p-3 text-left transition-colors flex items-center justify-between"
                >
                  <div>
                    <div className="mb-1">{call.name}</div>
                    <div className="text-sm text-neutral-400">{call.time}</div>
                  </div>
                  <Phone className="w-5 h-5 text-green-400" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Messages List View
  if (viewMode === 'messages') {
    return (
      <div className="h-full bg-neutral-900 text-white p-8 overflow-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setViewMode('main')}
            className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-3xl">Messages</h1>
        </div>

        <div className="space-y-3">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => openChat(contact)}
              className="w-full bg-neutral-800 hover:bg-neutral-700 rounded-xl p-4 text-left transition-colors flex items-center gap-4"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{contact.name}</span>
                  {contact.unread && contact.unread > 0 && (
                    <span className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs">
                      {contact.unread}
                    </span>
                  )}
                </div>
                <div className="text-sm text-neutral-400 truncate">{contact.lastMessage}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Chat View
  if (viewMode === 'chat' && selectedContact) {
    const messages = conversations[selectedContact.id] || [];
    
    return (
      <div className="h-full bg-neutral-900 text-white flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-4 p-6 border-b border-neutral-800">
          <button
            onClick={() => setViewMode('messages')}
            className="w-10 h-10 bg-neutral-800 hover:bg-neutral-700 rounded-full flex items-center justify-center transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-medium">{selectedContact.name}</div>
            <div className="text-sm text-neutral-400">{selectedContact.phone}</div>
          </div>
          <button
            onClick={() => handleCall(selectedContact.phone, selectedContact.name)}
            className="w-10 h-10 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-colors"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.sender === 'me'
                    ? 'bg-blue-600 rounded-br-sm'
                    : 'bg-neutral-800 rounded-bl-sm'
                }`}
              >
                <div>{message.text}</div>
                <div className="text-xs text-neutral-300 mt-1">{message.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-neutral-800">
          <div className="flex gap-4">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-neutral-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                newMessage.trim() ? 'bg-blue-600 hover:bg-blue-700' : 'bg-neutral-700'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main View
  return (
    <div className="h-full bg-neutral-900 text-white p-8 overflow-auto">
      <h1 className="text-3xl mb-8">Mobile Connect</h1>
      
      <div className="grid grid-cols-3 gap-6">
        {/* Connection Status & Phone Controls */}
        <div className="space-y-6">
          {/* Connection Status */}
          <div className={`rounded-2xl p-6 border transition-all ${
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
              {recentCalls.slice(0, 3).map((call) => (
                <button
                  key={call.id}
                  onClick={() => handleCall(call.phone, call.name)}
                  disabled={!phoneConnected}
                  className="w-full bg-neutral-900 hover:bg-neutral-700 rounded-lg p-3 text-left transition-colors group disabled:opacity-50 disabled:cursor-not-allowed"
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

            <button 
              onClick={() => phoneConnected && setViewMode('dialer')}
              disabled={!phoneConnected}
              className="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Phone className="w-5 h-5" />
              <span>Make Call</span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <h2 className="text-xl mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => phoneConnected && setViewMode('messages')}
                disabled={!phoneConnected}
                className="bg-neutral-900 hover:bg-neutral-700 rounded-lg p-4 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed relative"
              >
                <MessageSquare className="w-6 h-6 text-blue-400" />
                <span className="text-xs">Messages</span>
                {contacts.reduce((sum, c) => sum + (c.unread || 0), 0) > 0 && (
                  <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
                    {contacts.reduce((sum, c) => sum + (c.unread || 0), 0)}
                  </span>
                )}
              </button>
              <button 
                onClick={() => phoneConnected && setViewMode('dialer')}
                disabled={!phoneConnected}
                className="bg-neutral-900 hover:bg-neutral-700 rounded-lg p-4 transition-colors flex flex-col items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Phone className="w-6 h-6 text-green-400" />
                <span className="text-xs">Dial</span>
              </button>
            </div>
          </div>
        </div>

        {/* Media Player */}
        <div className="space-y-6">
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Music className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl">Now Playing</h2>
              </div>
              <button className="w-8 h-8 bg-neutral-700 hover:bg-neutral-600 rounded-full flex items-center justify-center transition-colors">
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Album Art */}
            <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-xl aspect-square mb-6 flex items-center justify-center relative overflow-hidden">
              <Music className="w-20 h-20 text-white/30" />
              {isPlaying && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="flex gap-1 items-end h-16">
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-2 bg-white rounded animate-pulse"
                        style={{ 
                          height: `${20 + Math.random() * 40}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="mb-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h3 className="text-xl">{currentTrack.title}</h3>
                <button 
                  onClick={() => toggleLike(currentTrack.id)}
                  className="transition-colors"
                >
                  <Heart 
                    className={`w-5 h-5 ${likedTracks.includes(currentTrack.id) ? 'text-red-500 fill-red-500' : 'text-neutral-400 hover:text-red-400'}`} 
                  />
                </button>
              </div>
              <div className="text-neutral-400">{currentTrack.artist}</div>
              <div className="text-sm text-neutral-500">{currentTrack.album}</div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div 
                className="h-2 bg-neutral-700 rounded-full overflow-hidden mb-2 cursor-pointer group"
                onClick={handleProgressClick}
              >
                <div 
                  className="h-full bg-purple-500 rounded-full relative transition-all"
                  style={{ width: `${(currentTime / currentTrack.duration) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg" />
                </div>
              </div>
              <div className="flex justify-between text-sm text-neutral-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <button 
                onClick={() => setIsShuffled(!isShuffled)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                  isShuffled ? 'text-purple-400' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Shuffle className="w-5 h-5" />
              </button>
              <button 
                onClick={handlePrevTrack}
                className="w-12 h-12 bg-neutral-700 hover:bg-neutral-600 rounded-full flex items-center justify-center transition-colors active:scale-95"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-colors"
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center transition-all active:scale-95"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7" fill="currentColor" />
                ) : (
                  <Play className="w-7 h-7 ml-1" fill="currentColor" />
                )}
              </button>
              <button 
                onClick={handleNextTrack}
                className="w-12 h-12 bg-neutral-700 hover:bg-neutral-600 rounded-full flex items-center justify-center transition-colors active:scale-95"
              >
                <SkipForward className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setRepeatMode(prev => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off')}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors relative ${
                  repeatMode !== 'off' ? 'text-purple-400' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Repeat className="w-5 h-5" />
                {repeatMode === 'one' && (
                  <span className="absolute -top-1 -right-1 text-xs bg-purple-500 rounded-full w-4 h-4 flex items-center justify-center">1</span>
                )}
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
                  className="flex-1 accent-purple-600 cursor-pointer"
                />
                <span className="text-sm text-neutral-400 w-10 text-right">{volume}%</span>
              </div>
            </div>
          </div>

          {/* Playlist */}
          <div className="bg-neutral-800 rounded-2xl p-6 border border-neutral-700">
            <h2 className="text-xl mb-4">Up Next</h2>
            <div className="space-y-2">
              {tracks.slice(currentTrackIndex + 1).concat(tracks.slice(0, currentTrackIndex)).map((track, i) => (
                <button
                  key={track.id}
                  onClick={() => {
                    const newIndex = tracks.findIndex(t => t.id === track.id);
                    setCurrentTrackIndex(newIndex);
                    setCurrentTime(0);
                    setIsPlaying(true);
                  }}
                  className={`w-full bg-neutral-900 hover:bg-neutral-700 rounded-lg p-3 text-left transition-colors flex items-center justify-between group ${
                    i === 0 ? 'ring-1 ring-purple-500/50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-neutral-700 group-hover:bg-purple-600 rounded flex items-center justify-center transition-colors">
                      <Play className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm mb-1">{track.title}</div>
                      <div className="text-xs text-neutral-400">{track.artist}</div>
                    </div>
                  </div>
                  <div className="text-xs text-neutral-500">{formatTime(track.duration)}</div>
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
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">
                  {unreadCount}
                </div>
              )}
              <button
                onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Mark all read
              </button>
            </div>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-lg p-4 border transition-all cursor-pointer hover:scale-[1.02] ${
                  notification.read
                    ? 'bg-neutral-900 border-neutral-800'
                    : 'bg-blue-500/10 border-blue-500/30'
                }`}
                onClick={() => {
                  handleMarkAsRead(notification.id);
                  if (notification.app === 'Messages') {
                    const contact = contacts.find(c => c.name === notification.title || c.name.includes(notification.title));
                    if (contact) {
                      openChat(contact);
                    }
                  }
                }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-xs transition-colors"
                    >
                      Mark Read
                    </button>
                  )}
                  {notification.app === 'Messages' && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        const contact = contacts.find(c => c.name === notification.title || c.name.includes(notification.title));
                        if (contact) {
                          openChat(contact);
                        }
                      }}
                      className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 rounded text-xs transition-colors"
                    >
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
                  doNotDisturb ? 'bg-red-600' : 'bg-neutral-700'
                }`}
              >
                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  doNotDisturb ? 'translate-x-7' : 'translate-x-0.5'
                }`}></div>
              </button>
            </div>
            {doNotDisturb && (
              <div className="mt-3 text-xs text-red-400 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                <span>All notifications are silenced</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}