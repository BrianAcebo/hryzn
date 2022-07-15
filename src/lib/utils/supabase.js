import { createClient } from "@supabase/supabase-js";


// Connection to Supabase
const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY;


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
