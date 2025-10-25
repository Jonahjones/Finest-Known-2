import { supabase } from './supabase';

export async function debugSupabaseConnection() {
  console.log('=== Supabase Debug Test ===');
  
  // Test 1: Check if we can reach the Supabase API endpoint
  try {
    console.log('1. Testing basic API reachability...');
    const response = await fetch('https://rhwuncdxjlzmsgiprdkz.supabase.co/rest/v1/', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod3VuY2R4amx6bXNnaXByZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDM4OTYsImV4cCI6MjA3MzcxOTg5Nn0.3jvar_teSXL2NtV7WEA3yQofFxLc_ZeewfpLyTBksAY',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod3VuY2R4amx6bXNnaXByZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDM4OTYsImV4cCI6MjA3MzcxOTg5Nn0.3jvar_teSXL2NtV7WEA3yQofFxLc_ZeewfpLyTBksAY'
      }
    });
    
    console.log('API Response status:', response.status);
    console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      console.log('✅ Supabase API is reachable');
    } else {
      console.log('❌ Supabase API returned error:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('❌ Failed to reach Supabase API:', error);
  }

  // Test 2: Check auth endpoint
  try {
    console.log('2. Testing auth endpoint...');
    const authResponse = await fetch('https://rhwuncdxjlzmsgiprdkz.supabase.co/auth/v1/settings', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod3VuY2R4amx6bXNnaXByZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDM4OTYsImV4cCI6MjA3MzcxOTg5Nn0.3jvar_teSXL2NtV7WEA3yQofFxLc_ZeewfpLyTBksAY'
      }
    });
    
    console.log('Auth Response status:', authResponse.status);
    
    if (authResponse.ok) {
      const authData = await authResponse.json();
      console.log('✅ Auth endpoint accessible:', authData);
    } else {
      console.log('❌ Auth endpoint error:', authResponse.status, authResponse.statusText);
    }
  } catch (error) {
    console.error('❌ Failed to reach auth endpoint:', error);
  }

  // Test 3: Test Supabase client
  try {
    console.log('3. Testing Supabase client...');
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase client error:', error);
    } else {
      console.log('✅ Supabase client working:', data);
    }
  } catch (error) {
    console.error('❌ Supabase client failed:', error);
  }

  // Test 4: Test signup
  try {
    console.log('4. Testing signup...');
    const testEmail = `debug-test-${Date.now()}@example.com`;
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: 'testpassword123'
    });
    
    if (error) {
      console.error('❌ Signup error:', error);
    } else {
      console.log('✅ Signup successful:', data);
    }
  } catch (error) {
    console.error('❌ Signup failed:', error);
  }

  console.log('=== Debug Test Complete ===');
}
