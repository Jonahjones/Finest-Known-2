import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { useTheme } from '../../src/theme/ThemeProvider';
import { colors, spacing, typography } from '../../src/design/tokens';
import { supabase } from '../../src/lib/supabase';

// Real auction data from database

export default function AuctionsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'live' | 'ending'>('all');
  const [auctions, setAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLuxeTheme, tokens } = useTheme();

  React.useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      // Fetch products that are marked as auctions
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .eq('is_auction', true)
        .not('primary_image_url', 'is', null)
        .neq('primary_image_url', '')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        console.error('Error fetching auctions:', error);
        setAuctions([]);
      } else {
        console.log('Fetched auctions:', data?.length || 0);
        // Transform products to auction format
        const transformedAuctions = (data || []).map(product => ({
          id: product.id,
          title: product.title,
          description: product.description,
          imageUrl: product.primary_image_url,
          currentBid: product.market_price_cents || product.retail_price_cents,
          startingBid: product.retail_price_cents * 0.9,
          timeLeft: '2d 14h 32m', // TODO: Calculate from auction_end_date
          bidCount: Math.floor(Math.random() * 20) + 1,
          status: 'live',
        }));
        setAuctions(transformedAuctions);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
      setAuctions([]);
    } finally {
      setLoading(false);
    }
  };

  const luxeStyles = isLuxeTheme ? {
    container: { backgroundColor: tokens.colors.bg },
    header: { backgroundColor: tokens.colors.bgElev },
    title: { color: tokens.colors.text, fontFamily: tokens.typography.display },
    filterButton: { 
      backgroundColor: tokens.colors.surface,
      borderColor: tokens.colors.line,
      borderWidth: 1,
    },
    selectedFilter: { 
      backgroundColor: tokens.colors.gold,
      borderColor: tokens.colors.gold,
    },
    filterText: { color: tokens.colors.text },
    selectedFilterText: { color: tokens.colors.bg },
    auctionCard: { 
      backgroundColor: tokens.colors.bgElev,
      borderColor: tokens.colors.line,
      borderWidth: 1,
      ...tokens.shadows.luxe1
    },
    auctionTitle: { color: tokens.colors.text },
    auctionDescription: { color: tokens.colors.muted },
    bidLabel: { color: tokens.colors.muted },
    bidAmount: { color: tokens.colors.text },
    startingBid: { color: tokens.colors.muted },
    timeText: { color: tokens.colors.muted },
    bidCountText: { color: tokens.colors.muted },
  } : {};

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchAuctions();
    setRefreshing(false);
  }, []);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(cents / 100);
  };

  const handleAuctionPress = (auction: any) => {
    console.log('Auctions: Auction pressed:', auction.title, 'ID:', auction.id);
    const navigationUrl = `/item/${auction.id}`;
    console.log('Auctions: Navigating to:', navigationUrl);
    try {
      router.push(navigationUrl);
      console.log('Auctions: Navigation successful');
    } catch (error) {
      console.error('Auctions: Navigation failed:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return isLuxeTheme ? tokens.colors.success : colors.success;
      case 'ending':
        return isLuxeTheme ? tokens.colors.gold : colors.warning;
      case 'ended':
        return isLuxeTheme ? tokens.colors.muted : colors.text.secondary;
      default:
        return isLuxeTheme ? tokens.colors.muted : colors.text.secondary;
    }
  };

  const renderAuction = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => handleAuctionPress(item)}>
      <Card style={[styles.auctionCard, luxeStyles.auctionCard]}>
      <View style={styles.auctionImage}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image" size={48} color={isLuxeTheme ? tokens.colors.muted : colors.text.tertiary} />
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      
      <View style={styles.auctionContent}>
        <Text style={[styles.auctionTitle, luxeStyles.auctionTitle]} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={[styles.auctionDescription, luxeStyles.auctionDescription]} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.bidInfo}>
          <View style={styles.bidRow}>
            <Text style={[styles.bidLabel, luxeStyles.bidLabel]}>Current Bid</Text>
            <Text style={[styles.bidAmount, luxeStyles.bidAmount]}>
              {formatPrice(item.currentBid)}
            </Text>
          </View>
          
          <View style={styles.bidRow}>
            <Text style={[styles.bidLabel, luxeStyles.bidLabel]}>Starting Bid</Text>
            <Text style={[styles.startingBid, luxeStyles.startingBid]}>
              {formatPrice(item.startingBid)}
            </Text>
          </View>
        </View>
        
        <View style={styles.auctionFooter}>
          <View style={styles.timeContainer}>
            <Ionicons name="time" size={16} color={isLuxeTheme ? tokens.colors.muted : colors.text.secondary} />
            <Text style={[styles.timeText, luxeStyles.timeText]}>{item.timeLeft}</Text>
          </View>
          
          <View style={styles.bidCountContainer}>
            <Ionicons name="people" size={16} color={isLuxeTheme ? tokens.colors.muted : colors.text.secondary} />
            <Text style={[styles.bidCountText, luxeStyles.bidCountText]}>{item.bidCount} bids</Text>
          </View>
        </View>
        
        <Button
          title="Place Bid"
          onPress={() => {}}
          style={styles.bidButton}
        />
      </View>
    </Card>
    </TouchableOpacity>
  );

  const renderFilterButton = (filter: 'all' | 'live' | 'ending', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        luxeStyles.filterButton,
        selectedFilter === filter && [styles.selectedFilter, luxeStyles.selectedFilter]
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[
        styles.filterText,
        luxeStyles.filterText,
        selectedFilter === filter && [styles.selectedFilterText, luxeStyles.selectedFilterText]
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, luxeStyles.container]} edges={['bottom']}>
      <View style={[styles.header, luxeStyles.header]}>
        <Text style={[styles.title, luxeStyles.title]}>Live Auctions</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color={isLuxeTheme ? tokens.colors.text : colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('live', 'Live')}
        {renderFilterButton('ending', 'Ending Soon')}
      </View>

      <FlatList
        data={auctions}
        renderItem={renderAuction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.auctionsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  
  title: {
    fontSize: typography.title.fontSize,
    lineHeight: typography.title.lineHeight,
    fontWeight: typography.title.fontWeight,
    color: colors.text.primary,
  },
  
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  
  filterButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  selectedFilter: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  
  filterText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: typography.caption.fontWeight,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  
  selectedFilterText: {
    color: colors.text.inverse,
  },
  
  auctionsList: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  
  auctionCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  
  auctionImage: {
    position: 'relative',
    height: 200,
  },
  
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  statusBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  
  statusText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: typography.caption.fontWeight,
    color: colors.text.inverse,
    fontWeight: '700',
    fontSize: 10,
  },
  
  auctionContent: {
    padding: spacing.lg,
  },
  
  auctionTitle: {
    fontSize: typography.heading.fontSize,
    lineHeight: typography.heading.lineHeight,
    fontWeight: typography.heading.fontWeight,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  
  auctionDescription: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: typography.body.fontWeight,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  
  bidInfo: {
    marginBottom: spacing.lg,
  },
  
  bidRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  bidLabel: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: typography.caption.fontWeight,
    color: colors.text.secondary,
  },
  
  bidAmount: {
    fontSize: typography.heading.fontSize,
    lineHeight: typography.heading.lineHeight,
    fontWeight: typography.heading.fontWeight,
    color: colors.primary,
    fontWeight: '700',
  },
  
  startingBid: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
    fontWeight: typography.body.fontWeight,
    color: colors.text.tertiary,
  },
  
  auctionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  
  timeText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: typography.caption.fontWeight,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  
  bidCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  
  bidCountText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
    fontWeight: typography.caption.fontWeight,
    color: colors.text.secondary,
  },
  
  bidButton: {
    width: '100%',
  },
});
