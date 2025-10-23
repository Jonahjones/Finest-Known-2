export default {
  expo: {
    name: "finestknown-app",
    slug: "finestknown-app",
    version: "1.0.0",
    orientation: "portrait",
    userInterfaceStyle: "automatic",
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.finestknown.app"
    },
    android: {
      package: "com.finestknown.app"
    },
    web: {
      output: "static"
    },
    plugins: [
      "expo-router"
    ],
    extra: {
      supabaseUrl: "https://oghzxwjqhsmbqfuovqju.supabase.co",
      supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9naHp4d2pxaHNtYnFmdW92cWp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5MTc3MjAsImV4cCI6MjA1MjQ5MzcyMH0.1YHhWdXHWcx5Zb6qkxjBYTW_CJdvbzpI_DYoGmZYNgM"
    }
  }
};
