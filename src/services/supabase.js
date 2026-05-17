import { createClient } from '@supabase/supabase-js';

// Эти данные мы будем брать из файла .env (чтобы не светить ключи в коде)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

