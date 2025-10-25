import { supabase } from './supabase';

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test 1: Check if we can reach the Supabase API
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Supabase auth error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Supabase connection successful:', data);
    
    // Test 2: Try a simple query to test the database connection
    const { data: testData, error: testError } = await supabase
      .from('test_table')
      .select('*')
      .limit(1);
    
    if (testError && testError.code !== 'PGRST116') { // PGRST116 is "relation does not exist" which is expected
      console.error('Supabase database error:', testError);
      return { success: false, error: testError.message };
    }
    
    console.log('Supabase database connection successful');
    return { success: true, data: testData };
    
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
}

export async function testSupabaseAuth() {
  try {
    console.log('Testing Supabase authentication...');
    
    // Test sign up with a test email
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'testpassword123';
    
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
    });
    
    if (error) {
      console.error('Supabase signup error:', error);
      return { success: false, error: error.message };
    }
    
    console.log('Supabase signup successful:', data);
    
    // Clean up - sign out the test user
    await supabase.auth.signOut();
    
    return { success: true, data };
    
  } catch (error) {
    console.error('Supabase auth test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    };
  }
}
