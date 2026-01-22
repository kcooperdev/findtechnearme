
import React, { useState, useEffect } from 'react';
import { INITIAL_EVENTS } from './constants';
import { searchLocalEvents } from './services/geminiService';
import { TechEvent } from './types';

// Minimalist Laptop Icon SVG Component
const LaptopIcon = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="18" height="12" x="3" y="4" rx="2" ry="2" />
    <line x1="2" x2="22" y1="20" y2="20" />
  </svg>
);

// Define interface for Navbar props
interface NavbarProps {
  onViewChange: (view: string) => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ onViewChange, currentView }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-full px-8 py-3">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-transform hover:scale-110 duration-300">
          <LaptopIcon className="w-5 h-5" />
        </div>
        <span className="text-xl font-black tracking-tight uppercase">find tech near me</span>
      </div>
      <div className="flex items-center gap-8 text-sm font-medium text-zinc-400">
        <button 
          onClick={() => onViewChange('events')}
          className={`${currentView === 'events' ? 'text-white underline underline-offset-8 decoration-indigo-500' : 'hover:text-zinc-200'} transition-all font-black uppercase tracking-widest text-[10px]`}
        >
          Explore
        </button>
        <button 
          onClick={() => onViewChange('communities')}
          className={`${currentView === 'communities' ? 'text-white underline underline-offset-8 decoration-indigo-500' : 'hover:text-zinc-200'} transition-all font-black uppercase tracking-widest text-[10px]`}
        >
          Communities
        </button>
      </div>
      <div className="hidden md:block w-32"></div> 
    </div>
  </nav>
);

// Event Card - Specifically for time-bound sessions
const EventCard: React.FC<{ item: TechEvent }> = ({ item }) => (
  <div className="glass rounded-3xl overflow-hidden event-card-hover border border-white/5 group flex flex-col h-full">
    <div className="relative h-48 overflow-hidden">
      <img 
        src={item.image || `https://picsum.photos/seed/${item.id}/800/400`} 
        alt={item.title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out grayscale group-hover:grayscale-0"
      />
      <div className="absolute top-5 left-5">
        <span className="bg-black/80 backdrop-blur-xl text-[9px] font-black px-4 py-1.5 rounded-full border border-white/10 uppercase tracking-[0.2em]">
          {item.category || 'Session'}
        </span>
      </div>
    </div>
    <div className="p-8 flex flex-col flex-1">
      <div className="flex items-center justify-between mb-4">
        <span className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">{item.date}</span>
        <span className="text-zinc-600 text-[9px] font-mono tracking-tighter">{item.time}</span>
      </div>
      <h3 className="text-xl font-black mb-3 line-clamp-1 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{item.title}</h3>
      <p className="text-zinc-500 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">{item.description}</p>
      
      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center text-[10px] border border-white/10 text-zinc-400 font-bold">
            {item.organizer?.charAt(0) || 'T'}
          </div>
          <span className="text-[10px] text-zinc-500 truncate max-w-[100px] font-bold uppercase tracking-wider">{item.organizer}</span>
        </div>
        <button className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2 group-hover:gap-3 transition-all opacity-60 group-hover:opacity-100">
          RSVP <span>→</span>
        </button>
      </div>
    </div>
  </div>
);

// Community Card - Specifically for persistent groups/tribes
const CommunityCard: React.FC<{ item: any }> = ({ item }) => (
  <div className="glass rounded-[2rem] p-8 border border-white/5 event-card-hover group flex flex-col gap-6">
    <div className="flex items-start justify-between">
      <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
      </div>
      <span className="text-[9px] font-black px-4 py-1.5 rounded-full border border-indigo-500/30 text-indigo-400 uppercase tracking-widest">
        Tribe
      </span>
    </div>
    <div>
      <h3 className="text-2xl font-black uppercase tracking-tight mb-3 group-hover:text-indigo-400 transition-colors">{item.title}</h3>
      <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-3">{item.description}</p>
    </div>
    <div className="mt-auto flex items-center justify-between pt-6 border-t border-white/5">
      <span className="text-[10px] text-zinc-600 font-black uppercase tracking-widest">{item.memberCount || '1.2k members'}</span>
      <button className="bg-white text-black text-[10px] font-black px-6 py-2.5 rounded-xl uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">
        Join Node
      </button>
    </div>
  </div>
);

const App = () => {
  const [view, setView] = useState('events');
  const [events] = useState(INITIAL_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState<any>(null);
  const [userLocation, setUserLocation] = useState('San Francisco, CA');

  const communities = [
    { id: 'c1', title: 'SF Python', description: 'The largest Python community in the Bay Area. Monthly meetups and workshops for elite developers.', organizer: 'SF Python Org', image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=200', memberCount: '4.5k Members' },
    { id: 'c2', title: 'React SF', description: 'Deep tech exploration of the React ecosystem. Focusing on signals, concurrent rendering, and RSC.', organizer: 'Meta Communities', image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=200', memberCount: '2.8k Members' },
    { id: 'c3', title: 'Bay Area AI', description: 'Exploring the future of LLMs, agentic workflows, and local high-performance inference.', organizer: 'Independent Builders', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=200', memberCount: '8.2k Members' },
    { id: 'c4', title: 'Rust Bay Area', description: 'Low-level performance, safety, and modern systems programming. Regular monthly workshops.', organizer: 'Rust Foundation', image: 'https://images.unsplash.com/photo-1614811639360-5ef935cfca2f?auto=format&fit=crop&q=80&w=200', memberCount: '1.1k Members' },
  ];

  const handleAISearch = async () => {
    if (!searchQuery.trim()) return;
    setAiLoading(true);
    setAiResults(null);
    try {
      const type = view === 'events' ? 'upcoming specific events' : 'persistent tech communities and meetup groups';
      const results = await searchLocalEvents(userLocation, `Find ${type} related to: ${searchQuery}`);
      setAiResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    // Scroll to top on view change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setAiResults(null);
    setSearchQuery('');
  }, [view]);

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 pb-20 selection:bg-indigo-500/30 selection:text-white">
      <Navbar onViewChange={setView} currentView={view} />

      <main className="max-w-7xl mx-auto px-6 pt-32">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-5xl mx-auto animate-fade-in">
          <div className="flex justify-center mb-8">
             <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-black shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                <LaptopIcon className="w-8 h-8" />
             </div>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 uppercase leading-[0.85] italic">
            {view === 'events' ? (
              <>Find your <br className="hidden md:block" /><span className="text-white not-italic">tech family</span></>
            ) : (
              <>Join the <br className="hidden md:block" /><span className="text-indigo-500 not-italic">local tribes</span></>
            )}
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            {view === 'events' 
              ? "The heartbeat of the local tech scene. Real-world sessions, hackathons, and coffee chats."
              : "Don't just attend—belong. Explore the permanent developer communities shaping your city's future."}
          </p>
        </div>

        {/* Focused Search */}
        <section className="mb-24 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="relative group max-w-4xl mx-auto">
            <div className="relative glass p-4 md:p-6 rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <input 
                  type="text"
                  placeholder={view === 'events' ? "Search for sessions (e.g., 'React AI', 'Hackathon')..." : "Find a tribe (e.g., 'Python', 'Web3', 'Design')..."}
                  className="w-full bg-transparent border border-white/5 rounded-3xl px-8 py-5 focus:outline-none focus:border-indigo-500/50 transition-all text-white font-bold tracking-tight text-lg"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAISearch()}
                />
                <button 
                  onClick={handleAISearch}
                  disabled={aiLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-200 disabled:opacity-50 transition-all active:scale-95 shadow-xl"
                >
                  {aiLoading ? 'SCANNING...' : 'SCAN LOCAL'}
                </button>
              </div>
              <div className="md:w-64 glass rounded-3xl px-6 flex items-center gap-4 border border-white/5 group/loc">
                <span className="text-zinc-600 group-hover/loc:text-indigo-400 transition-colors">📍</span>
                <input 
                  type="text" 
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  className="bg-transparent text-xs text-zinc-400 focus:outline-none w-full font-black uppercase tracking-widest"
                />
              </div>
            </div>
          </div>

          {aiResults && (
            <div className="mt-16 max-w-4xl mx-auto animate-in fade-in zoom-in-95 duration-700">
              <div className="glass p-10 rounded-[3rem] border border-indigo-500/20 shadow-[0_40px_100px_rgba(79,70,229,0.1)]">
                <div className="flex items-center gap-5 mb-8">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400">
                    {view === 'events' ? 'Pulse Analysis' : 'Tribe Directory'}
                  </span>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>
                <div className="text-zinc-300 leading-loose text-base whitespace-pre-wrap font-medium">
                  {aiResults.summary}
                </div>
                {aiResults.sources.length > 0 && (
                  <div className="mt-12 pt-10 border-t border-white/5">
                    <h4 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-6">Verified Portals</h4>
                    <div className="flex flex-wrap gap-3">
                      {aiResults.sources.map((source: any, idx: number) => (
                        <a 
                          key={idx} 
                          href={source.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] bg-white/5 border border-white/10 px-5 py-3 rounded-2xl hover:bg-white/10 hover:text-white transition-all text-zinc-500 font-black uppercase tracking-widest flex items-center gap-2 group/source"
                        >
                          {source.title.length > 30 ? source.title.slice(0, 30) + '...' : source.title}
                          <span className="opacity-0 group-hover/source:opacity-100 transition-opacity">↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* Dynamic Content Grid */}
        <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">
              {view === 'events' ? 'Upcoming Sessions' : 'Local Tribes'}
            </h2>
            <div className="h-[2px] flex-1 mx-12 bg-gradient-to-r from-zinc-900 to-transparent hidden md:block"></div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
              {view === 'events' ? `${events.length} ACTIVE SIGNALS` : `${communities.length} ESTABLISHED NODES`}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {view === 'events' ? (
              events.map(item => <EventCard key={item.id} item={item} />)
            ) : (
              communities.map(item => <CommunityCard key={item.id} item={item} />)
            )}
          </div>
        </section>

        <footer className="mt-48 text-center border-t border-white/5 pt-24">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-10 flex items-center justify-center text-black shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-transform hover:scale-110 duration-500">
            <LaptopIcon className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">find tech near me</h3>
          <p className="text-zinc-600 text-[11px] font-black uppercase tracking-[0.4em] mb-10">
            EST. 2024 / PROTOCOL LOCAL
          </p>
          <div className="flex justify-center gap-12 text-[10px] font-black text-zinc-800 uppercase tracking-[0.3em]">
            <a href="#" className="hover:text-indigo-500 transition-all hover:tracking-[0.4em]">Privacy</a>
            <a href="#" className="hover:text-indigo-500 transition-all hover:tracking-[0.4em]">Terms</a>
            <a href="#" className="hover:text-indigo-500 transition-all hover:tracking-[0.4em]">X / Twitter</a>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default App;
