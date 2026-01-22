import React, { useState } from 'react';
import { CITIES, CATEGORIES } from './constants';

export const DevEventForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        venue: '',
        city: '',
        category: 'Meetup',
        organizer: '',
        tags: '',
        link: '',
        image: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const generateJSON = () => {
        const id = Math.random().toString(36).substr(2, 9);
        const image = formData.image || `https://picsum.photos/seed/${id}/800/400`;
        const tagsArray = formData.tags.split(',').map(t => `'${t.trim()}'`).filter(t => t !== "''").join(', ');

        const jsString = `  {
    id: '${id}',
    title: '${formData.title.replace(/'/g, "\\'")}',
    description: '${formData.description.replace(/'/g, "\\'")}',
    date: '${formData.date}',
    time: '${formData.time}',
    venue: '${formData.venue.replace(/'/g, "\\'")}',
    location: '${formData.city}',
    category: '${formData.category}',
    organizer: '${formData.organizer}',
    image: '${image}',
    tags: [${tagsArray}],
    link: '${formData.link}',
  },`;

        console.log(jsString);
        navigator.clipboard.writeText(jsString);
        alert('Event Code copied to clipboard! (JS Style)');
    };

    return (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md overflow-y-auto p-8 flex items-center justify-center">
            <div className="w-full max-w-2xl bg-[#111] border border-orange-500/50 rounded-3xl p-8 shadow-[0_0_50px_rgba(234,88,12,0.2)]">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-black uppercase text-orange-500 tracking-tighter">
                        Dev Tools: Add Event
                    </h2>
                    <div className="px-3 py-1 bg-orange-900/30 border border-orange-500/30 rounded-lg text-orange-400 text-xs font-mono uppercase tracking-widest">
                        Developer Mode
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="space-y-4">
                        <input name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" />
                        <input name="date" placeholder="Date (e.g. Oct 24, 2026)" value={formData.date} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" />
                        <input name="time" placeholder="Time (e.g. 6:30 PM)" value={formData.time} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" />

                        <div className="grid grid-cols-2 gap-2">
                            <input name="venue" placeholder="Venue Name" value={formData.venue} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm" />
                            <select name="city" value={formData.city} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 text-sm">
                                <option value="">Select City...</option>
                                {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500">
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input name="organizer" placeholder="Organizer" value={formData.organizer} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" />
                        <input name="link" placeholder="RSVP Link (URL)" value={formData.link} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" />
                        <input name="image" placeholder="Image URL (optional)" value={formData.image} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" />
                        <input name="tags" placeholder="Tags (comma separated)" value={formData.tags} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500" />
                    </div>
                </div>
                <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500 mb-8 resize-none" />

                <button onClick={generateJSON} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-[0.2em] py-4 rounded-2xl transition-all shadow-lg hover:shadow-orange-500/20 active:scale-95">
                    Generate JS Object & Copy
                </button>
                <p className="text-center text-zinc-500 text-xs mt-4 font-mono">
                    Paste the result into constants.js
                </p>
            </div>
        </div>
    );
};
