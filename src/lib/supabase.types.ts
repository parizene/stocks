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
      portfolios: {
        Row: {
          created_at: string | null
          id: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          user_id?: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      positions: {
        Row: {
          currency: string | null
          id: number
          portfolio_id: number
          symbol: string | null
        }
        Insert: {
          currency?: string | null
          id?: number
          portfolio_id: number
          symbol?: string | null
        }
        Update: {
          currency?: string | null
          id?: number
          portfolio_id?: number
          symbol?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "positions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          }
        ]
      }
      transactions: {
        Row: {
          date: string | null
          id: number
          position_id: number
          price: number | null
          quantity: number | null
          type: string | null
        }
        Insert: {
          date?: string | null
          id?: number
          position_id: number
          price?: number | null
          quantity?: number | null
          type?: string | null
        }
        Update: {
          date?: string | null
          id?: number
          position_id?: number
          price?: number | null
          quantity?: number | null
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_position_id_fkey"
            columns: ["position_id"]
            referencedRelation: "positions"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
