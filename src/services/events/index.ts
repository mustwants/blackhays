import { apiService, ApiResponse } from '../api';
import { supabase } from '../../lib/supabaseClient';
import { db } from '../../lib/database';

export interface Event {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  location: string;
  website?: string;
  about?: string;
    logo_url?: string;
}

export interface EventSubmission extends Omit<Event, 'id'> {
  submitter_email: string;
  status: 'pending' | 'approved' | 'rejected' | 'paused';
}

class EventService {
  private readonly endpoint = 'events';
  private readonly submissionsEndpoint = 'event_submissions';

  async getEvents(): Promise<ApiResponse<Event[]>> {
    try {
      console.log("Fetching events from Supabase...");
      
      // Get approved events from both tables in separate queries
      const [approvedSubmissionsResult, eventsResult] = await Promise.all([
        // Get approved submissions
        db.fetchApprovedSubmissions(this.submissionsEndpoint),
        
        // Get events from the events table
        db.fetchSubmissions(this.endpoint)
      ]);
      
      let allEvents = [];
      
      // Process approved submissions
      if (!approvedSubmissionsResult.error && approvedSubmissionsResult.data) {
        console.log("Found approved submissions:", approvedSubmissionsResult.data.length);
        allEvents = [...allEvents, ...approvedSubmissionsResult.data];
      } else if (approvedSubmissionsResult.error) {
        console.error("Error fetching approved submissions:", approvedSubmissionsResult.error);
      }
      
      // Process events
      if (!eventsResult.error && eventsResult.data) {
        console.log("Found events in events table:", eventsResult.data.length);
        allEvents = [...allEvents, ...eventsResult.data];
      } else if (eventsResult.error) {
        console.error("Error fetching events:", eventsResult.error);
      }
      
      // If we have any events, process and return them
      if (allEvents.length > 0) {
        // Remove duplicates based on name, date, and location
        const uniqueMap = new Map();
        allEvents.forEach(event => {
          const key = `${event.name}|${event.start_date}|${event.location}`;
          uniqueMap.set(key, event);
        });
        
        const uniqueEvents = Array.from(uniqueMap.values());
        console.log("Total unique events after deduplication:", uniqueEvents.length);
        
        // Sort by start date
        uniqueEvents.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
        
        return { data: uniqueEvents, error: null };
      }
      
      // If no events found, return empty array
      return { data: [], error: null };
    } catch (error) {
      console.error("Error in getEvents service function:", error);
      return { data: [], error: error as Error };
    }
  }

  async submitEvent(submission: Omit<EventSubmission, 'status'>): Promise<ApiResponse<EventSubmission>> {
    try {
      console.log('Submitting event:', submission);

      // Validate dates
      const startDate = new Date(submission.start_date);
      const endDate = new Date(submission.end_date);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error('Invalid date format');
      }
      
      if (endDate < startDate) {
        throw new Error('End date cannot be before start date');
      }

      // Prepare submission data
      const submissionData = {
        ...submission,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insert directly using Supabase client with public access
      const { data, error } = await supabase
        .from(this.submissionsEndpoint)
        .insert([submissionData])
        .select()
        .single();

      if (error) {
        console.error('Error submitting event:', error);
        throw error;
      }

      console.log('Successfully submitted event:', data);
      return { data, error: null };
    } catch (error) {
      console.error('Error in submitEvent:', error);
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error('Failed to submit event')
      };
    }
  }

  async approveEvent(id: string): Promise<ApiResponse<EventSubmission>> {
    try {
      console.log("Approving event submission:", id);
      
      // Get the submission data
      const { data: submission, error: getError } = await db.fetchSubmissions(this.submissionsEndpoint);
      
      if (getError) {
        console.error("Error fetching event for approval:", getError);
        return { data: null, error: getError };
      }
      
      const eventSubmission = submission?.find(s => s.id === id);
      if (!eventSubmission) {
        throw new Error("Event submission not found");
      }
      
      console.log("Retrieved event for approval:", eventSubmission);
      
      // Update the submission status to approved
      const updateResult = await db.updateSubmissionStatus(this.submissionsEndpoint, id, 'approved');
      
      if (updateResult.error) {
        console.error("Error approving event:", updateResult.error);
        return { data: null, error: updateResult.error };
      }
      
      console.log("Successfully updated event submission status to approved");
      
      // Try to insert into the events table
      try {
        const eventData = {
          name: eventSubmission.name,
          start_date: eventSubmission.start_date,
          end_date: eventSubmission.end_date,
          location: eventSubmission.location,
          website: eventSubmission.website || '',
                    about: eventSubmission.about || '',
          logo_url: eventSubmission.logo_url || ''
        };
        
        console.log("Attempting to insert into events table:", eventData);
        
        const insertResult = await db.createSubmission(this.endpoint, eventData);
        
        if (insertResult.error) {
          console.error("Error inserting to events table:", insertResult.error);
        } else {
          console.log("Successfully inserted into events table:", insertResult.data);
        }
      } catch (insertErr) {
        console.error("Exception when inserting to events table:", insertErr);
      }
      
      return { data: updateResult.data as EventSubmission, error: null };
    } catch (error) {
      console.error("Error in approveEvent:", error);
      return { data: null, error: error as Error };
    }
  }
  
  async getEventSubmissions(): Promise<ApiResponse<EventSubmission[]>> {
    try {
      // Get all event submissions
      const result = await db.fetchSubmissions(this.submissionsEndpoint);
      
      if (result.error) {
        console.error("Error fetching event submissions:", result.error);
        throw result.error;
      }
      
      return { data: result.data as EventSubmission[], error: null };
    } catch (error) {
      console.error("Error in getEventSubmissions:", error);
      return { data: [], error: error as Error };
    }
  }
  
  async updateEventStatus(id: string, status: 'approved' | 'rejected' | 'paused'): Promise<ApiResponse<EventSubmission>> {
    try {
      console.log(`Updating event ${id} status to ${status}`);
      
      // If this is an approval, use the specialized method
      if (status === 'approved') {
        return this.approveEvent(id);
      }
      
      // For other statuses, just update the status
      const result = await db.updateSubmissionStatus(this.submissionsEndpoint, id, status);
      
      if (result.error) {
        console.error(`Error updating event status to ${status}:`, result.error);
        throw result.error;
      }
      
      console.log(`Successfully updated event ${id} status to ${status}`);
      return { data: result.data as EventSubmission, error: null };
    } catch (error) {
      console.error(`Error in updateEventStatus to ${status}:`, error);
      return { data: null, error: error as Error };
    }
  }

  async deleteEvent(id: string): Promise<ApiResponse<void>> {
    try {
      console.log("Deleting event submission:", id);
      
      const result = await db.deleteSubmission(this.submissionsEndpoint, id);
      
      if (result.error) {
        console.error("Error deleting event:", result.error);
        throw result.error;
      }
      
      console.log("Successfully deleted event submission");
      return { data: null, error: null };
    } catch (error) {
      console.error("Error in deleteEvent:", error);
      return { data: null, error: error as Error };
    }
  }
}

export const eventService = new EventService();
