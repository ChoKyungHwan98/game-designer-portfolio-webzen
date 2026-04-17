import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://wfxmenunojwolgfnlqcs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmeG1lbnVub2p3b2xnZm5scWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NjMyNTUsImV4cCI6MjA5MTMzOTI1NX0.YmcAuyziw1kZiWcRTzxSjvOS-N0u14_jJLp2xlz13G0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function pullAll() {
  console.log("Pulling data from Supabase...");
  const { data, error } = await supabase
    .from('portfolio_content')
    .select('key, content');

  if (error) {
    console.error("Error pulling data:", error.message);
    return;
  }

  const contentMap: any = {};
  data.forEach(item => {
    contentMap[item.key] = item.content;
  });

  fs.writeFileSync('supabase_dump.json', JSON.stringify(contentMap, null, 2));
  console.log("Dumped to supabase_dump.json");
}

pullAll();
