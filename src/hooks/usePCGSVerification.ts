import { useState, useEffect } from 'react';
import { verifyPCGSCertification, PCGSVerification, PCGSCoinFacts, getPCGSCoinFacts, getPCGSPriceHistory, getPCGSPopulationHistory, searchPCGSDatabase } from '../api/pcgs';

export function usePCGSVerification(certNumber: string | null, grade: string | null, productTitle?: string, productYear?: number) {
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
          let pcgsNumber = result.pcgs_no;

          // If we don't have a valid PCGS number, try to find it by searching
          if (!pcgsNumber || pcgsNumber === 0) {
            if (productTitle) {
              console.log(`Searching PCGS database for: ${productTitle} ${productYear || ''}`);
              try {
                const searchQuery = productYear ? `${productTitle} ${productYear}` : productTitle;
                const searchResults = await searchPCGSDatabase(searchQuery);
                
                if (searchResults && searchResults.length > 0) {
                  // Use the first match
                  pcgsNumber = searchResults[0].PCGSNo || searchResults[0].pcgs_no;
                  console.log(`Found PCGS number from search: ${pcgsNumber}`);
                }
              } catch (searchError) {
                console.warn('Could not search PCGS database:', searchError);
              }
            }
          }

          // Fetch real PCGS market data
          if (pcgsNumber && pcgsNumber > 0) {
            try {
              console.log(`Fetching PCGS data for PCGS#${pcgsNumber}, Grade: ${grade}`);
              
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
                console.warn('PCGS API returned no data');
                setError('Unable to fetch PCGS market data');
              }
            } catch (dataError) {
              console.error('Error fetching PCGS data:', dataError);
              setError('Failed to fetch PCGS market data');
            }
          } else {
            console.warn('No valid PCGS number available for market data lookup');
            setError('PCGS number not available for this product');
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
  }, [certNumber, grade, productTitle, productYear]);

  return { verification, coinData, loading, error };
}

