import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PersonaType, PERSONA_CONFIGS } from '../store/onboardingStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface ConversionModalProps {
  visible: boolean;
  onClose: () => void;
  onSignUp: () => void;
  onSignIn: () => void;
  action: 'save' | 'bid' | 'checkout';
  item?: {
    title: string;
    image_url: string;
    price_cents: number;
    currency: string;
  };
  persona: PersonaType;
}

export function ConversionModal({
  visible,
  onClose,
  onSignUp,
  onSignIn,
  action,
  item,
  persona
}: ConversionModalProps) {
  const slideAnim = React.useRef(new Animated.Value(screenHeight)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: screenHeight,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const personaConfig = PERSONA_CONFIGS[persona];

  const getActionText = () => {
    switch (action) {
      case 'save':
        return 'Save this item to your favorites';
      case 'bid':
        return 'Place a bid on this auction';
      case 'checkout':
        return 'Complete your purchase';
      default:
        return 'Continue with your action';
    }
  };

  const getActionIcon = () => {
    switch (action) {
      case 'save':
        return 'bookmark';
      case 'bid':
        return 'hammer';
      case 'checkout':
        return 'cart';
      default:
        return 'lock-closed';
    }
  };

  const formatPrice = (priceCents: number, currency: string) => {
    const price = priceCents / 100;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <Modal
      visible={Boolean(visible)}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={[
          styles.overlay,
          { opacity: fadeAnim }
        ]}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <Animated.View
          style={[
            styles.modal,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons 
                name={getActionIcon()} 
                size={32} 
                color="#D4AF37" 
              />
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
            >
              <Ionicons name="close" size={24} color="#666666" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.title}>{getActionText()}</Text>
            <Text style={styles.subtitle}>
              {personaConfig.cta}
            </Text>

            {/* Item Preview */}
            {item && (
              <View style={styles.itemPreview}>
                <Image
                  source={{ uri: item.image_url }}
                  style={styles.itemImage}
                  resizeMode="cover"
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {formatPrice(item.price_cents, item.currency)}
                  </Text>
                </View>
              </View>
            )}

            {/* Benefits */}
            <View style={styles.benefits}>
              <View style={styles.benefit}>
                <Ionicons name="shield-checkmark" size={20} color="#D4AF37" />
                <Text style={styles.benefitText}>Secure transactions</Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="star" size={20} color="#D4AF37" />
                <Text style={styles.benefitText}>Authenticated items</Text>
              </View>
              <View style={styles.benefit}>
                <Ionicons name="trending-up" size={20} color="#D4AF37" />
                <Text style={styles.benefitText}>Track your portfolio</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={onSignUp}
            >
              <Text style={styles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={onSignIn}
            >
              <Text style={styles.secondaryButtonText}>Sign In</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.skipButton}
              onPress={onClose}
            >
              <Text style={styles.skipButtonText}>Maybe later</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modal: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 34, // Safe area for home indicator
    maxHeight: screenHeight * 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'PlayfairDisplay-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontFamily: 'Inter-Regular',
  },
  itemPreview: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: 'Inter-SemiBold',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D4AF37',
    fontFamily: 'Inter-Bold',
  },
  benefits: {
    gap: 12,
    marginBottom: 8,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitText: {
    fontSize: 14,
    color: '#CCCCCC',
    fontFamily: 'Inter-Regular',
  },
  actions: {
    paddingHorizontal: 24,
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: 'Inter-Bold',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: '#D4AF37',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D4AF37',
    fontFamily: 'Inter-SemiBold',
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
});

