import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// This script can be used to push data from a local JSON file to Supabase.
// Usage: ts-node scratch/push_supabase.ts <file.json>

const SUPABASE_URL = 'https://wfxmenunojwolgfnlqcs.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmeG1lbnVub2p3b2xnZm5scWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NjMyNTUsImV4cCI6MjA5MTMzOTI1NX0.YmcAuyziw1kZiWcRTzxSjvOS-N0u14_jJLp2xlz13G0';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function pushAll() {
  const file = process.argv[2];
  if (!file) {
    console.error("Please provide a JSON file containing the content map.");
    process.exit(1);
  }

  const contentMap = JSON.parse(fs.readFileSync(file, 'utf8'));
  console.log(`Pushing data from ${file} to Supabase...`);

  for (const [key, content] of Object.entries(contentMap)) {
    const { error } = await supabase
      .from('portfolio_content')
      .upsert({ key, content });

    if (error) {
      console.error(`Error pushing key ${key}:`, error.message);
    } else {
      console.log(`Successfully pushed key: ${key}`);
    }
  }
  console.log("Push complete.");
}

pushAll();
