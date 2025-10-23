# 🏆 FinestKnown - Precious Metals E-Commerce App

A modern, StockX-inspired mobile application for trading precious metals with real-time pricing, auctions, and e-commerce functionality.

## ✨ Features

### 🔥 Real-Time Pricing
- **Live metal prices** for Gold, Silver, Platinum, and Palladium
- **Smooth scrolling ticker** at the top of the app
- **Percentage change tracking** with accurate calculations
- **Auto-refresh** every 2 hours with persistent storage
- **Multiple API sources** for reliable data

### 🛒 E-Commerce
- **Product catalog** with categories and filtering
- **Shopping cart** with persistent storage
- **Checkout system** with order management
- **User accounts** and order history

### 🎯 Auctions
- **Live auction system** for precious metals
- **Real-time bidding** with notifications
- **Auction history** and tracking

### 🔐 Authentication
- **Modern sign-up/sign-in** with clean UI
- **SSO options** (Google, Apple, Facebook, Twitter)
- **Email/password** authentication
- **Onboarding flow** for new users

### 📱 Modern UI/UX
- **StockX-inspired design** with dark theme
- **Smooth animations** and transitions
- **Responsive layout** for all screen sizes
- **Design token system** for consistency

## 🚀 Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **Supabase** for backend and real-time features
- **React Query** for data fetching
- **AsyncStorage** for local persistence
- **Expo Router** for navigation

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Jonahjones/Finest-Known-2.git
   cd Finest-Known-2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Add your Supabase and API keys
   ```

4. **Start the development server:**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the database migrations from `docs/DATABASE_INTEGRATION.md`
3. Add your Supabase URL and anon key to `.env`

### API Keys
- **GoldAPI.io**: Add your API key for real-time metal prices
- **Other APIs**: Configure additional pricing sources as needed

## 📱 Screenshots

- **Live Prices Ticker**: Real-time metal prices with smooth scrolling
- **Authentication**: Modern sign-up/sign-in with SSO options
- **Product Catalog**: Browse precious metals with filtering
- **Shopping Cart**: Add items and proceed to checkout
- **Auctions**: Bid on live precious metal auctions

## 🏗️ Project Structure

```
finestknown-app/
├── app/                    # Expo Router pages
├── src/
│   ├── api/               # API functions and types
│   ├── components/        # Reusable UI components
│   ├── design/           # Design tokens and themes
│   ├── hooks/            # Custom React hooks
│   ├── providers/        # Context providers
│   └── store/            # State management
├── docs/                 # Documentation
└── upload-to-github.*    # Upload scripts
```

## 🚀 Quick Start

1. **Run the upload script:**
   ```bash
   # Windows
   upload-to-github.bat
   
   # PowerShell
   .\upload-to-github.ps1
   ```

2. **Follow the GitHub setup instructions** in the script output

3. **Your app will be uploaded** to GitHub automatically!

## 📄 Documentation

- [Database Integration](docs/DATABASE_INTEGRATION.md)
- [Environment Setup](docs/ENVIRONMENT_SETUP.md)
- [Hooks Update](docs/HOOKS_UPDATE.md)
- [Real-time Pricing Setup](REALTIME_PRICING_SETUP.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🎯 Roadmap

- [ ] Push notifications for price alerts
- [ ] Advanced charting and analytics
- [ ] Social features and user profiles
- [ ] Mobile app store deployment
- [ ] Web version with responsive design

---

**Built with ❤️ for precious metals enthusiasts**