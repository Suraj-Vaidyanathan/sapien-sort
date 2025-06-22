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
      bot_position_log: {
        Row: {
          battery_level: number | null
          bot_id: string | null
          log_id: number
          sector_id: number | null
          speed: number | null
          timestamp: string | null
        }
        Insert: {
          battery_level?: number | null
          bot_id?: string | null
          log_id?: number
          sector_id?: number | null
          speed?: number | null
          timestamp?: string | null
        }
        Update: {
          battery_level?: number | null
          bot_id?: string | null
          log_id?: number
          sector_id?: number | null
          speed?: number | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_position_log_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["bot_id"]
          },
          {
            foreignKeyName: "bot_position_log_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["sector_id"]
          },
        ]
      }
      bot_statuses: {
        Row: {
          description: string | null
          status_id: number
          status_name: string
        }
        Insert: {
          description?: string | null
          status_id?: number
          status_name: string
        }
        Update: {
          description?: string | null
          status_id?: number
          status_name?: string
        }
        Relationships: []
      }
      bots: {
        Row: {
          battery_level: number | null
          bot_id: string
          current_package_id: string | null
          current_sector_id: number | null
          current_speed: number | null
          destination_sector_id: number | null
          status_id: number | null
          switch_route_id: number | null
        }
        Insert: {
          battery_level?: number | null
          bot_id: string
          current_package_id?: string | null
          current_sector_id?: number | null
          current_speed?: number | null
          destination_sector_id?: number | null
          status_id?: number | null
          switch_route_id?: number | null
        }
        Update: {
          battery_level?: number | null
          bot_id?: string
          current_package_id?: string | null
          current_sector_id?: number | null
          current_speed?: number | null
          destination_sector_id?: number | null
          status_id?: number | null
          switch_route_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bots_current_sector_id_fkey"
            columns: ["current_sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["sector_id"]
          },
          {
            foreignKeyName: "bots_destination_sector_id_fkey"
            columns: ["destination_sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["sector_id"]
          },
          {
            foreignKeyName: "bots_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "bot_statuses"
            referencedColumns: ["status_id"]
          },
          {
            foreignKeyName: "bots_switch_route_id_fkey"
            columns: ["switch_route_id"]
            isOneToOne: false
            referencedRelation: "switch_routes"
            referencedColumns: ["route_id"]
          },
        ]
      }
      connection_types: {
        Row: {
          created_at: string | null
          description: string | null
          type_id: number
          type_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          type_id?: number
          type_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          type_id?: number
          type_name?: string
        }
        Relationships: []
      }
      movement_events_log: {
        Row: {
          bot_id: string | null
          event_type: string | null
          from_sector: number | null
          log_id: number
          package_id: string | null
          timestamp: string | null
          to_sector: number | null
        }
        Insert: {
          bot_id?: string | null
          event_type?: string | null
          from_sector?: number | null
          log_id?: number
          package_id?: string | null
          timestamp?: string | null
          to_sector?: number | null
        }
        Update: {
          bot_id?: string | null
          event_type?: string | null
          from_sector?: number | null
          log_id?: number
          package_id?: string | null
          timestamp?: string | null
          to_sector?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "movement_events_log_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["bot_id"]
          },
          {
            foreignKeyName: "movement_events_log_from_sector_fkey"
            columns: ["from_sector"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["sector_id"]
          },
          {
            foreignKeyName: "movement_events_log_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["package_id"]
          },
          {
            foreignKeyName: "movement_events_log_to_sector_fkey"
            columns: ["to_sector"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["sector_id"]
          },
        ]
      }
      package_statuses: {
        Row: {
          description: string | null
          status_id: number
          status_name: string
        }
        Insert: {
          description?: string | null
          status_id?: number
          status_name: string
        }
        Update: {
          description?: string | null
          status_id?: number
          status_name?: string
        }
        Relationships: []
      }
      packages: {
        Row: {
          assigned_at: string | null
          assigned_bot_id: string | null
          barcode: string | null
          delivered_at: string | null
          destination_sector: number | null
          package_id: string
          scanned_at: string | null
          status_id: number | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_bot_id?: string | null
          barcode?: string | null
          delivered_at?: string | null
          destination_sector?: number | null
          package_id: string
          scanned_at?: string | null
          status_id?: number | null
        }
        Update: {
          assigned_at?: string | null
          assigned_bot_id?: string | null
          barcode?: string | null
          delivered_at?: string | null
          destination_sector?: number | null
          package_id?: string
          scanned_at?: string | null
          status_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_assigned_bot_id_fkey"
            columns: ["assigned_bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["bot_id"]
          },
          {
            foreignKeyName: "packages_destination_sector_fkey"
            columns: ["destination_sector"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["sector_id"]
          },
          {
            foreignKeyName: "packages_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "package_statuses"
            referencedColumns: ["status_id"]
          },
        ]
      }
      parcel_tracking_log: {
        Row: {
          bot_id: string | null
          event_type: string | null
          location_sector: number | null
          log_id: number
          package_id: string | null
          status: string | null
          timestamp: string | null
        }
        Insert: {
          bot_id?: string | null
          event_type?: string | null
          location_sector?: number | null
          log_id?: number
          package_id?: string | null
          status?: string | null
          timestamp?: string | null
        }
        Update: {
          bot_id?: string | null
          event_type?: string | null
          location_sector?: number | null
          log_id?: number
          package_id?: string | null
          status?: string | null
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parcel_tracking_log_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "bots"
            referencedColumns: ["bot_id"]
          },
          {
            foreignKeyName: "parcel_tracking_log_location_sector_fkey"
            columns: ["location_sector"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["sector_id"]
          },
          {
            foreignKeyName: "parcel_tracking_log_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["package_id"]
          },
        ]
      }
      sector_connections: {
        Row: {
          connected_to_sector_id: number | null
          connection_id: number
          connection_type_id: number | null
          distance: number | null
          sector_id: number | null
        }
        Insert: {
          connected_to_sector_id?: number | null
          connection_id?: number
          connection_type_id?: number | null
          distance?: number | null
          sector_id?: number | null
        }
        Update: {
          connected_to_sector_id?: number | null
          connection_id?: number
          connection_type_id?: number | null
          distance?: number | null
          sector_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sector_connections_connected_to_sector_id_fkey"
            columns: ["connected_to_sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["sector_id"]
          },
          {
            foreignKeyName: "sector_connections_connection_type_id_fkey"
            columns: ["connection_type_id"]
            isOneToOne: false
            referencedRelation: "connection_types"
            referencedColumns: ["type_id"]
          },
          {
            foreignKeyName: "sector_connections_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["sector_id"]
          },
        ]
      }
      sector_types: {
        Row: {
          description: string | null
          type_id: number
          type_name: string
        }
        Insert: {
          description?: string | null
          type_id?: number
          type_name: string
        }
        Update: {
          description?: string | null
          type_id?: number
          type_name?: string
        }
        Relationships: []
      }
      sectors: {
        Row: {
          current_speed: number | null
          max_speed: number | null
          name: string | null
          sector_id: number
          sector_type_id: number | null
        }
        Insert: {
          current_speed?: number | null
          max_speed?: number | null
          name?: string | null
          sector_id: number
          sector_type_id?: number | null
        }
        Update: {
          current_speed?: number | null
          max_speed?: number | null
          name?: string | null
          sector_id?: number
          sector_type_id?: number | null
        }
        Relationships: []
      }
      switch_lookup_table: {
        Row: {
          destination_sector_id: number
          switch_id: string
          switch_position: string
        }
        Insert: {
          destination_sector_id: number
          switch_id: string
          switch_position: string
        }
        Update: {
          destination_sector_id?: number
          switch_id?: string
          switch_position?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_destination_sector"
            columns: ["destination_sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["sector_id"]
          },
          {
            foreignKeyName: "fk_switch"
            columns: ["switch_id"]
            isOneToOne: false
            referencedRelation: "switches"
            referencedColumns: ["switch_id"]
          },
        ]
      }
      switch_routes: {
        Row: {
          connection_id: number
          route_id: number
          switch_id: string
          switch_position: string
        }
        Insert: {
          connection_id: number
          route_id?: number
          switch_id: string
          switch_position: string
        }
        Update: {
          connection_id?: number
          route_id?: number
          switch_id?: string
          switch_position?: string
        }
        Relationships: [
          {
            foreignKeyName: "switch_routes_connection_id_fkey"
            columns: ["connection_id"]
            isOneToOne: false
            referencedRelation: "sector_connections"
            referencedColumns: ["connection_id"]
          },
          {
            foreignKeyName: "switch_routes_switch_id_fkey"
            columns: ["switch_id"]
            isOneToOne: false
            referencedRelation: "switches"
            referencedColumns: ["switch_id"]
          },
        ]
      }
      switches: {
        Row: {
          current_position: string | null
          required_position: string | null
          sector_id: number | null
          switch_id: string
        }
        Insert: {
          current_position?: string | null
          required_position?: string | null
          sector_id?: number | null
          switch_id: string
        }
        Update: {
          current_position?: string | null
          required_position?: string | null
          sector_id?: number | null
          switch_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "switches_sector_id_fkey"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "sectors"
            referencedColumns: ["sector_id"]
          },
        ]
      }
      system_config: {
        Row: {
          config_key: string
          config_value: string | null
          description: string | null
          updated_at: string | null
        }
        Insert: {
          config_key: string
          config_value?: string | null
          description?: string | null
          updated_at?: string | null
        }
        Update: {
          config_key?: string
          config_value?: string | null
          description?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
