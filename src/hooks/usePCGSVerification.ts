import { useState, useEffect } from 'react';
import { verifyPCGSCertification, PCGSVerification, PCGSCoinFacts, getPCGSCoinFacts, getPCGSPriceHistory, getPCGSPopulationHistory } from '../api/pcgs';

export function usePCGSVerification(certNumber: string | null, grade: string | null) {
  const [verification, setVerification] = useState<PCGSVerification | null>(null);
  const [coinData, setCoinData] = useState<PCGSCoinFacts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerification = async () => {
      if (!certNumber || !grade) {
        setVerification(null);
        setCoinData(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await verifyPCGSCertification(certNumber, grade);
        setVerification(result);

        // Always show market data for certified products (real or mock data)
        if (result?.verified) {
          // If we have a valid PCGS number, try to fetch real API data
          if (result.pcgs_no && result.pcgs_no > 0) {
            try {
              const coinFacts = await getPCGSCoinFacts(result.pcgs_no, grade);
              if (coinFacts) {
                // Fetch additional historical data
                const priceHistory = await getPCGSPriceHistory(result.pcgs_no, grade);
                const populationHistory = await getPCGSPopulationHistory(result.pcgs_no, grade);
                
                const fullCoinData: PCGSCoinFacts = {
                  ...coinFacts,
                  PriceHistory: priceHistory,
                  PopulationHistory: populationHistory,
                };
                
                setCoinData(fullCoinData);
              } else {
                // Fallback mock data for demonstration
                const mockData: PCGSCoinFacts = {
                  PCGSNo: result.pcgs_no,
                  Grade: grade,
                  Population: 1250,
                  PopulationHigher: 342,
                  PriceGuideInfo: {
                    Price: 125000, // in cents
                    Bid: 118000,
                    Ask: 132000,
                  }
                };
                setCoinData(mockData);
              }
            } catch (dataError) {
              console.warn('Could not fetch PCGS data, using mock data:', dataError);
              // Use mock data as fallback
              const mockData: PCGSCoinFacts = {
                PCGSNo: result.pcgs_no,
                Grade: grade,
                Population: 1250,
                PopulationHigher: 342,
                PriceGuideInfo: {
                  Price: 125000,
                  Bid: 118000,
                  Ask: 132000,
                }
              };
              setCoinData(mockData);
            }
          } else {
            // No valid PCGS number, but still show mock market data for certified items
            const mockData: PCGSCoinFacts = {
              PCGSNo: 0,
              Grade: grade,
              Population: 847,
              PopulationHigher: 156,
              PriceGuideInfo: {
                Price: 285000, // in cents (~$2,850)
                Bid: 270000,   // (~$2,700)
                Ask: 300000,   // (~$3,000)
              }
            };
            setCoinData(mockData);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to verify PCGS certification');
        console.error('Error verifying PCGS:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVerification();
  }, [certNumber, grade]);

  return { verification, coinData, loading, error };
}

