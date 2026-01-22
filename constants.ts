
import { TechEvent } from './types';

export const INITIAL_EVENTS: TechEvent[] = [
  {
    id: '1',
    title: 'React & AI: The Next Frontier',
    description: 'A deep dive into integrating Large Language Models with modern React architecture.',
    date: 'Oct 24, 2024',
    time: '6:30 PM',
    location: 'SOMA Loft, San Francisco',
    category: 'Meetup',
    organizer: 'SF Dev Collective',
    image: 'https://picsum.photos/seed/tech1/800/400',
    tags: ['React', 'AI', 'GenAI'],
  },
  {
    id: '2',
    title: 'Open Source Saturday Hack',
    description: 'Join local developers for a day of contributing to open-source projects. All skill levels welcome.',
    date: 'Oct 26, 2024',
    time: '10:00 AM',
    location: 'Community Hub, Palo Alto',
    category: 'Hackathon',
    organizer: 'Grassroots Hackers',
    image: 'https://picsum.photos/seed/tech2/800/400',
    tags: ['OSS', 'Hackathon', 'Community'],
  },
  {
    id: '3',
    title: 'WASM Performance Workshop',
    description: 'Learn how to build high-performance web applications using WebAssembly and Rust.',
    date: 'Nov 02, 2024',
    time: '5:00 PM',
    location: 'Tech Garden, Berkeley',
    category: 'Workshop',
    organizer: 'Berkeley Techies',
    image: 'https://picsum.photos/seed/tech3/800/400',
    tags: ['Rust', 'WASM', 'Performance'],
  }
];

export const CATEGORIES = ['All', 'Workshop', 'Meetup', 'Hackathon', 'Conference'];
