# FinestKnown App

A StockX-inspired precious metals e-commerce mobile application built with React Native, Expo, and Supabase.

## 🚀 Features

- **StockX-inspired UI/UX** with black, white, and green (#00D4AA) color scheme
- **Real-time live pricing** for precious metals (gold, silver, platinum, palladium)
- **E-commerce functionality** with cart, checkout, and orders
- **Auction system** for rare items with bidding
- **Content management** for articles and educational resources
- **Authentication** and user management
- **Responsive design** for mobile and tablet

## 🛠️ Tech Stack

- **Framework**: React Native with Expo Router
- **Backend**: Supabase (PostgreSQL)
- **State Management**: React Query + Context API
- **Styling**: Design tokens system
- **Navigation**: Expo Router with tab navigation
- **Real-time**: Supabase real-time subscriptions

## 📱 Screens

- **Home**: Live prices ticker, featured products, category grid
- **Catalog**: Product browsing with search and filters
- **Auctions**: Live auction listings with bidding
- **Cart**: Shopping cart management
- **Learn**: Educational articles and resources

## 🎨 Design System

The app uses a comprehensive design token system with:
- **Colors**: Primary black, accent green, status colors, metal-specific colors
- **Typography**: Display, title, heading, body, caption scales
- **Spacing**: Consistent spacing scale from xs to 6xl
- **Components**: Reusable Button, Card, ProductCard components

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finestknown-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web
   npm run web
   ```

## 🗄️ Database Setup

The app requires a Supabase database with the following tables:

- `profiles` - User profiles
- `categories` - Product categories
- `products` - Precious metals products
- `carts` - User shopping carts
- `cart_items` - Items in carts
- `orders` - Customer orders
- `order_items` - Items in orders
- `auctions` - Auction listings
- `auction_bids` - Auction bids
- `live_metal_prices` - Real-time metal prices
- `articles` - Blog/resource articles

See `PROJECT_DOCUMENTATION.md` for detailed schema definitions.

## 📁 Project Structure

```
finestknown-app/
├── app/                          # Expo Router pages
│   ├── _layout.tsx              # Root layout
│   ├── (tabs)/                  # Tab navigation
│   │   ├── index.tsx           # Home screen
│   │   ├── catalog.tsx         # Catalog screen
│   │   ├── auctions.tsx        # Auctions screen
│   │   ├── cart.tsx            # Cart screen
│   │   └── learn.tsx           # Learn screen
│   ├── modal.tsx               # Modal screen
│   ├── checkout.tsx            # Checkout screen
│   └── test.tsx                # Test screen
├── src/                         # Source code
│   ├── api/                    # API functions
│   ├── components/             # Reusable components
│   ├── design/                 # Design system
│   ├── hooks/                  # Custom hooks
│   ├── lib/                    # Utilities
│   ├── providers/              # Context providers
│   └── store/                  # State management
├── components/                  # Root components
├── hooks/                      # Root hooks
└── assets/                     # Static assets
```

## 🔧 Development

### Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run on web browser
- `npm run lint` - Run ESLint

### Code Style

The project uses:
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Design tokens for consistent styling

## 🧪 Testing

The app includes a test screen (`/test`) that demonstrates all UI components and design tokens. Access it through the app navigation or by navigating to `/test` in the development server.

## 📦 Build & Deployment

### Development Build

```bash
expo start
```

### Production Build

```bash
# Android
expo build:android

# iOS
expo build:ios

# Web
expo export:web
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

Built with ❤️ using React Native, Expo, and Supabase.
