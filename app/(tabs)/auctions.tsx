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
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { useTheme } from '../../src/theme/ThemeProvider';
import { colors } from '../../src/design/tokens';

// Mock auction data - in real app, this would come from API
const mockAuctions = [
  {
    id: '1',
    title: 'Rare 1921 Morgan Silver Dollar',
    description: 'Mint condition Morgan Silver Dollar from 1921',
    imageUrl: 'https://via.placeholder.com/300x200',
    currentBid: 25000,
    startingBid: 20000,
    timeLeft: '2d 14h 32m',
    bidCount: 12,
    status: 'live',
  },
  {
    id: '2',
    title: 'Gold Eagle 1oz 2023',
    description: 'American Gold Eagle in perfect condition',
    imageUrl: 'https://via.placeholder.com/300x200',
    currentBid: 210000,
    startingBid: 200000,
    timeLeft: '1d 8h 15m',
    bidCount: 8,
    status: 'live',
  },
  {
    id: '3',
    title: 'Platinum Maple Leaf 1oz',
    description: 'Canadian Platinum Maple Leaf coin',
    imageUrl: 'https://via.placeholder.com/300x200',
    currentBid: 95000,
    startingBid: 90000,
    timeLeft: '5h 22m',
    bidCount: 5,
    status: 'live',
  },
];

export default function AuctionsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'live' | 'ending'>('all');
  const { isLuxeTheme, tokens } = useTheme();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(cents / 100);
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
        data={mockAuctions}
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
    ...typography.title,
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
    ...typography.caption,
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
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: '700',
    fontSize: 10,
  },
  
  auctionContent: {
    padding: spacing.lg,
  },
  
  auctionTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  
  auctionDescription: {
    ...typography.body,
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
    ...typography.caption,
    color: colors.text.secondary,
  },
  
  bidAmount: {
    ...typography.heading,
    color: colors.primary,
    fontWeight: '700',
  },
  
  startingBid: {
    ...typography.body,
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
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  
  bidCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  
  bidCountText: {
    ...typography.caption,
    color: colors.text.secondary,
  },
  
  bidButton: {
    width: '100%',
  },
});
