import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://yetnqjzaukffckpdgmos.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlldG5xanphdWtmZmNrcGRnbW9zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwNzgxOTQsImV4cCI6MjEwMjY1NDE5NH0.mNKlTUJbYIkLXxUC5ruR5RB8i_M4Vr3L6fNdoFijwj0";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
