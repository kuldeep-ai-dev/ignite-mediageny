import { createClient } from '@supabase/supabase-js';
const url = 'https://ekzdnfrhyuvjvtvylxqb.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVremRuZnJoeXV2anZ0dnlseHFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1OTE5NzUsImV4cCI6MjA5ODE2Nzk3NX0.Jj4suzhu_hxBKbB7uA7t-mIrdKZNwNrr_TcS24jrI7g';
const supabase = createClient(url, key);

async function run() {
    const { data, error } = await supabase.from('batches').select('*').limit(1);
    if (data && data.length > 0) {
        console.log(Object.keys(data[0]));
    } else {
        console.log(error);
    }
}
run();
