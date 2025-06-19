export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bins: {
        Row: {
          capacity: number
          current_count: number
          id: string
          location: string
          status: string
        }
        Insert: {
          capacity: number
          current_count: number
          id?: string
          location: string
          status: string
        }
        Update: {
          capacity?: number
          current_count?: number
          id?: string
          location?: string
          status?: string
        }
        Relationships: []
      }
      chutes: {
        Row: {
          cv_status: string
          id: number
          label: string
          speed: number
        }
        Insert: {
          cv_status: string
          id?: number
          label: string
          speed: number
        }
        Update: {
          cv_status?: string
          id?: number
          label?: string
          speed?: number
        }
        Relationships: []
      }
      cv_systems: {
        Row: {
          id: number
          speed: number
          status: string
          system_type: string
        }
        Insert: {
          id?: number
          speed: number
          status: string
          system_type: string
        }
        Update: {
          id?: number
          speed?: number
          status?: string
          system_type?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          bot_assigned: string | null
          destination: string | null
          id: string
          status: string
          timestamp: string
          uid: string
        }
        Insert: {
          bot_assigned?: string | null
          destination?: string | null
          id?: string
          status: string
          timestamp?: string
          uid: string
        }
        Update: {
          bot_assigned?: string | null
          destination?: string | null
          id?: string
          status?: string
          timestamp?: string
          uid?: string
        }
        Relationships: []
      }
      robots: {
        Row: {
          battery_level: number
          current_row: number
          id: string
          name: string
          status: string
        }
        Insert: {
          battery_level: number
          current_row: number
          id?: string
          name: string
          status: string
        }
        Update: {
          battery_level?: number
          current_row?: number
          id?: string
          name?: string
          status?: string
        }
        Relationships: []
      }
      switches: {
        Row: {
          chute_id: number
          id: string
          side: string
          state: boolean
        }
        Insert: {
          chute_id: number
          id?: string
          side: string
          state: boolean
        }
        Update: {
          chute_id?: number
          id?: string
          side?: string
          state?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "switches_chute_id_fkey"
            columns: ["chute_id"]
            isOneToOne: false
            referencedRelation: "chutes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_random_package: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
