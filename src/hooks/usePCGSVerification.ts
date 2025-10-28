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

        // Fetch comprehensive PCGS coin data from real API
        if (result?.pcgs_no && result.pcgs_no > 0) {
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
            }
          } catch (dataError) {
            console.warn('Could not fetch PCGS data:', dataError);
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

