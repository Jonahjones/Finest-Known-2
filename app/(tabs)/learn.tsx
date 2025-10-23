import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../src/components/ui/Card';
import { colors, typography, spacing } from '../../src/design/tokens';

// Mock article data - in real app, this would come from API
const mockArticles = [
  {
    id: '1',
    title: 'Understanding Gold Purity: Karats Explained',
    excerpt: 'Learn about gold purity levels and what they mean for your investment.',
    category: 'Education',
    author: 'Dr. Sarah Johnson',
    readTime: '5 min read',
    publishedAt: '2024-01-15',
    isFeatured: true,
    coverUrl: 'https://via.placeholder.com/300x200',
  },
  {
    id: '2',
    title: 'Market Analysis: Silver Price Trends 2024',
    excerpt: 'Comprehensive analysis of silver market trends and future predictions.',
    category: 'Market',
    author: 'Michael Chen',
    readTime: '8 min read',
    publishedAt: '2024-01-12',
    isFeatured: true,
    coverUrl: 'https://via.placeholder.com/300x200',
  },
  {
    id: '3',
    title: 'Ancient Coins: A Collector\'s Guide',
    excerpt: 'Discover the fascinating world of ancient coin collecting.',
    category: 'Ancients',
    author: 'Prof. Robert Williams',
    readTime: '12 min read',
    publishedAt: '2024-01-10',
    isFeatured: false,
    coverUrl: 'https://via.placeholder.com/300x200',
  },
  {
    id: '4',
    title: 'Platinum vs Palladium: Investment Comparison',
    excerpt: 'Compare these precious metals for your investment portfolio.',
    category: 'Education',
    author: 'Lisa Martinez',
    readTime: '6 min read',
    publishedAt: '2024-01-08',
    isFeatured: false,
    coverUrl: 'https://via.placeholder.com/300x200',
  },
];

const categories = [
  { id: 'all', name: 'All', icon: 'grid' },
  { id: 'education', name: 'Education', icon: 'school' },
  { id: 'market', name: 'Market', icon: 'trending-up' },
  { id: 'ancients', name: 'Ancients', icon: 'time' },
  { id: 'treasure', name: 'Treasure', icon: 'diamond' },
  { id: 'collectibles', name: 'Collectibles', icon: 'star' },
];

export default function LearnScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filteredArticles = mockArticles.filter(article => {
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      article.category.toLowerCase() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = mockArticles.filter(article => article.isFeatured);

  const renderArticle = ({ item }: { item: any }) => (
    <Card style={styles.articleCard}>
      <View style={styles.articleImage}>
        <View style={styles.imagePlaceholder}>
          <Ionicons name="image" size={32} color={colors.text.tertiary} />
        </View>
        {item.isFeatured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
      </View>
      
      <View style={styles.articleContent}>
        <View style={styles.articleHeader}>
          <Text style={styles.articleCategory}>{item.category}</Text>
          <Text style={styles.readTime}>{item.readTime}</Text>
        </View>
        
        <Text style={styles.articleTitle} numberOfLines={2}>
          {item.title}
        </Text>
        
        <Text style={styles.articleExcerpt} numberOfLines={3}>
          {item.excerpt}
        </Text>
        
        <View style={styles.articleFooter}>
          <Text style={styles.articleAuthor}>By {item.author}</Text>
          <Text style={styles.articleDate}>{item.publishedAt}</Text>
        </View>
      </View>
    </Card>
  );

  const renderCategory = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Ionicons 
        name={item.icon as any} 
        size={20} 
        color={selectedCategory === item.id ? colors.text.inverse : colors.text.secondary} 
      />
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
      <View style={styles.header}>
        <Text style={styles.title}>Learn & Resources</Text>
        <TouchableOpacity>
          <Ionicons name="bookmark" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search articles..."
            value={searchQuery}
            onChangeText={setSearchQuery}
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
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Featured Articles */}
      {selectedCategory === 'all' && searchQuery === '' && (
        <View style={styles.featuredSection}>
          <Text style={styles.sectionTitle}>Featured Articles</Text>
          <FlatList
            data={featuredArticles}
            renderItem={renderArticle}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>
      )}

      {/* All Articles */}
      <View style={styles.articlesSection}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'all' ? 'All Articles' : `${categories.find(c => c.id === selectedCategory)?.name} Articles`}
        </Text>
        
        <FlatList
          data={filteredArticles}
          renderItem={renderArticle}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.articlesList}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={48} color={colors.text.tertiary} />
              <Text style={styles.emptyTitle}>No articles found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or category filter
              </Text>
            </View>
          }
        />
      </View>
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
  
  searchContainer: {
    paddingHorizontal: spacing.lg,
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
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
  
  featuredSection: {
    paddingBottom: spacing.lg,
  },
  
  sectionTitle: {
    ...typography.heading,
    color: colors.text.primary,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  
  featuredList: {
    paddingHorizontal: spacing.lg,
  },
  
  articlesSection: {
    flex: 1,
  },
  
  articlesList: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  
  articleCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  
  articleImage: {
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
  
  featuredBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 4,
  },
  
  featuredText: {
    ...typography.caption,
    color: colors.text.inverse,
    fontWeight: '700',
    fontSize: 10,
  },
  
  articleContent: {
    padding: spacing.lg,
  },
  
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  
  articleCategory: {
    ...typography.caption,
    color: colors.accent,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  
  readTime: {
    ...typography.caption,
    color: colors.text.tertiary,
  },
  
  articleTitle: {
    ...typography.heading,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },
  
  articleExcerpt: {
    ...typography.body,
    color: colors.text.secondary,
    marginBottom: spacing.lg,
  },
  
  articleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  articleAuthor: {
    ...typography.caption,
    color: colors.text.secondary,
    fontWeight: '600',
  },
  
  articleDate: {
    ...typography.caption,
    color: colors.text.tertiary,
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
