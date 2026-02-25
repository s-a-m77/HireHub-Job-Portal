export type UserRole = 'student' | 'employer' | 'admin';

export interface User {
  uid: string; // Firebase Auth UID
  id: string; // Legacy ID, can be same as uid
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  // Student fields
  skills?: string[];
  education?: string;
  resume?: string;
  bio?: string;
  phone?: string;
  // Employer fields
  companyName?: string;
  companyLogo?: string;
  companyDescription?: string;
  companyWebsite?: string;
  companySize?: string;
  industry?: string;
  companyLocation?: string;
  // Employer approval status
  isApproved?: boolean;
}

export interface Job {
  id: string;
  employerId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  description: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Remote';
  salary: string;
  requirements: string[];
  category: string;
  postedDate: string;
  deadline: string;
  status: 'active' | 'closed' | 'draft';
  applicantCount: number;
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  appliedDate: string;
  coverLetter: string;
}

export interface MessageReply {
  id: string;
  messageId: string;
  adminId: string;
  adminName: string;
  adminEmail: string;
  body: string;
  sentDate: string;
}

export interface Message {
  id: string;
  employerId: string;
  employerName: string;
  employerEmail: string;
  companyName: string;
  subject: string;
  body: string;
  sentDate: string;
  read: boolean;
  replies?: MessageReply[];
}

// Admin to Employer messages
export interface AdminMessageReply {
  id: string;
  messageId: string;
  employerId: string;
  body: string;
  sentDate: string;
}

export interface AdminMessage {
  id: string;
  adminId: string;
  adminName: string;
  employerId: string;
  employerName: string;
  employerEmail: string;
  subject: string;
  body: string;
  sentDate: string;
  read: boolean;
  status: 'pending' | 'read' | 'accepted' | 'rejected';
  accepted?: boolean;
  rejected?: boolean;
}

export interface StudentMessageReply {
  id: string;
  messageId: string;
  senderId: string; // Can be student or employer
  senderRole: 'student' | 'employer';
  body: string;
  sentDate: string;
}

export interface StudentMessage {
  id: string;
  employerId: string;
  employerName: string;
  studentId: string;
  senderRole: 'student' | 'employer'; // Track who sent the message
  subject: string;
  body: string;
  sentDate: string;
  status: 'sent' | 'read';
  replies?: StudentMessageReply[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: unknown;
  read: boolean;
  reply?: string;
  repliedDate?: string;
}

export interface Announcement {
  id: string;
  title: string;
  type: 'urgent' | 'normal' | 'other';
  description: string;
  postedDate: string;
  postedBy: string;
  image?: string;
  expiryDate?: string;
  targetAudience?: 'students' | 'employers' | 'all';
  attachment?: string;
}

export type Page =
  | 'home'
  | 'login'
  | 'register'
  | 'admin'
  | 'contact'
  // Student pages
  | 'student-dashboard'
  | 'browse-jobs'
  | 'applied-jobs'
  | 'student-profile'
  | 'job-detail'
  | 'student-messages'
  // Employer pages
  | 'employer-dashboard'
  | 'post-job'
  | 'manage-jobs'
  | 'find-talent'
  | 'employer-branding'
  | 'campus-recruiting'
  | 'pricing'
  | 'browse-companies'
  | 'edit-job'
  | 'view-applicants'
  | 'employer-messages'
  // Admin pages
  | 'admin-dashboard'
  | 'manage-students'
  | 'manage-employers'
  | 'manage-all-jobs'
  | 'admin-messages'
  | 'admin-contact-inbox'
  | 'announcements'
  | 'public-announcements';
