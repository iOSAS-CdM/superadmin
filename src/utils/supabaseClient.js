import { createClient } from '@supabase/supabase-js';

const supabaseProjectUrl = import.meta.env.VITE_SUPABASE_PROJECT_URL;
const supabaseAPIKey = import.meta.env.VITE_SUPABASE_API_KEY;

const supabase = createClient(
	supabaseProjectUrl,
	supabaseAPIKey,
	{
		auth: {
			storageKey: 'supabase.auth.token',
			storage: window.localStorage,
			detectSessionInUrl: true,
			autoRefreshToken: true,
			flowType: 'pkce'
		}
	}
);

export default supabase;
