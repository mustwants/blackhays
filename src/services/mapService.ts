import { supabase } from '../supabaseClient';
import { LocationService } from '../lib/locationService';
import { errorUtils } from '../utils/errorUtils';
import { cacheUtils } from '../utils/cacheUtils';

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface MapEntity {
  id: string;
  name: string;
  type: 'advisor' | 'company' | 'consortium' | 'innovation' | 'event';
  description?: string;
  location: [number, number];
  address?: string;
  website?: string;
  details?: Record<string, unknown>;
}

// Mock data used when Supabase is unavailable or returns no data
const MOCK_MAP_ENTITIES: MapEntity[] = [
  {
    id: 'mock-advisor-1',
    name: 'John Smith',
    type: 'advisor',
    description:
      'Former Navy Admiral with 20+ years of experience in defense contracting and strategic planning.',
    location: [-77.0369, 38.9072],
    address: 'Washington, DC',
    details: {
      professional_title: 'Defense Strategy Consultant',
      military_branch: 'Navy',
      years_of_service: '20+'
    }
  },
  {
    id: 'mock-advisor-2',
    name: 'Sarah Johnson',
    type: 'advisor',
    description:
      'Cybersecurity expert and former Air Force Colonel specializing in defense technology.',
    location: [-121.4944, 38.5816],
    address: 'Sacramento, CA',
    details: {
      professional_title: 'Cybersecurity Consultant',
      military_branch: 'Air Force',
      years_of_service: '18'
    }
  },
  {
    id: 'mock-company-1',
    name: 'Defense Tech Solutions',
    type: 'company',
    description:
      'Leading provider of advanced defense technologies and cybersecurity solutions.',
    location: [-122.4194, 37.7749],
    website: 'https://example.com',
    details: {
      industry: 'Defense Technology',
      focus_areas: 'Cybersecurity, AI, Robotics'
    }
  },
  {
    id: 'mock-innovation-1',
    name: 'Advanced Materials Lab',
    type: 'innovation',
    description:
      'Research facility developing next-generation materials for defense applications.',
    location: [-71.0589, 42.3601],
    website: 'https://example.com',
    details: {
      type: 'Research Lab',
      focus_areas: 'Materials Science, Nanotechnology'
    }
  },
  {
    id: 'mock-consortium-1',
    name: 'Defense Innovation Consortium',
    type: 'consortium',
    description:
      'Collaborative network of defense contractors and research institutions.',
    location: [-104.9903, 39.7392],
    website: 'https://example.com',
    details: {
      focus_area: 'Defense Innovation',
      government_partner: 'Department of Defense'
    }
  },
  {
    id: 'mock-event-1',
    name: 'Defense Technology Summit 2024',
    type: 'event',
    description:
      'Annual summit bringing together defense contractors, innovators, and government officials.',
    location: [-77.0369, 38.9072],
    website: 'https://example.com',
    details: {
      start_date: new Date('2024-06-15').toISOString(),
      end_date: new Date('2024-06-17').toISOString()
    }
  }
];

class MapService {
  private static instance: MapService;
  private readonly CACHE_KEY = 'map_entities';
  private readonly CACHE_DURATION = 300000; // 5 minutes

  private constructor() {}

  static getInstance(): MapService {
    if (!this.instance) {
      this.instance = new MapService();
    }
    return this.instance;
  }

  async getAllEntities(): Promise<MapEntity[]> {
    try {
      // Check cache first
      const cached = cacheUtils.get<MapEntity[]>(this.CACHE_KEY);
      if (cached) return cached;

      const entities: MapEntity[] = [];

      // Fetch all approved entities in parallel
      const [advisors, companies, consortiums, innovations, events] = await Promise.all([
        this.getAdvisors(),
        this.getCompanies(),
        this.getConsortiums(),
        this.getInnovations(),
        this.getEvents()
      ]);

        entities.push(
          ...advisors,
          ...companies,
          ...consortiums,
          ...innovations,
          ...events
        );

        if (entities.length === 0) {
          return MOCK_MAP_ENTITIES;
        }

        // Cache the results
        cacheUtils.set(this.CACHE_KEY, entities);

        return entities;
      } catch (error) {
        errorUtils.logError(error, 'Error fetching map entities');
        return MOCK_MAP_ENTITIES;
      }
    }


  private async getAdvisors(): Promise<MapEntity[]> {
    const { data } = await supabase
      .from('advisor_applications')
      .select('*')
      .eq('status', 'approved');

    if (!data) return [];

    return data.map(advisor => ({
      id: advisor.id,
      name: advisor.name ?? '',
      type: 'advisor',
      description: advisor.about,
      location: this.getLocation(advisor),
      address: advisor.street_address ? `${advisor.street_address}, ${advisor.city}, ${advisor.state}` : `${advisor.city}, ${advisor.state}`,
      details: {
        professional_title: advisor.professional_title,
        military_branch: advisor.military_branch,
        years_of_mil_service: advisor.years_of_mil_service
      }
    }));
  }

  private async getCompanies(): Promise<MapEntity[]> {
    const { data } = await supabase
      .from('company_submissions')
      .select('*')
      .eq('status', 'approved');

    if (!data) return [];

    return data.map(company => ({
      id: company.id,
      name: company.name,
      type: 'company',
      description: company.description,
      location: this.getLocation(company),
      website: company.website,
      details: {
        industry: company.industry,
        focus_areas: company.focus_areas
      }
    }));
  }

  private async getConsortiums(): Promise<MapEntity[]> {
    const { data } = await supabase
      .from('consortium_submissions')
      .select('*')
      .eq('status', 'approved');

    if (!data) return [];

    return data.map(consortium => ({
      id: consortium.id,
      name: consortium.name,
      type: 'consortium',
      description: consortium.description,
      location: this.getLocation(consortium),
      website: consortium.website,
      details: {
        focus_area: consortium.focus_area,
        government_partner: consortium.government_partner
      }
    }));
  }

  private async getInnovations(): Promise<MapEntity[]> {
    const { data } = await supabase
      .from('innovation_submissions')
      .select('*')
      .eq('status', 'approved');

    if (!data) return [];

    return data.map(innovation => ({
      id: innovation.id,
      name: innovation.name,
      type: 'innovation',
      description: innovation.description,
      location: this.getLocation(innovation),
      website: innovation.website,
      details: {
        type: innovation.type,
        focus_areas: innovation.focus_areas
      }
    }));
  }

  private async getEvents(): Promise<MapEntity[]> {
    // Fetch upcoming events from both the events table and approved submissions
    const now = new Date().toISOString();
    const [eventsResult, submissionsResult] = await Promise.all([
      supabase
        .from('events')
        .select('*')
        .gte('end_date', now),
      supabase
        .from('event_submissions')
        .select('*')
        .in('status', ['approved', 'pending'])
        .gte('end_date', now)
    ]);

    const eventsData = eventsResult.data || [];
    const approvedSubmissions = submissionsResult.data || [];
    const allEvents = [...eventsData, ...approvedSubmissions];

    if (allEvents.length === 0) return [];

    // Remove duplicates based on name, date, and location
    const uniqueMap = new Map<string, any>();
    allEvents.forEach(event => {
      const key = `${event.name}|${event.start_date}|${event.location}`;
      uniqueMap.set(key, event);
    });

    return Array.from(uniqueMap.values()).map(event => ({
      id: event.id,
      name: event.name,
      type: 'event',
      description: event.about,
      location: this.getLocation(event),
      website: event.website,
      details: {
        start_date: event.start_date,
        end_date: event.end_date,
        status: event.status
      }
    }));
  }

  private getLocation(entity: Record<string, unknown>): [number, number] {
    let coords;

    // Check if location is already a valid numeric array
    if (Array.isArray((entity as any).location) && (entity as any).location.length === 2) {
      const [lng, lat] = (entity as any).location;
      const numLng = Number(lng);
      const numLat = Number(lat);
      if (!isNaN(numLng) && !isNaN(numLat)) {
        return [numLng, numLat];
      }
    }

    // Try to parse existing location fields
    if ((entity as any).location) {
      coords = LocationService.parseLocation((entity as any).location);
    }

    if (!coords && (entity as any).headquarters) {
      coords = LocationService.parseLocation((entity as any).headquarters);
    }

    // If no valid coordinates, generate from address-like fields
    if (
      !coords &&
      ((entity as any).address || (entity as any).location || (entity as any).headquarters)
    ) {
      coords = LocationService.getCoordinatesFromAddress(
        (entity as any).address || (entity as any).location || (entity as any).headquarters
      );
    }

    // If still no coordinates, use random US location
    if (!coords) {
      coords = LocationService.getCoordinatesFromAddress('washington dc');
    }

    return [coords.lng, coords.lat];
  }
}

export const mapService = MapService.getInstance();
