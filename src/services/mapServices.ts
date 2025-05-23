// src/services/mapService.ts
import { supabase } from '../lib/supabaseClient';
import { LocationService } from '../lib/locationService';
import { errorUtils } from '../utils/errorUtils';
import { cacheUtils } from '../utils/cacheUtils';

export interface MapEntity {
  id: string;
  name: string;
  type: 'advisor' | 'company' | 'consortium' | 'innovation' | 'event';
  description?: string;
  location: [number, number];
  address?: string;
  website?: string;
  details?: Record<string, any>;
}

export class MapService {
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

      entities.push(...advisors, ...companies, ...consortiums, ...innovations, ...events);

      // Cache the results
      cacheUtils.set(this.CACHE_KEY, entities);

      return entities;
    } catch (error) {
      errorUtils.logError(error, 'Error fetching map entities');
      return [];
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
      name: advisor.name,
      type: 'advisor',
      description: advisor.about,
      location: this.getLocation(advisor),
      address: advisor.address,
      details: {
        professional_title: advisor.professional_title,
        military_branch: advisor.military_branch,
        years_of_service: advisor.years_of_service
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
    const { data } = await supabase
      .from('events')
      .select('*')
      .gte('end_date', new Date().toISOString());

    if (!data) return [];

    return data.map(event => ({
      id: event.id,
      name: event.name,
      type: 'event',
      description: event.about,
      location: this.getLocation(event),
      website: event.website,
      details: {
        start_date: event.start_date,
        end_date: event.end_date
      }
    }));
  }

  private getLocation(entity: any): [number, number] {
    let coords;

    // Try to parse existing location
    if (entity.location) {
      coords = LocationService.parseLocation(entity.location);
    }

    // If no valid coordinates, generate from address
    if (!coords && (entity.address || entity.location)) {
      coords = LocationService.getCoordinatesFromAddress(entity.address || entity.location);
    }

    // If still no coordinates, use random US location
    if (!coords) {
      coords = LocationService.getCoordinatesFromAddress('washington dc');
    }

    return [coords.lng, coords.lat];
  }
}

export const mapService = MapService.getInstance();
