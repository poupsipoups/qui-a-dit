import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const supabase: SupabaseClient | null = url && publishableKey
  ? createClient(url, publishableKey, { auth: { storage: AsyncStorage, autoRefreshToken: false, persistSession: false, detectSessionInUrl: false } })
  : null;
