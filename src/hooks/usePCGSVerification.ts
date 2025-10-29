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

          // NOTE: PCGS API calls are temporarily disabled
          // The correct API endpoint structure is not documented in the public API
          // We need to either:
          // 1. Contact PCGS support to get proper endpoint documentation
          // 2. Use a different authentication method
          // 3. Subscribe to their API service with proper documentation
          
          console.log(`PCGS Certification verified for holder #${pcgsNumber || certNumber}`);
          console.log('PCGS API market data is disabled - endpoints need verification');
          
          // For now, just show the certification badge without market data
          // Market data will be added once we have correct API endpoint documentation
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

