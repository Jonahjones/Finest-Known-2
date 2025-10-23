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

// Real-time metal prices from GoldAPI.io
async function fetchRealTimePrices(): Promise<LivePrice[]> {
  const metals = [
    { symbol: 'XAU', metal: 'gold', id: '1' },
    { symbol: 'XAG', metal: 'silver', id: '2' },
    { symbol: 'XPT', metal: 'platinum', id: '3' },
    { symbol: 'XPD', metal: 'palladium', id: '4' }
  ];

  const prices: LivePrice[] = [];
  const apiKey = 'goldapi-1kwlwsmh3rkk04-io';

  for (const { symbol, metal, id } of metals) {
    try {
      console.log(`Fetching ${metal} price from GoldAPI...`);
      
      const response = await fetch(`https://www.goldapi.io/api/${symbol}/USD`, {
        method: 'GET',
        headers: {
          'x-access-token': apiKey,
          'Content-Type': 'application/json',
          'User-Agent': 'FinestKnown/1.0'
        },
        timeout: 15000 // 15 second timeout
      });
      
      if (!response.ok) {
        console.warn(`GoldAPI returned ${response.status} for ${metal}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`${metal} API Response:`, data);
      
      if (data.price) {
        // Find previous price for this metal to calculate change
        const previousPrice = previousPrices.find(p => p.metal === metal);
        let change = 0;
        let changePercent = 0;
        
        if (previousPrice) {
          // Calculate change from our previous fetch
          change = data.price - previousPrice.price;
          changePercent = (change / previousPrice.price) * 100;
          console.log(`${metal} change calculation: $${previousPrice.price} -> $${data.price} = ${changePercent.toFixed(2)}%`);
        } else {
          // For first fetch or when no previous data, try to use API's change data
          // But also try to get a more recent reference point
          if (data.change !== undefined && data.change_percent !== undefined) {
            change = data.change;
            changePercent = data.change_percent;
            console.log(`${metal} using API change data: ${changePercent.toFixed(2)}%`);
          } else {
            // If no change data available, set to 0
            change = 0;
            changePercent = 0;
            console.log(`${metal} no change data available, setting to 0%`);
          }
        }
        
        prices.push({
          id,
          metal,
          price: data.price,
          change: change,
          changePercent: changePercent,
          lastUpdated: new Date().toISOString(),
        });
        console.log(`Successfully fetched ${metal} price: $${data.price} (${change >= 0 ? '+' : ''}${change.toFixed(2)} / ${changePercent.toFixed(2)}%)`);
      } else {
        console.warn(`No price data for ${metal}`);
      }
      
    } catch (error) {
      console.warn(`Error fetching ${metal} price:`, error);
      continue;
    }
  }
  
  if (prices.length === 0) {
    throw new Error('Could not fetch any metal prices from GoldAPI');
  }
  
  // Store current prices as previous prices for next calculation
  previousPrices = [...prices];
  
  // Save to storage for persistence across app restarts
  await savePreviousPrices(prices);
  
  console.log('Successfully fetched all metal prices:', prices);
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
      throw error; // Don't fallback to demo data
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
