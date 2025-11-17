/**
 * TypeScript types for Supabase Database
 * Auto-generated types for type-safe database operations
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      hero_journeys: {
        Row: {
          id: string
          user_id: string | null
          tier: 'STANDARD' | 'PREMIUM' | 'ELITE'
          started_at: string
          completed_at: string | null
          current_station: number
          credits_deducted: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          tier: 'STANDARD' | 'PREMIUM' | 'ELITE'
          started_at?: string
          completed_at?: string | null
          current_station?: number
          credits_deducted?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          tier?: 'STANDARD' | 'PREMIUM' | 'ELITE'
          started_at?: string
          completed_at?: string | null
          current_station?: number
          credits_deducted?: number | null
          created_at?: string
        }
      }
      station_responses: {
        Row: {
          id: string
          journey_id: string
          station_number: number
          responses: Json
          time_spent_seconds: number | null
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          journey_id: string
          station_number: number
          responses: Json
          time_spent_seconds?: number | null
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          journey_id?: string
          station_number?: number
          responses?: Json
          time_spent_seconds?: number | null
          completed_at?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
