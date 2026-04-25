export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      artist_categories: {
        Row: {
          display_order: number
          id: string
          name: string
          slug: string
        }
        Insert: {
          display_order?: number
          id?: string
          name: string
          slug: string
        }
        Update: {
          display_order?: number
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      artist_details: {
        Row: {
          artist_id: string
          chiffre: string
          description: string
          id: string
          plateformes: string[]
          strategie: string
        }
        Insert: {
          artist_id: string
          chiffre?: string
          description?: string
          id?: string
          plateformes?: string[]
          strategie?: string
        }
        Update: {
          artist_id?: string
          chiffre?: string
          description?: string
          id?: string
          plateformes?: string[]
          strategie?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_details_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: true
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_images: {
        Row: {
          artist_id: string
          created_at: string
          display_order: number
          id: string
          url: string
        }
        Insert: {
          artist_id: string
          created_at?: string
          display_order?: number
          id?: string
          url: string
        }
        Update: {
          artist_id?: string
          created_at?: string
          display_order?: number
          id?: string
          url?: string
        }
        Relationships: []
      }
      artist_pillars: {
        Row: {
          accent_hue: number
          description: string
          display_order: number
          icon: string
          id: string
          left_title: string
          right_title: string
          statement: string
        }
        Insert: {
          accent_hue?: number
          description?: string
          display_order?: number
          icon?: string
          id?: string
          left_title?: string
          right_title?: string
          statement?: string
        }
        Update: {
          accent_hue?: number
          description?: string
          display_order?: number
          icon?: string
          id?: string
          left_title?: string
          right_title?: string
          statement?: string
        }
        Relationships: []
      }
      artists: {
        Row: {
          category_id: string
          display_order: number
          id: string
          image_url: string
          name: string
        }
        Insert: {
          category_id: string
          display_order?: number
          id?: string
          image_url: string
          name: string
        }
        Update: {
          category_id?: string
          display_order?: number
          id?: string
          image_url?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "artists_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "artist_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      case_metrics: {
        Row: {
          case_id: string
          display_order: number
          id: string
          label: string
          value: string
        }
        Insert: {
          case_id: string
          display_order?: number
          id?: string
          label: string
          value: string
        }
        Update: {
          case_id?: string
          display_order?: number
          id?: string
          label?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "case_metrics_case_id_fkey"
            columns: ["case_id"]
            isOneToOne: false
            referencedRelation: "portfolio_cases"
            referencedColumns: ["id"]
          },
        ]
      }
      client_categories: {
        Row: {
          display_order: number
          id: string
          name: string
        }
        Insert: {
          display_order?: number
          id?: string
          name: string
        }
        Update: {
          display_order?: number
          id?: string
          name?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          category_id: string
          display_order: number
          id: string
          logo_url: string
          name: string
        }
        Insert: {
          category_id: string
          display_order?: number
          id?: string
          logo_url?: string
          name: string
        }
        Update: {
          category_id?: string
          display_order?: number
          id?: string
          logo_url?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "client_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      clip_portugal_advantages: {
        Row: {
          description: string
          display_order: number
          icon: string
          id: string
          title: string
        }
        Insert: {
          description?: string
          display_order?: number
          icon?: string
          id?: string
          title: string
        }
        Update: {
          description?: string
          display_order?: number
          icon?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          service: string | null
          status: string
          type: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message?: string
          name: string
          phone?: string | null
          service?: string | null
          status?: string
          type: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          service?: string | null
          status?: string
          type?: string
        }
        Relationships: []
      }
      entreprise_sectors: {
        Row: {
          description: string
          display_order: number
          icon: string
          id: string
          image_url: string
          name: string
        }
        Insert: {
          description?: string
          display_order?: number
          icon?: string
          id?: string
          image_url?: string
          name: string
        }
        Update: {
          description?: string
          display_order?: number
          icon?: string
          id?: string
          image_url?: string
          name?: string
        }
        Relationships: []
      }
      expertise_artiste: {
        Row: {
          display_order: number
          id: string
          number: string
          text: string
          title: string
        }
        Insert: {
          display_order?: number
          id?: string
          number: string
          text?: string
          title: string
        }
        Update: {
          display_order?: number
          id?: string
          number?: string
          text?: string
          title?: string
        }
        Relationships: []
      }
      expertise_entreprise: {
        Row: {
          display_order: number
          id: string
          number: string
          text: string
          title: string
        }
        Insert: {
          display_order?: number
          id?: string
          number: string
          text?: string
          title: string
        }
        Update: {
          display_order?: number
          id?: string
          number?: string
          text?: string
          title?: string
        }
        Relationships: []
      }
      form_options: {
        Row: {
          display_order: number
          icon: string
          id: string
          label: string
          step_id: string
        }
        Insert: {
          display_order?: number
          icon?: string
          id?: string
          label: string
          step_id: string
        }
        Update: {
          display_order?: number
          icon?: string
          id?: string
          label?: string
          step_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_options_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "form_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      form_steps: {
        Row: {
          display_order: number
          hint: string | null
          id: string
          placeholder: string | null
          question: string
          title: string
          type: string
        }
        Insert: {
          display_order?: number
          hint?: string | null
          id?: string
          placeholder?: string | null
          question: string
          title: string
          type: string
        }
        Update: {
          display_order?: number
          hint?: string | null
          id?: string
          placeholder?: string | null
          question?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
      marquee_items: {
        Row: {
          display_order: number
          id: string
          image_url: string
          kind: string
          page: string
          text_value: string
        }
        Insert: {
          display_order?: number
          id?: string
          image_url?: string
          kind?: string
          page: string
          text_value?: string
        }
        Update: {
          display_order?: number
          id?: string
          image_url?: string
          kind?: string
          page?: string
          text_value?: string
        }
        Relationships: []
      }
      pack_features: {
        Row: {
          display_order: number
          id: string
          pack_id: string
          text: string
        }
        Insert: {
          display_order?: number
          id?: string
          pack_id: string
          text: string
        }
        Update: {
          display_order?: number
          id?: string
          pack_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "pack_features_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
        ]
      }
      pack_tooltips: {
        Row: {
          display_order: number
          feature_prefix: string
          id: string
          pack_id: string
          tooltip_text: string
        }
        Insert: {
          display_order?: number
          feature_prefix: string
          id?: string
          pack_id: string
          tooltip_text?: string
        }
        Update: {
          display_order?: number
          feature_prefix?: string
          id?: string
          pack_id?: string
          tooltip_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "pack_tooltips_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
        ]
      }
      packs: {
        Row: {
          badge: string
          bonus: string
          display_order: number
          featured: boolean
          id: string
          name: string
          number: string
          price: string
          price_suffix: string
          reassurance: string
          subtitle: string
        }
        Insert: {
          badge?: string
          bonus?: string
          display_order?: number
          featured?: boolean
          id?: string
          name: string
          number: string
          price: string
          price_suffix?: string
          reassurance?: string
          subtitle?: string
        }
        Update: {
          badge?: string
          bonus?: string
          display_order?: number
          featured?: boolean
          id?: string
          name?: string
          number?: string
          price?: string
          price_suffix?: string
          reassurance?: string
          subtitle?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          customer_email: string
          customer_name: string
          customer_phone: string | null
          environment: string
          id: string
          pack_id: string | null
          pack_name: string
          price_id: string | null
          status: string
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          customer_email: string
          customer_name: string
          customer_phone?: string | null
          environment?: string
          id?: string
          pack_id?: string | null
          pack_name: string
          price_id?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string | null
          environment?: string
          id?: string
          pack_id?: string | null
          pack_name?: string
          price_id?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      pillar_left_items: {
        Row: {
          display_order: number
          id: string
          pillar_id: string
          text: string
        }
        Insert: {
          display_order?: number
          id?: string
          pillar_id: string
          text: string
        }
        Update: {
          display_order?: number
          id?: string
          pillar_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "pillar_left_items_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "artist_pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      pillar_right_items: {
        Row: {
          display_order: number
          id: string
          pillar_id: string
          text: string
        }
        Insert: {
          display_order?: number
          id?: string
          pillar_id: string
          text: string
        }
        Update: {
          display_order?: number
          id?: string
          pillar_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "pillar_right_items_pillar_id_fkey"
            columns: ["pillar_id"]
            isOneToOne: false
            referencedRelation: "artist_pillars"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_cases: {
        Row: {
          description: string
          display_order: number
          icon: string
          id: string
          tag: string
          title: string
        }
        Insert: {
          description?: string
          display_order?: number
          icon?: string
          id?: string
          tag?: string
          title: string
        }
        Update: {
          description?: string
          display_order?: number
          icon?: string
          id?: string
          tag?: string
          title?: string
        }
        Relationships: []
      }
      process_artiste: {
        Row: {
          display_order: number
          id: string
          number: string
          text: string
          title: string
        }
        Insert: {
          display_order?: number
          id?: string
          number: string
          text?: string
          title: string
        }
        Update: {
          display_order?: number
          id?: string
          number?: string
          text?: string
          title?: string
        }
        Relationships: []
      }
      process_entreprise: {
        Row: {
          display_order: number
          id: string
          number: string
          text: string
          title: string
        }
        Insert: {
          display_order?: number
          id?: string
          number: string
          text?: string
          title: string
        }
        Update: {
          display_order?: number
          id?: string
          number?: string
          text?: string
          title?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          budget: string
          created_at: string
          deadline: string | null
          expectations: string[] | null
          id: string
          profile: string
          project_desc: string
          status: string
        }
        Insert: {
          budget?: string
          created_at?: string
          deadline?: string | null
          expectations?: string[] | null
          id?: string
          profile?: string
          project_desc?: string
          status?: string
        }
        Update: {
          budget?: string
          created_at?: string
          deadline?: string | null
          expectations?: string[] | null
          id?: string
          profile?: string
          project_desc?: string
          status?: string
        }
        Relationships: []
      }
      service_artiste_chips: {
        Row: {
          display_order: number
          id: string
          service_id: string
          text: string
        }
        Insert: {
          display_order?: number
          id?: string
          service_id: string
          text: string
        }
        Update: {
          display_order?: number
          id?: string
          service_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_artiste_chips_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_artiste"
            referencedColumns: ["id"]
          },
        ]
      }
      service_entreprise_chips: {
        Row: {
          display_order: number
          id: string
          service_id: string
          text: string
        }
        Insert: {
          display_order?: number
          id?: string
          service_id: string
          text: string
        }
        Update: {
          display_order?: number
          id?: string
          service_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_entreprise_chips_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services_entreprise"
            referencedColumns: ["id"]
          },
        ]
      }
      services_artiste: {
        Row: {
          description: string
          display_order: number
          id: string
          number: string
          title: string
        }
        Insert: {
          description?: string
          display_order?: number
          id?: string
          number: string
          title: string
        }
        Update: {
          description?: string
          display_order?: number
          id?: string
          number?: string
          title?: string
        }
        Relationships: []
      }
      services_entreprise: {
        Row: {
          description: string
          display_order: number
          id: string
          number: string
          title: string
        }
        Insert: {
          description?: string
          display_order?: number
          id?: string
          number: string
          title: string
        }
        Update: {
          description?: string
          display_order?: number
          id?: string
          number?: string
          title?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          type: string
          value: string
        }
        Insert: {
          key: string
          type?: string
          value: string
        }
        Update: {
          key?: string
          type?: string
          value?: string
        }
        Relationships: []
      }
      stats: {
        Row: {
          display_order: number
          id: string
          label: string
          page: string
          suffix: string
          value: string
        }
        Insert: {
          display_order?: number
          id?: string
          label: string
          page: string
          suffix?: string
          value: string
        }
        Update: {
          display_order?: number
          id?: string
          label?: string
          page?: string
          suffix?: string
          value?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          image_url: string | null
          initials: string
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          image_url?: string | null
          initials?: string
          name: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          image_url?: string | null
          initials?: string
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      theartist_features: {
        Row: {
          description: string
          display_order: number
          id: string
          title: string
        }
        Insert: {
          description?: string
          display_order?: number
          id?: string
          title: string
        }
        Update: {
          description?: string
          display_order?: number
          id?: string
          title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
