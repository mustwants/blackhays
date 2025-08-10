export type SubmissionStatus = 'pending'|'approved'|'denied'|'paused';

export interface Submission {
  id: string;
  user_id: string;
  title: string;
  description: string;
  attachment_url: string | null;
  status: SubmissionStatus;
  created_at: string;
  updated_at: string;
}

export type ActionKind = 'create'|'approve'|'deny'|'pause'|'resume'|'edit'|'delete';

export interface SubmissionAction {
  id: number;
  submission_id: string;
  actor_user_id: string;
  action: ActionKind;
  details: any;
  created_at: string;
}
