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
      supabaseUrl: "https://rhwuncdxjlzmsgiprdkz.supabase.co",
      supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJod3VuY2R4amx6bXNnaXByZGt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxNDM4OTYsImV4cCI6MjA3MzcxOTg5Nn0.3jvar_teSXL2NtV7WEA3yQofFxLc_ZeewfpLyTBksAY",
      pcgsUsername: "rjhasnoemail@gmail.com",
      pcgsPassword: "Stacy3272!"
    }
  }
};
