export interface Will {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: WillStatus;
  testator_name?: string;
  testator_address?: string;
  testator_date_of_birth?: Date;
  testator_nationality?: string;
  personal_law_selection?: string;
  executor_name?: string;
  executor_address?: string;
  executor_phone?: string;
  executor_email?: string;
  guardian_name?: string;
  guardian_address?: string;
  guardian_phone?: string;
  guardian_email?: string;
  asset_bequests?: any[];
  digital_assets?: any[];
  video_witness_status: VideoWitnessStatus;
  testator_video_url?: string;
  witness1_video_url?: string;
  witness2_video_url?: string;
  witness1_name?: string;
  witness2_name?: string;
  witness1_email?: string;
  witness2_email?: string;
  lawyer_name?: string;
  lawyer_firm?: string;
  lawyer_address?: string;
  lawyer_phone?: string;
  lawyer_email?: string;
  created_at: Date;
  updated_at: Date;
  signed_at?: Date;
  will_sections?: WillSection[];
  beneficiaries?: WillBeneficiary[];
}

export interface WillSection {
  id: string;
  will_id: string;
  title: string;
  description?: string;
  section_type: WillSectionType;
  status: WillSectionStatus;
  content?: any;
  order: number;
  is_required: boolean;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

export interface WillBeneficiary {
  id: string;
  will_id: string;
  name: string;
  relationship?: string;
  address?: string;
  phone?: string;
  email?: string;
  percentage?: number;
  specific_assets?: any[];
  is_primary: boolean;
  created_at: Date;
  updated_at: Date;
}

// Extended interfaces for controller operations
export interface CreateWillRequest {
  title?: string;
  description?: string;
}

export interface UpdateWillRequest {
  title?: string;
  description?: string;
  status?: WillStatus;
}

export interface UpdateWillSectionRequest {
  content?: any;
  status?: WillSectionStatus;
}

export interface AddBeneficiaryRequest {
  name: string;
  relationship?: string;
  address?: string;
  phone?: string;
  email?: string;
  percentage?: number;
  specific_assets?: any[];
}

export interface UpdateLegalInfoRequest {
  lawyer_name?: string;
  lawyer_firm?: string;
  lawyer_address?: string;
  lawyer_phone?: string;
  lawyer_email?: string;
}

export interface WillProgress {
  progressPercent: number;
  completedSections: number;
  totalSections: number;
  sections: WillSection[];
}

export interface VideoWitnessStatusResponse {
  testator: 'complete' | 'pending';
  witness1: 'complete' | 'pending';
  witness2: 'complete' | 'pending';
}

export interface WillPreviewData {
  title: string;
  testator_name?: string;
  executor_name?: string;
  guardian_name?: string;
  beneficiaries: WillBeneficiary[];
  sections: WillSection[];
  status: WillStatus;
}

export enum WillStatus {
  DRAFT = 'draft',
  COMPLETED = 'completed',
  SIGNED = 'signed',
  REVOKED = 'revoked'
}

export enum WillSectionType {
  PERSONAL_INFO = 'personal_info',
  EXECUTORS_GUARDIANS = 'executors_guardians',
  ASSET_BESTS = 'asset_bequests',
  DIGITAL_ASSETS = 'digital_assets',
  VIDEO_WITNESS = 'video_witness',
  LEGAL_REVIEW = 'legal_review'
}

export enum WillSectionStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
  MISSING = 'missing'
}

export enum VideoWitnessStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
  MISSING = 'missing'
}