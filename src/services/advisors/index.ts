import { apiService, ApiResponse } from '../api';
import { supabase } from '../../lib/supabaseClient';
import { db } from '../../lib/database';

export interface Advisor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  state: string;
  zip_code: string;
  phone?: string;
  street_address?: string;
  city?: string;
  webpage?: string;
  facebook?: string;
  x?: string;
  linkedin?: string;
  bluesky?: string;
  instagram?: string;
  professional_title?: string;
  military_branch?: string;
  years_of_mil_service?: string;
  years_of_us_civil_service?: string;
  about?: string;
  resume_url?: string;
  headshot_url?: string;
  business_logo_url?: string;
  status: 'pending' | 'approved' | 'rejected' | 'paused';
  location?: any; // Can be point, string, or array
}

class AdvisorService {
  private readonly endpoint = 'advisor_applications';

  async getAdvisors(): Promise<ApiResponse<Advisor[]>> {
    try {
      // Check if database is connected
      const isConnected = db.isConnected();
      
      if (!isConnected) {
        console.warn("Database not connected, returning mock advisors");
        return { 
          data: this.generateMockAdvisors(), 
          error: null 
        };
      }
      
      // Use the database helper for better reliability
      return await db.fetchSubmissions<Advisor>(this.endpoint);
    } catch (error) {
      console.error("Error in getAdvisors:", error);
      // Fall back to mock data
      return { 
        data: this.generateMockAdvisors(), 
        error: error as Error 
      };
    }
  }

  async submitApplication(application: Omit<Advisor, 'id' | 'status'>): Promise<ApiResponse<Advisor>> {
    try {
      // Use the database helper for better reliability
      return await db.createSubmission<Advisor>(this.endpoint, {
        ...application,
        status: 'pending'
      });
    } catch (error) {
      console.error("Error in submitApplication:", error);
      return { data: null, error: error as Error };
    }
  }

  async approveApplication(id: string): Promise<ApiResponse<Advisor>> {
    try {
      // Use the database helper for better reliability
      return await db.updateSubmissionStatus(this.endpoint, id, 'approved');
    } catch (error) {
      console.error("Error in approveApplication:", error);
      return { data: null, error: error as Error };
    }
  }

  async rejectApplication(id: string): Promise<ApiResponse<Advisor>> {
    try {
      // Use the database helper for better reliability
      return await db.updateSubmissionStatus(this.endpoint, id, 'rejected');
    } catch (error) {
      console.error("Error in rejectApplication:", error);
      return { data: null, error: error as Error };
    }
  }

  async deleteApplication(id: string): Promise<ApiResponse<void>> {
    try {
      // Use the database helper for better reliability
      return await db.deleteSubmission(this.endpoint, id);
    } catch (error) {
      console.error("Error in deleteApplication:", error);
      return { data: null, error: error as Error };
    }
  }

  // Generate some mock advisors for development or fallback when database is unavailable
  private generateMockAdvisors(): Advisor[] {
    return [
      {
        id: 'mock-advisor-1',
        first_name: 'John',
        last_name: 'Smith',
        email: 'john.smith@example.com',
        phone: '555-123-4567',
        professional_title: 'Defense Consultant',
        military_branch: 'Army',
        years_of_mil_service: '25',
        about: 'Former Special Operations Command with 25 years of experience in defense acquisition.',
        status: 'approved',
        street_address: '123 Defense St',
        city: 'Arlington',
        state: 'VA',
        zip_code: '22201',
        location: [-77.0864, 38.8904]
      },
      {
        id: 'mock-advisor-2',
        first_name: 'Jane',
        last_name: 'Adams',
        email: 'jane.adams@example.com',
        phone: '555-987-6543',
        professional_title: 'Intelligence Specialist',
        military_branch: 'Air Force',
        years_of_mil_service: '18',
        about: 'Intelligence specialist with expertise in cybersecurity and emerging technologies.',
        status: 'approved',
        street_address: '456 Innovation Ave',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94107',
        location: [-122.4194, 37.7749]
      }
    ];
  }
}

export const advisorService = new AdvisorService();
