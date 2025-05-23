import { useState, useEffect } from 'react';
import { advisorService, Advisor } from '../services/advisors';
import { db } from '../lib/database';

export function useAdvisors() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchAdvisors();
  }, []);

  const fetchAdvisors = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await advisorService.getAdvisors();
      if (error) throw error;
      setAdvisors(data || []);
    } catch (err) {
      console.error('Error fetching advisors:', err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const submitApplication = async (application: Omit<Advisor, 'id' | 'status'>) => {
    try {
      const { data, error } = await advisorService.submitApplication(application);
      if (error) throw error;
      
      // Add the new advisor to the list
      if (data) {
        setAdvisors(prev => [...prev, data]);
      }
      
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const approveAdvisor = async (id: string) => {
    try {
      // Find the advisor to be approved
      const advisor = advisors.find(a => a.id === id);
      if (!advisor) {
        throw new Error('Advisor not found');
      }
      
      // If the ID is a mock ID (starts with 'mock-'), we need to create a real record
      if (id.startsWith('mock-')) {
        console.log('Creating real record for mock advisor', id);
        
        // Extract the data without the mock ID
        const { id: _, ...advisorData } = advisor;
        
        // Create a real record with approved status
        const { data, error: createError } = await db.createFromMockData('advisor_applications', {
          ...advisorData,
          status: 'approved'
        });
        
        if (createError) {
          console.error('Error creating real record for mock advisor:', createError);
          throw new Error(createError);
        }
        
        // Update the local state to reflect the new ID
        if (data) {
          setAdvisors(prev => 
            prev.map(a => a.id === id ? data : a)
          );
        }
        
        return { data, error: null };
      } else {
        // For real records, just update the status
        const { data, error } = await advisorService.approveApplication(id);
        if (error) throw error;
        
        // Update the advisor in the list
        if (data) {
          setAdvisors(prev => 
            prev.map(a => a.id === id ? data : a)
          );
        }
        
        return { data, error: null };
      }
    } catch (err) {
      console.error('Error approving advisor:', err);
      return { data: null, error: err as Error };
    }
  };

  const rejectAdvisor = async (id: string) => {
    try {
      // Similar approach as approveAdvisor for mock vs real IDs
      if (id.startsWith('mock-')) {
        const advisor = advisors.find(a => a.id === id);
        if (!advisor) {
          throw new Error('Advisor not found');
        }
        
        const { id: _, ...advisorData } = advisor;
        
        // Create a real record with rejected status
        const { data, error: createError } = await db.createFromMockData('advisor_applications', {
          ...advisorData,
          status: 'rejected'
        });
        
        if (createError) {
          throw new Error(createError);
        }
        
        // Update local state
        setAdvisors(prev => 
          prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a)
        );
        
        return { data, error: null };
      } else {
        const { data, error } = await advisorService.rejectApplication(id);
        if (error) throw error;
        
        // Update the advisor in the list
        setAdvisors(prev => 
          prev.map(a => a.id === id ? { ...a, status: 'rejected' } : a)
        );
        
        return { data, error: null };
      }
    } catch (err) {
      return { data: null, error: err as Error };
    }
  };

  const deleteAdvisor = async (id: string) => {
    try {
      // For mock IDs, just remove from local state
      if (id.startsWith('mock-')) {
        setAdvisors(prev => prev.filter(a => a.id !== id));
        return { error: null };
      }
      
      // For real IDs, delete from the database
      const { error } = await advisorService.deleteApplication(id);
      if (error) throw error;
      
      // Remove from local state on success
      setAdvisors(prev => prev.filter(a => a.id !== id));
      return { error: null };
    } catch (err) {
      return { error: err as Error };
    }
  };

  return {
    advisors,
    isLoading,
    error,
    submitApplication,
    approveAdvisor,
    rejectAdvisor,
    deleteAdvisor,
    refreshAdvisors: fetchAdvisors
  };
}