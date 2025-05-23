import { Event, Advisor } from '../types';

export const validationUtils = {
  // Validate email format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate phone number format
  isValidPhone(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  },

  // Validate URL format
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // Validate date format and range
  isValidDate(date: string, options: { 
    minDate?: Date;
    maxDate?: Date;
  } = {}): boolean {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return false;
    }
    
    if (options.minDate && dateObj < options.minDate) {
      return false;
    }
    if (options.maxDate && dateObj > options.maxDate) {
      return false;
    }
    
    return true;
  },

  // Validate event data
  validateEvent(event: Partial<Event>): string[] {
    const errors: string[] = [];
    
    if (!event.name?.trim()) {
      errors.push('Event name is required');
    }
    
    if (!event.start_date || !event.end_date) {
      errors.push('Event dates are required');
    } else {
      const startDate = new Date(event.start_date);
      const endDate = new Date(event.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        errors.push('Start date cannot be in the past');
      }
      if (endDate < startDate) {
        errors.push('End date cannot be before start date');
      }
    }
    
    if (!event.location?.trim()) {
      errors.push('Location is required');
    }
    
    if (event.website && !this.isValidUrl(event.website)) {
      errors.push('Invalid website URL format');
    }
    
    return errors;
  },

  // Validate advisor data
  validateAdvisor(advisor: Partial<Advisor>): string[] {
    const errors: string[] = [];
    
    if (!advisor.name?.trim()) {
      errors.push('Name is required');
    }
    
    if (!advisor.email?.trim()) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(advisor.email)) {
      errors.push('Invalid email format');
    }
    
    if (!advisor.phone?.trim()) {
      errors.push('Phone number is required');
    } else if (!this.isValidPhone(advisor.phone)) {
      errors.push('Invalid phone number format');
    }
    
    if (!advisor.about?.trim()) {
      errors.push('About section is required');
    }
    
    if (advisor.website && !this.isValidUrl(advisor.website)) {
      errors.push('Invalid website URL format');
    }
    
    return errors;
  },

  // Sanitize input data
  sanitizeInput(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .slice(0, 1000); // Limit length
  },

  // Sanitize object data recursively
  sanitizeObject<T extends object>(obj: T): T {
    const sanitized = { ...obj };
    for (const [key, value] of Object.entries(sanitized)) {
      if (typeof value === 'string') {
        (sanitized as any)[key] = this.sanitizeInput(value);
      } else if (value && typeof value === 'object') {
        (sanitized as any)[key] = this.sanitizeObject(value);
      }
    }
    return sanitized;
  }
};