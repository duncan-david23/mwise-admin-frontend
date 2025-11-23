import { createClient } from '@supabase/supabase-js'



const SUPABASE_URL = "https://zfcptwztpakuebtuangf.supabase.co"
const SUPABASE_ANON_KEY = "sb_publishable_lY6R9pfcEEy8K2_X9o_4Cg_PzW7ye1D"



export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)