import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qkkscxaenwgqrcpdqeyb.supabase.co';
const supabaseKey = 'sb_publishable_penIy49dFFsqPvQV-elKzg_IrSYIfTH';

export const supabase = createClient(supabaseUrl, supabaseKey);