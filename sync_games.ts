import { createClient } from '@supabase/supabase-js';
import { GAME_HISTORY } from './src/data.js';
import { ALL_GAMES } from './src/data/games.js';

const SUPABASE_URL = 'https://wfxmenunojwolgfnlqcs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmeG1lbnVub2p3b2xnZm5scWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NjMyNTUsImV4cCI6MjA5MTMzOTI1NX0.YmcAuyziw1kZiWcRTzxSjvOS-N0u14_jJLp2xlz13G0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function sync() {
  console.log("Upserting GAME_HISTORY and ALL_GAMES to Supabase...");
  
  // Sync the mini dashboard items
  const { error: err1 } = await supabase
    .from('portfolio_content')
    .upsert({ key: 'game_history', content: GAME_HISTORY }, { onConflict: 'key' });
    
  // Sync the entire 289 DB as an additional backup in supabase
  const { error: err2 } = await supabase
    .from('portfolio_content')
    .upsert({ key: 'all_games', content: ALL_GAMES }, { onConflict: 'key' });
    
  if (err1 || err2) {
    console.error("Error:", err1 || err2);
  } else {
    console.log("Success! Data synced to Supabase.");
  }
}

sync();
