import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { getProducts, getCategories, searchProducts } from '../../src/api/products';
import { ProductCard } from '../../src/components/ui/ProductCard';
import { Button } from '../../src/components/ui/Button';
import { useTheme } from '../../src/theme/ThemeProvider';

export default function CatalogScreen() {
  const { isLuxeTheme, tokens } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');
  const [refreshing, setRefreshing] = useState(false);

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data: products, isLoading: productsLoading, refetch } = useQuery({
    queryKey: ['products', selectedCategory, sortBy],
    queryFn: () => getProducts({ 
      category: selectedCategory || undefined,
      limit: 50 
    }),
  });

  const { data: searchResults, isLoading: searchLoading } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => searchProducts(searchQuery),
    enabled: searchQuery.length > 2,
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    refetch();
    setTimeout(() => setRefreshing(false), 1000);
  }, [refetch]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  const handleSort = (sort: 'newest' | 'price_low' | 'price_high') => {
    setSortBy(sort);
  };

  const displayProducts = searchQuery.length > 2 ? searchResults : products;
  const isLoading = searchQuery.length > 2 ? searchLoading : productsLoading;

  const renderProduct = ({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onPress={() => {}}
      style={styles.productCard}
    />
  );

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory
      ]}
      onPress={() => handleCategorySelect(selectedCategory === item.id ? null : item.id)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.selectedCategoryText
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={colors.text.secondary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={[{ id: null, name: 'All' }, ...(categories || [])]}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id || 'all'}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <View style={styles.sortButtons}>
          {[
            { key: 'newest', label: 'Newest' },
            { key: 'price_low', label: 'Price: Low to High' },
            { key: 'price_high', label: 'Price: High to Low' },
          ].map((option) => (
            <Button
              key={option.key}
              title={option.label}
              onPress={() => handleSort(option.key as any)}
              variant={sortBy === option.key ? 'primary' : 'outline'}
              size="sm"
              style={styles.sortButton}
            />
          ))}
        </View>
      </View>

      {/* Products Grid */}
      <View style={styles.productsContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : (
          <FlatList
            data={displayProducts || []}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.productsList}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search" size={48} color={colors.text.tertiary} />
                <Text style={styles.emptyTitle}>No products found</Text>
                <Text style={styles.emptySubtitle}>
                  Try adjusting your search or filters
                </Text>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  searchContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  searchInput: {
    flex: 1,
    marginLeft: spacing.sm,
    fontSize: typography.body.fontSize,
    color: colors.text.primary,
  },
  
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  
  categoriesList: {
    gap: spacing.sm,
  },
  
  categoryItem: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  selectedCategory: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  
  categoryText: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  
  selectedCategoryText: {
    color: colors.text.inverse,
  },
  
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.md,
  },
  
  sortLabel: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  
  sortButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  
  sortButton: {
    paddingHorizontal: spacing.sm,
  },
  
  productsContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  
  productsList: {
    paddingBottom: spacing['2xl'],
  },
  
  productRow: {
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  
  productCard: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
  },
  
  loadingText: {
    ...typography.body,
    color: colors.text.secondary,
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing['4xl'],
  },
  
  emptyTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  
  emptySubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    textAlign: 'center',
  },
});
