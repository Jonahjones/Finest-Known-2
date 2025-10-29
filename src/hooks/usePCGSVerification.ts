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

        if (result?.verified) {
          const pcgsNumber = result.pcgs_no;

          // Only fetch market data if we have a valid PCGS holder number (7-10 digits)
          if (pcgsNumber && pcgsNumber > 0) {
            try {
              console.log(`Fetching PCGS market data for holder #${pcgsNumber}, Grade: ${grade}`);
              
              const coinFacts = await getPCGSCoinFacts(pcgsNumber, grade);
              
              if (coinFacts) {
                console.log('Successfully fetched PCGS coin facts');
                
                // Fetch additional historical data in parallel
                const [priceHistory, populationHistory] = await Promise.all([
                  getPCGSPriceHistory(pcgsNumber, grade).catch(err => {
                    console.warn('Could not fetch price history:', err);
                    return [];
                  }),
                  getPCGSPopulationHistory(pcgsNumber, grade).catch(err => {
                    console.warn('Could not fetch population history:', err);
                    return [];
                  })
                ]);
                
                const fullCoinData: PCGSCoinFacts = {
                  ...coinFacts,
                  PriceHistory: priceHistory.length > 0 ? priceHistory : undefined,
                  PopulationHistory: populationHistory.length > 0 ? populationHistory : undefined,
                };
                
                setCoinData(fullCoinData);
                console.log('PCGS market data loaded successfully');
              } else {
                console.warn('PCGS API returned no data for this coin');
                // Don't set error - just no data available
              }
            } catch (dataError) {
              console.error('Error fetching PCGS data:', dataError);
              // Don't set error in state - just log it
            }
          } else {
            console.log('Product has custom certification - PCGS market data requires a valid holder number');
            // No error - just no market data available for custom certs
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to verify PCGS certification';
        setError(errorMessage);
        console.error('Error verifying PCGS:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVerification();
  }, [certNumber, grade]);

  return { verification, coinData, loading, error };
}

