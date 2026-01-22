
export interface TechEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'Workshop' | 'Meetup' | 'Hackathon' | 'Conference';
  organizer: string;
  image: string;
  tags: string[];
  link?: string;
}

export interface SearchResult {
  events: TechEvent[];
  summary: string;
  sources: { title: string; web: string }[];
}
