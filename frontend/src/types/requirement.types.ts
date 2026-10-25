// ─── Category ────────────────────────────────────────────────────────────────

export type Category = 'planner' | 'performer' | 'crew';

// ─── Step 1 ──────────────────────────────────────────────────────────────────

export interface StepOneData {
  eventName: string;
  eventType: string;
  startDate: string; // YYYY-MM-DD
  endDate:   string; // YYYY-MM-DD
  location:  string;
  venue?:    string;
  category:  Category;
}

// ─── Step 2 + 3: Planner ─────────────────────────────────────────────────────

export type PlannerService =
  | 'decoration'
  | 'catering'
  | 'logistics'
  | 'coordination'
  | 'entertainment'
  | 'security'
  | 'photography';

export interface PlannerDetails {
  // Step 2
  expectedAttendance: number;
  planningScope:      'full-service' | 'selected-services';
  servicesRequired:   PlannerService[];
  estimatedBudget:    number;
  step2Notes?:        string;
  // Step 3
  decorationStyle?:     string;
  cateringPreference?:  string;
  vendorCoordination:   boolean;
  logisticsNotes?:      string;
  specialArrangements?: string;
}

// ─── Step 2 + 3: Performer ───────────────────────────────────────────────────

export type PerformanceType =
  | 'singer'
  | 'dj'
  | 'dancer'
  | 'band'
  | 'comedian'
  | 'speaker'
  | 'other';

export interface PerformerDetails {
  // Step 2
  performanceType:      PerformanceType;
  performanceTypeOther?: string;
  numberOfPerformers:   number;
  performanceDuration:  number;
  equipmentRequired:    string[];
  estimatedBudget:      number;
  step2Notes?:          string;
  // Step 3
  stageSetup?:             string;
  soundRequirements?:      string;
  lightingRequired:        boolean;
  backlineRequired:        boolean;
  performancePreferences?: string;
  specialRequests?:        string;
}

// ─── Step 2 + 3: Crew ────────────────────────────────────────────────────────

export type CrewRole =
  | 'photographer'
  | 'videographer'
  | 'sound-technician'
  | 'lighting-technician'
  | 'stage-crew'
  | 'emcee'
  | 'other';

export interface CrewDetails {
  // Step 2
  requiredRole:       CrewRole;
  requiredRoleOther?: string;
  numberOfPersonnel:  number;
  workingHours:       number;
  equipmentProvided:  boolean;
  estimatedBudget:    number;
  step2Notes?:        string;
  // Step 3
  shiftSchedule?:           string;
  onSiteResponsibilities?:  string;
  equipmentDetails?:        string;
  operationalNotes?:        string;
}

// ─── Full Payload (discriminated union) ─────────────────────────────────────

export type RequirementPayload =
  | (StepOneData & { category: 'planner';   details: PlannerDetails })
  | (StepOneData & { category: 'performer'; details: PerformerDetails })
  | (StepOneData & { category: 'crew';      details: CrewDetails });

// Partial accumulation type used during form navigation
export interface FormState {
  step1?: StepOneData;
  details?: Partial<PlannerDetails> | Partial<PerformerDetails> | Partial<CrewDetails>;
}

// API response types
export interface ApiSuccess {
  success: true;
  data: { _id: string; [key: string]: unknown };
}

export interface ApiError {
  success: false;
  errors?: {
    formErrors?: string[];
    fieldErrors?: Record<string, string[]>;
  };
  message?: string;
}

export type ApiResponse = ApiSuccess | ApiError;
