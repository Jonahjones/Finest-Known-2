const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying FinestKnown installation...\n');

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('✅ node_modules directory exists');
} else {
  console.log('❌ node_modules directory not found');
  process.exit(1);
}

// Check if zustand is installed
const zustandPath = path.join(nodeModulesPath, 'zustand');
if (fs.existsSync(zustandPath)) {
  console.log('✅ zustand is installed');
} else {
  console.log('❌ zustand is NOT installed');
}

// Check if package.json has zustand
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson.dependencies && packageJson.dependencies.zustand) {
    console.log('✅ zustand is in package.json dependencies');
  } else {
    console.log('❌ zustand is NOT in package.json dependencies');
  }
}

// Check if key files exist
const keyFiles = [
  'src/store/onboardingStore.ts',
  'src/hooks/useGuestSession.ts',
  'src/components/onboarding/OnboardingFlow.tsx',
  'src/components/PersonalizedGallery.tsx',
  'src/components/ConversionModal.tsx',
  'src/components/AppFlow.tsx',
  'supabase-schema.sql'
];

console.log('\n📁 Checking key files:');
keyFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log('\n🚀 Installation verification complete!');
console.log('\nTo start the app, run: npm start');

