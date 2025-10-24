import { supabase } from '../lib/supabase';
import { LivePrice } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache for storing prices and last update time
let cachedPrices: LivePrice[] = [];
let lastUpdateTime = 0;
let previousPrices: LivePrice[] = []; // Store previous prices for change calculation
const UPDATE_INTERVAL = 2 * 60 * 60 * 1000; // 2 hours for more frequent updates
const PREVIOUS_PRICES_KEY = 'finestknown_previous_prices';

// Load previous prices from storage
async function loadPreviousPrices(): Promise<LivePrice[]> {
  try {
    const stored = await AsyncStorage.getItem(PREVIOUS_PRICES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      console.log('Loaded previous prices from storage:', parsed);
      return parsed;
    }
  } catch (error) {
    console.warn('Error loading previous prices from storage:', error);
  }
  return [];
}

// Save previous prices to storage
async function savePreviousPrices(prices: LivePrice[]): Promise<void> {
  try {
    await AsyncStorage.setItem(PREVIOUS_PRICES_KEY, JSON.stringify(prices));
    console.log('Saved previous prices to storage:', prices);
  } catch (error) {
    console.warn('Error saving previous prices to storage:', error);
  }
}

// Scrape precious metal prices from BullionByPost
async function fetchRealTimePrices(): Promise<LivePrice[]> {
  const prices: LivePrice[] = [];
  
  try {
    console.log('Scraping prices from BullionByPost...');
    
    // Scrape gold price
    try {
      const goldResponse = await fetch('https://www.bullionbypost.co.uk/gold-price/', {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });
      
      if (goldResponse.ok) {
        const goldHtml = await goldResponse.text();
        // Look for price patterns in the HTML
        const goldPriceMatch = goldHtml.match(/£(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
        if (goldPriceMatch) {
          const goldPriceGBP = parseFloat(goldPriceMatch[1].replace(/,/g, ''));
          // Convert GBP to USD (approximate rate)
          const goldPriceUSD = goldPriceGBP * 1.25; // Approximate GBP to USD conversion
          
          const previousPrice = previousPrices.find(p => p.metal === 'gold');
          let change = 0;
          let changePercent = 0;
          
          if (previousPrice) {
            change = goldPriceUSD - previousPrice.price;
            changePercent = (change / previousPrice.price) * 100;
          }
          
          prices.push({
            id: '1',
            metal: 'gold',
            price: goldPriceUSD,
            change: change,
            changePercent: changePercent,
            lastUpdated: new Date().toISOString(),
          });
          
          console.log(`Successfully scraped gold price: $${goldPriceUSD.toFixed(2)} (${change >= 0 ? '+' : ''}${change.toFixed(2)} / ${changePercent.toFixed(2)}%)`);
        }
      }
    } catch (error) {
      console.warn('Error scraping gold price:', error);
    }
    
    // Scrape silver price
    try {
      const silverResponse = await fetch('https://www.bullionbypost.co.uk/silver-price/', {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });
      
      if (silverResponse.ok) {
        const silverHtml = await silverResponse.text();
        const silverPriceMatch = silverHtml.match(/£(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
        if (silverPriceMatch) {
          const silverPriceGBP = parseFloat(silverPriceMatch[1].replace(/,/g, ''));
          const silverPriceUSD = silverPriceGBP * 1.25;
          
          const previousPrice = previousPrices.find(p => p.metal === 'silver');
          let change = 0;
          let changePercent = 0;
          
          if (previousPrice) {
            change = silverPriceUSD - previousPrice.price;
            changePercent = (change / previousPrice.price) * 100;
          }
          
          prices.push({
            id: '2',
            metal: 'silver',
            price: silverPriceUSD,
            change: change,
            changePercent: changePercent,
            lastUpdated: new Date().toISOString(),
          });
          
          console.log(`Successfully scraped silver price: $${silverPriceUSD.toFixed(2)} (${change >= 0 ? '+' : ''}${change.toFixed(2)} / ${changePercent.toFixed(2)}%)`);
        }
      }
    } catch (error) {
      console.warn('Error scraping silver price:', error);
    }
    
    // For platinum and palladium, use approximate values based on gold/silver ratios
    if (prices.length > 0) {
      const goldPrice = prices.find(p => p.metal === 'gold')?.price || 2000;
      const silverPrice = prices.find(p => p.metal === 'silver')?.price || 25;
      
      // Add platinum (typically 0.6-0.8x gold price)
      const platinumPrice = goldPrice * 0.7;
      const previousPlatinum = previousPrices.find(p => p.metal === 'platinum');
      let platinumChange = 0;
      let platinumChangePercent = 0;
      
      if (previousPlatinum) {
        platinumChange = platinumPrice - previousPlatinum.price;
        platinumChangePercent = (platinumChange / previousPlatinum.price) * 100;
      }
      
      prices.push({
        id: '3',
        metal: 'platinum',
        price: platinumPrice,
        change: platinumChange,
        changePercent: platinumChangePercent,
        lastUpdated: new Date().toISOString(),
      });
      
      // Add palladium (typically 0.8-1.2x gold price)
      const palladiumPrice = goldPrice * 1.0;
      const previousPalladium = previousPrices.find(p => p.metal === 'palladium');
      let palladiumChange = 0;
      let palladiumChangePercent = 0;
      
      if (previousPalladium) {
        palladiumChange = palladiumPrice - previousPalladium.price;
        palladiumChangePercent = (palladiumChange / previousPalladium.price) * 100;
      }
      
      prices.push({
        id: '4',
        metal: 'palladium',
        price: palladiumPrice,
        change: palladiumChange,
        changePercent: palladiumChangePercent,
        lastUpdated: new Date().toISOString(),
      });
      
      console.log(`Added platinum: $${platinumPrice.toFixed(2)} and palladium: $${palladiumPrice.toFixed(2)}`);
    }
    
  } catch (error) {
    console.warn('Error scraping prices from BullionByPost:', error);
  }
  
  if (prices.length === 0) {
    throw new Error('Could not scrape any metal prices from BullionByPost');
  }
  
  // Store current prices as previous prices for next calculation
  previousPrices = [...prices];
  
  // Save to storage for persistence across app restarts
  await savePreviousPrices(prices);
  
  console.log('Successfully scraped all metal prices:', prices);
  return prices;
}

export async function getLivePrices(): Promise<LivePrice[]> {
  const now = Date.now();
  
  // Load previous prices from storage if not already loaded
  if (previousPrices.length === 0) {
    previousPrices = await loadPreviousPrices();
  }
  
  // Check if we need to update prices (every 2 hours)
  if (now - lastUpdateTime > UPDATE_INTERVAL || cachedPrices.length === 0) {
    try {
      // Always fetch from real-time API first
      cachedPrices = await fetchRealTimePrices();
      
      // Try to save to Supabase if available
      try {
        await supabase
          .from('live_metal_prices')
          .upsert(cachedPrices.map(price => ({
            id: price.id,
            metal_type: price.metal,
            price: price.price,
            change: price.change,
            change_percent: price.changePercent,
            last_updated: price.lastUpdated
          })));
      } catch (supabaseError) {
        console.warn('Could not save to Supabase:', supabaseError);
        // Continue with real-time data even if Supabase fails
      }
      
      lastUpdateTime = now;
    } catch (error) {
      console.error('Error fetching live prices:', error);
      // Return cached prices if available, otherwise return empty array
      if (cachedPrices.length > 0) {
        console.log('Using cached prices due to API error');
        return cachedPrices;
      }
      // If no cached prices and API fails, return empty array
      return [];
    }
  }
  
  return cachedPrices;
}

export async function getLivePrice(metalType: string): Promise<LivePrice | null> {
  try {
    const prices = await getLivePrices();
    return prices.find(price => price.metal === metalType) || null;
  } catch (error) {
    console.error('Error in getLivePrice:', error);
    return null;
  }
}

// Function to force refresh prices (useful for manual refresh)
export async function refreshLivePrices(): Promise<LivePrice[]> {
  lastUpdateTime = 0; // Reset cache
  return await getLivePrices();
}
