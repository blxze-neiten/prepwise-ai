// This file defines the SHAPE of our data
// Think of it like a blueprint — TypeScript checks that objects match this shape

export interface StudyPlan {
  id?: string;                    // Optional — Supabase generates this
  subject: string;                // e.g., "Mathematics"
  topics: string;                 // e.g., "Algebra, Calculus"
  exam_date: string;              // e.g., "2026-07-15"
  schedule: string;               // The AI-generated HTML schedule
  created_at?: string;            // Optional — auto-generated timestamp
}

export interface StudyFormData {
  subject: string;
  topics: string;
  examDate: string;
}