import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://fpvxoxuprqiodinuqcvj.supabase.co';
const supabaseKey = 'sb_publishable_piCl7eIUYvXe529bvFwNPw_tx5y_Sl7';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };