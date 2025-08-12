import { supabase, isConnected } from '../supabaseClient';

export interface MapAdvisor {
  id: string;
  first_name: string;
  last_name: string;
  about: string;
  professional_title?: string;
  military_branch?: string;
  // Optional location field if you plan to add later:
  // location?: [number, number];
}

class AdvisorMapService {
  private retryDelay = 2000; // 2 seconds delay between retries
  private maxRetries = 3;

  async getApprovedAdvisors(): Promise<MapAdvisor[]> {
    let retries = 0;

    const attemptFetch = async (): Promise<MapAdvisor[]> => {
      try {
        if (!isConnected()) {
          console.warn('Supabase connection is not established');
          if (retries < this.maxRetries) {
            retries++;
            console.log(`Retrying in ${this.retryDelay}ms... (${retries}/${this.maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            return attemptFetch();
          }
          throw new Error('Database connection unavailable after multiple retries');
        }

        const { data, error } = await supabase
          .from('advisor_applications')
          .select('id, name, about, professional_title, military_branch')
          .eq('status', 'approved')
          .order('name');

        if (error) {
          console.error('Error fetching advisors:', error);
          throw error;
        }

        if (!data) return [];

        return data.map(advisor => {
          const [first_name, ...rest] = (advisor.name || '').split(' ');
          const last_name = rest.join(' ');
          return {
            id: advisor.id,
            first_name,
            last_name,
            about: advisor.about,
            professional_title: advisor.professional_title,
            military_branch: advisor.military_branch
          } as MapAdvisor;
        });
      } catch (error) {
        console.error('Error occurred:', error);

        if (retries < this.maxRetries) {
          retries++;
          console.log(`Retrying in ${this.retryDelay}ms... (${retries}/${this.maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          return attemptFetch();
        }

        console.error('Max retries reached, returning empty array');
        return [];
      }
    };

    return attemptFetch();
  }
}

export const advisorMapService = new AdvisorMapService();
