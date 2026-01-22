
import React, { useState, useRef, useEffect } from 'react';
import { INITIAL_EVENTS, CITIES, SHOW_DEV_TOOLS } from './constants';
import { DevEventForm } from './DevEventForm';

// Fireball Icon SVG Component
const FireballIcon = ({ className = "w-6 h-6" }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={{ filter: 'drop-shadow(0 0 2px rgba(255, 100, 0, 0.5))' }}
  >
    <path d="M14.5 2C13.5 3.5 13 5 13 6C13 7.5 14 8 15 9C16.5 10.5 17 12.5 16.5 14.5C16 16.5 14.5 18 12.5 18.5C10.5 19 8.5 18 7.5 16.5C8 17.5 9 18 10 18C11 18 12 17.5 12.5 16.5C13 15.5 12.5 14.5 11.5 14C10.5 13.5 9.5 13.5 8.5 14C7.5 14.5 6.5 15.5 6.5 17C6.5 19.5 8.5 21.5 11 22C14.5 22.5 18 20 18.5 16.5C19 13.5 17.5 10.5 15.5 8.5C14.5 7.5 14 6 14.5 4.5C14.8 3.5 15.5 2.5 16.5 2C15.5 2 15 2 14.5 2Z" />
    <path d="M12 4C11.5 5 11.5 6 12 7C12.5 8 13 8.5 13.5 8.5C14 8.5 14.5 8 14.5 7.5C14.5 6.5 14 5.5 13.5 4.5C13 3.5 12 3 12 4Z" className="opacity-70" />
  </svg>
);

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
    <div className="max-w-7xl mx-auto flex items-center justify-between glass rounded-full px-8 py-3">
      <div className="flex items-center gap-2 group cursor-pointer">
        <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:bg-red-500 group-hover:shadow-[0_0_30px_rgba(239,68,68,0.6)]">
          <FireballIcon className="w-5 h-5 text-yellow-200" />
        </div>
        <span className="text-xl font-black tracking-tight uppercase group-hover:text-red-400 transition-colors">find tech near me</span>
      </div>
      <div className="hidden md:block w-32"></div>
    </div>
  </nav>
);



// Event Card - Specifically for time-bound sessions
const EventCard = ({ item }) => (
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

      {/* Venue Display */}
      {item.venue && (
        <div className="mb-2">
          <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider border border-orange-500/20 px-2 py-0.5 rounded bg-orange-500/5">
            📍 {item.venue}
          </span>
        </div>
      )}

      <h3 className="text-xl font-black mb-3 line-clamp-1 group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{item.title}</h3>
      <p className="text-zinc-500 text-sm mb-6 line-clamp-3 leading-relaxed font-medium">{item.description}</p>

      <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-lg bg-zinc-900 flex items-center justify-center text-[10px] border border-white/10 text-zinc-400 font-bold">
            {item.organizer?.charAt(0) || 'T'}
          </div>
          <span className="text-[10px] text-zinc-500 truncate max-w-[100px] font-bold uppercase tracking-wider">{item.organizer}</span>
        </div>
        <a
          href={item.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-black uppercase tracking-[0.2em] text-white flex items-center gap-2 group-hover:gap-3 transition-all opacity-60 group-hover:opacity-100"
        >
          RSVP <span>→</span>
        </a>
      </div>
    </div>
  </div>
);

// Strict City Selector Component
const CitySelector = ({ selectedCity, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(selectedCity || '');
  const [filteredCities, setFilteredCities] = useState(CITIES);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setInputValue(selectedCity || '');
  }, [selectedCity]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        // Reset input to selected city if closed without selection
        if (!CITIES.includes(inputValue)) {
          setInputValue(selectedCity || '');
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [inputValue, selectedCity]);

  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputValue(query);
    setIsOpen(true);

    const filtered = CITIES.filter(city =>
      city.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCities(filtered);
  };

  const handleSelect = (city) => {
    setInputValue(city);
    onSelect(city);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full z-50">
      <div className="relative glass p-4 md:p-6 rounded-[2.5rem] border border-white/10 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            placeholder="Select a city (e.g., Baltimore, DC, Atlanta)..."
            className="w-full bg-transparent border border-white/5 rounded-3xl px-8 py-5 focus:outline-none focus:border-indigo-500/50 transition-all text-white font-bold tracking-tight text-lg placeholder:text-zinc-600"
          />
          {/* Dropdown Icon */}
          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
            ▼
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="mt-4 mx-4 glass rounded-3xl border border-indigo-500/30 overflow-hidden shadow-[0_20px_60px_rgba(79,70,229,0.3)] backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="max-h-64 overflow-y-auto">
            {filteredCities.length > 0 ? (
              filteredCities.map((city, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(city)}
                  className="w-full px-8 py-4 text-left text-sm text-zinc-300 hover:text-white hover:bg-indigo-500/20 transition-all font-black uppercase tracking-widest border-b border-white/10 last:border-b-0"
                >
                  {city}
                </button>
              ))
            ) : (
              <div className="px-8 py-4 text-zinc-500 text-sm font-medium italic">
                No supported cities found. Try 'Baltimore', 'DC', or 'Atlanta'.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [events] = useState(INITIAL_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#020202] text-zinc-100 pb-20 selection:bg-indigo-500/30 selection:text-white">
      {SHOW_DEV_TOOLS && import.meta.env.DEV && <DevEventForm />}
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32">
        {/* Header Section */}
        <div className="text-center mb-16 max-w-5xl mx-auto animate-fade-in group/header">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-orange-600 shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-all duration-500 group-hover/header:scale-110 group-hover/header:shadow-[0_0_80px_rgba(239,68,68,0.5)] group-hover/header:bg-orange-50">
              <FireballIcon className="w-8 h-8 group-hover/header:text-red-500 transition-colors" />
            </div>
          </div>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter mb-8 uppercase leading-[0.85] italic">
            <>Find your <br className="hidden md:block" /><span className="text-white not-italic">tech family</span></>
          </h1>
          <p className="text-zinc-500 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Your high-signal guide to local tech events, and grassroots tech meetups
          </p>
        </div>

        {/* Focused Search */}
        <section className="mb-24 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="max-w-4xl mx-auto">
            <CitySelector selectedCity={searchQuery} onSelect={setSearchQuery} />
          </div>
        </section>

        {/* Dynamic Content Grid */}
        <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-16">
            <h2 className="text-4xl font-black uppercase tracking-tighter italic">
              Upcoming Events
            </h2>
            <div className="h-[2px] flex-1 mx-12 bg-gradient-to-r from-zinc-900 to-transparent hidden md:block"></div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
              {events.length} Upcoming Events
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events
              .filter(item => {
                if (!searchQuery) return true;
                // Strict filtering based on the selected city string
                return item.location.includes(searchQuery);
              })
              .map(item => <EventCard key={item.id} item={item} />)
            }
          </div>
        </section>

        <footer className="mt-48 text-center border-t border-white/5 pt-24">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-10 flex items-center justify-center text-orange-600 shadow-[0_0_50px_rgba(255,255,255,0.1)] transition-transform hover:scale-110 duration-500 hover:shadow-[0_0_60px_rgba(239,68,68,0.4)]">
            <FireballIcon className="w-8 h-8 hover:text-red-500 transition-colors" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">find tech near me</h3>
          <p className="text-zinc-600 text-[11px] font-black uppercase tracking-[0.4em] mb-10">
            EST. 2026
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
