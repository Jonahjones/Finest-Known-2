import { Alert } from 'react-native';

export async function runNetworkDiagnostic() {
  console.log('=== Network Diagnostic Test ===');
  
  const results = {
    basicInternet: false,
    googleDNS: false,
    cloudflareDNS: false,
    supabaseAPI: false,
    supabaseAuth: false,
    fetchAvailable: false,
    xmlHttpRequest: false,
    errors: [] as string[]
  };

  // Test 1: Check if fetch is available
  try {
    console.log('1. Testing fetch availability...');
    if (typeof fetch !== 'undefined') {
      results.fetchAvailable = true;
      console.log('✅ Fetch is available');
    } else {
      results.errors.push('Fetch is not available');
      console.log('❌ Fetch is not available');
    }
  } catch (error) {
    results.errors.push(`Fetch test failed: ${error}`);
    console.error('❌ Fetch test failed:', error);
  }

  // Test 2: Basic internet connectivity - Google
  try {
    console.log('2. Testing basic internet connectivity (Google)...');
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-cache'
    });
    results.basicInternet = true;
    console.log('✅ Basic internet connectivity works');
  } catch (error) {
    results.errors.push(`Basic internet failed: ${error}`);
    console.error('❌ Basic internet connectivity failed:', error);
  }

  // Test 3: DNS resolution - Google DNS
  try {
    console.log('3. Testing DNS resolution (Google DNS)...');
    const response = await fetch('https://8.8.8.8', {
      method: 'HEAD',
      mode: 'no-cors'
    });
    results.googleDNS = true;
    console.log('✅ Google DNS reachable');
  } catch (error) {
    results.errors.push(`Google DNS failed: ${error}`);
    console.error('❌ Google DNS failed:', error);
  }

  // Test 4: DNS resolution - Cloudflare DNS
  try {
    console.log('4. Testing DNS resolution (Cloudflare DNS)...');
    const response = await fetch('https://1.1.1.1', {
      method: 'HEAD',
      mode: 'no-cors'
    });
    results.cloudflareDNS = true;
    console.log('✅ Cloudflare DNS reachable');
  } catch (error) {
    results.errors.push(`Cloudflare DNS failed: ${error}`);
    console.error('❌ Cloudflare DNS failed:', error);
  }

  // Test 5: Supabase API endpoint
  try {
    console.log('5. Testing Supabase API endpoint...');
    const response = await fetch('https://rhwuncdxjlzmsgiprdkz.supabase.co/rest/v1/', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod3VuY2R4amx6bXNnaXByZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDM4OTYsImV4cCI6MjA3MzcxOTg5Nn0.3jvar_teSXL2NtV7WEA3yQofFxLc_ZeewfpLyTBksAY'
      }
    });
    
    if (response.ok) {
      results.supabaseAPI = true;
      console.log('✅ Supabase API reachable');
    } else {
      results.errors.push(`Supabase API returned ${response.status}: ${response.statusText}`);
      console.log(`❌ Supabase API returned ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    results.errors.push(`Supabase API failed: ${error}`);
    console.error('❌ Supabase API failed:', error);
  }

  // Test 6: Supabase Auth endpoint
  try {
    console.log('6. Testing Supabase Auth endpoint...');
    const response = await fetch('https://rhwuncdxjlzmsgiprdkz.supabase.co/auth/v1/settings', {
      method: 'GET',
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod3VuY2R4amx6bXNnaXByZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDM4OTYsImV4cCI6MjA3MzcxOTg5Nn0.3jvar_teSXL2NtV7WEA3yQofFxLc_ZeewfpLyTBksAY'
      }
    });
    
    if (response.ok) {
      results.supabaseAuth = true;
      console.log('✅ Supabase Auth reachable');
    } else {
      results.errors.push(`Supabase Auth returned ${response.status}: ${response.statusText}`);
      console.log(`❌ Supabase Auth returned ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    results.errors.push(`Supabase Auth failed: ${error}`);
    console.error('❌ Supabase Auth failed:', error);
  }

  // Test 7: XMLHttpRequest (alternative to fetch)
  try {
    console.log('7. Testing XMLHttpRequest...');
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.google.com', true);
    xhr.timeout = 5000;
    
    await new Promise((resolve, reject) => {
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          results.xmlHttpRequest = true;
          console.log('✅ XMLHttpRequest works');
          resolve(true);
        } else {
          reject(new Error(`XHR failed with status ${xhr.status}`));
        }
      };
      xhr.onerror = () => reject(new Error('XHR network error'));
      xhr.ontimeout = () => reject(new Error('XHR timeout'));
      xhr.send();
    });
  } catch (error) {
    results.errors.push(`XMLHttpRequest failed: ${error}`);
    console.error('❌ XMLHttpRequest failed:', error);
  }

  // Generate diagnostic report
  const successCount = Object.values(results).filter(v => v === true).length;
  const totalTests = 7;
  
  console.log('=== Network Diagnostic Results ===');
  console.log(`Success: ${successCount}/${totalTests} tests passed`);
  console.log('Errors:', results.errors);
  
  // Show results to user
  let message = `Network Diagnostic Results:\n\n`;
  message += `✅ Basic Internet: ${results.basicInternet ? 'Working' : 'Failed'}\n`;
  message += `✅ Google DNS: ${results.googleDNS ? 'Working' : 'Failed'}\n`;
  message += `✅ Cloudflare DNS: ${results.cloudflareDNS ? 'Working' : 'Failed'}\n`;
  message += `✅ Supabase API: ${results.supabaseAPI ? 'Working' : 'Failed'}\n`;
  message += `✅ Supabase Auth: ${results.supabaseAuth ? 'Working' : 'Failed'}\n`;
  message += `✅ Fetch Available: ${results.fetchAvailable ? 'Yes' : 'No'}\n`;
  message += `✅ XMLHttpRequest: ${results.xmlHttpRequest ? 'Working' : 'Failed'}\n\n`;
  
  if (results.errors.length > 0) {
    message += `Errors:\n${results.errors.slice(0, 3).join('\n')}`;
    if (results.errors.length > 3) {
      message += `\n... and ${results.errors.length - 3} more errors`;
    }
  }
  
  Alert.alert('Network Diagnostic', message);
  
  return results;
}

export async function testBasicConnectivity() {
  try {
    console.log('Testing basic connectivity...');
    
    // Test with a simple, reliable endpoint
    const response = await fetch('https://httpbin.org/get', {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Basic connectivity test passed:', data);
      return { success: true, data };
    } else {
      console.log('❌ Basic connectivity test failed:', response.status);
      return { success: false, error: `HTTP ${response.status}` };
    }
  } catch (error) {
    console.error('❌ Basic connectivity test error:', error);
    return { success: false, error: error.message };
  }
}
