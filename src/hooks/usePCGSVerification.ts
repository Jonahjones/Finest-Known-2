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
          // PCGS API market data is disabled
          // Authentication works, but the correct API endpoint paths are not publicly documented
          // The endpoints we tried (/certverification/SearchByCertNumber) return 404
          // 
          // To enable market data, you would need to:
          // 1. Contact PCGS support directly for their API documentation
          // 2. Request the correct endpoint paths for:
          //    - Looking up coins by holder/cert number
          //    - Getting population data
          //    - Getting price guide data
          //
          // For now, the app shows PCGS certification badges correctly
          console.log(`PCGS Certification verified for holder #${result.pcgs_no || certNumber}`);
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

