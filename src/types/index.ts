// Common status types
export type SubmissionStatus = 'pending' | 'approved' | 'rejected' | 'paused';

// Base submission interface
export interface BaseSubmission {
  id: string;
  status: SubmissionStatus;
  created_at: string;
  updated_at?: string;
}

// Event types
export interface Event extends BaseSubmission {
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
}

// Advisor types
export interface Advisor extends BaseSubmission {
  name: string;
  email: string;
  state: string;
  zip_code: string;
  phone?: string;
  address?: string;
  city?: string;
  webpage?: string;
  facebook?: string;
  x?: string;
  linkedin?: string;
  bluesky?: string;
  instagram?: string;
  professional_title?: string;
  military_branch?: string;
  other_branch?: string;
  years_of_service?: string;
  service_status?: string[];
  other_status?: string;
  about?: string;
  resume_url?: string;
  headshot_url?: string;
  business_logo_url?: string;
  location?: any;
}

// Location types
export interface LocationCoordinates {
  lng: number;
  lat: number;
}

// Database operation types
export interface DatabaseOptions {
  returnData?: boolean;
  maxRetries?: number;
}

export interface DatabaseFilter {
  column: string;
  value: any;
}

export interface DatabaseOrderBy {
  column: string;
  ascending?: boolean;
}

export interface DatabaseSelectOptions {
  columns?: string;
  filters?: DatabaseFilter[];
  orderBy?: DatabaseOrderBy;
}

// API response type
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

// Connection manager types
export type ConnectionListener = (connected: boolean) => void;
export type QueuedOperation = () => Promise<void>;

// Data sync types
export interface PendingChange {
  table: string;
  operation: 'insert' | 'update' | 'delete';
  data: any;
}
