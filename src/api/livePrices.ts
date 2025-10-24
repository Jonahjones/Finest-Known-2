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

// Real-time metal prices from multiple APIs
async function fetchRealTimePrices(): Promise<LivePrice[]> {
  const prices: LivePrice[] = [];
  
  // Try MetalsAPI first (free tier available)
  try {
    console.log('Fetching prices from MetalsAPI...');
    const response = await fetch('https://api.metals.live/v1/spot', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'FinestKnown/1.0'
      },
      timeout: 10000
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('MetalsAPI Response:', data);
      
      // Map MetalsAPI response to our format
      const metalMappings = [
        { key: 'gold', metal: 'gold', id: '1' },
        { key: 'silver', metal: 'silver', id: '2' },
        { key: 'platinum', metal: 'platinum', id: '3' },
        { key: 'palladium', metal: 'palladium', id: '4' }
      ];
      
      for (const { key, metal, id } of metalMappings) {
        if (data[key] && data[key].price) {
          const previousPrice = previousPrices.find(p => p.metal === metal);
          let change = 0;
          let changePercent = 0;
          
          if (previousPrice) {
            change = data[key].price - previousPrice.price;
            changePercent = (change / previousPrice.price) * 100;
          } else if (data[key].change !== undefined) {
            change = data[key].change;
            changePercent = data[key].change_percent || 0;
          }
          
          prices.push({
            id,
            metal,
            price: data[key].price,
            change: change,
            changePercent: changePercent,
            lastUpdated: new Date().toISOString(),
          });
          
          console.log(`Successfully fetched ${metal} price: $${data[key].price} (${change >= 0 ? '+' : ''}${change.toFixed(2)} / ${changePercent.toFixed(2)}%)`);
        }
      }
    }
  } catch (error) {
    console.warn('MetalsAPI failed:', error);
  }
  
  // If MetalsAPI didn't work, try Alpha Vantage (free tier)
  if (prices.length === 0) {
    try {
      console.log('Trying Alpha Vantage API...');
      const apiKey = 'demo'; // Free demo key
      const symbols = ['XAU', 'XAG', 'XPT', 'XPD'];
      const metals = ['gold', 'silver', 'platinum', 'palladium'];
      
      for (let i = 0; i < symbols.length; i++) {
        try {
          const response = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbols[i]}&to_currency=USD&apikey=${apiKey}`, {
            method: 'GET',
            timeout: 10000
          });
          
          if (response.ok) {
            const data = await response.json();
            const rate = data['Realtime Currency Exchange Rate'];
            
            if (rate && rate['5. Exchange Rate']) {
              const price = parseFloat(rate['5. Exchange Rate']);
              const previousPrice = previousPrices.find(p => p.metal === metals[i]);
              let change = 0;
              let changePercent = 0;
              
              if (previousPrice) {
                change = price - previousPrice.price;
                changePercent = (change / previousPrice.price) * 100;
              }
              
              prices.push({
                id: (i + 1).toString(),
                metal: metals[i],
                price: price,
                change: change,
                changePercent: changePercent,
                lastUpdated: new Date().toISOString(),
              });
              
              console.log(`Successfully fetched ${metals[i]} price: $${price} (${change >= 0 ? '+' : ''}${change.toFixed(2)} / ${changePercent.toFixed(2)}%)`);
            }
          }
        } catch (error) {
          console.warn(`Error fetching ${metals[i]} from Alpha Vantage:`, error);
        }
      }
    } catch (error) {
      console.warn('Alpha Vantage failed:', error);
    }
  }
  
  if (prices.length === 0) {
    throw new Error('Could not fetch any metal prices from available APIs');
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
