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
      pcgsUsername: "20attpkz@gmail.com",
      pcgsPassword: "Stacy3272!",
      pcgsAuthToken: "sX6p6rwPjZXQZAu1K3RcSHvOwnZVfiRGpEasbFXuD634yXApO__DSyPPqg05q8vgImwg8WIkqjXPQYQCpu8R5hdo9bFSOLMt0Bsnd1-m96vEYTZw1Y1i0vFwZprmu1JGLhbfvu732Rgse3b3ym-KrC9Gr6ADYyo7BYk_301gQychv_encbzc9M9g4jThZI-Oqjvt6WdlWxTSa8REqyHzmp4KRwQLCIKAtO4DI00b_BIjCUu5_mh2xAs9ncd-NhMI8WCyXE1qGKmICRNydJUP5mbVahhHaE7YjnhYmaOMpH9mh_7V"
    }
  }
};
