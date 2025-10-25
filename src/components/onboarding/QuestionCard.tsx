import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuestionCardProps {
  question: string;
  options: Array<{
    id: string;
    text: string;
    icon?: string;
  }>;
  onAnswer: (answerId: string) => void;
  onSkip: () => void;
  currentStep: number;
  totalSteps: number;
  canSkip?: boolean;
}

export function QuestionCard({
  question,
  options,
  onAnswer,
  onSkip,
  currentStep,
  totalSteps,
  canSkip = true
}: QuestionCardProps) {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          {currentStep} of {totalSteps}
        </Text>
        <View style={styles.progressDots}>
          {Array.from({ length: totalSteps }, (_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index < currentStep ? styles.progressDotActive : styles.progressDotInactive
              ]}
            />
          ))}
        </View>
      </View>

      {/* Question */}
      <Text style={styles.question}>{question}</Text>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={styles.optionButton}
            onPress={() => onAnswer(option.id)}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              {option.icon && (
                <Ionicons 
                  name={option.icon as any} 
                  size={24} 
                  color="#D4AF37" 
                  style={styles.optionIcon}
                />
              )}
              <Text style={styles.optionText}>{option.text}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666666" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Skip Button */}
      {canSkip && (
        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  progressText: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 12,
    fontFamily: 'Inter-Medium',
  },
  progressDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    backgroundColor: '#D4AF37',
  },
  progressDotInactive: {
    backgroundColor: '#333333',
  },
  question: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 36,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  optionsContainer: {
    gap: 16,
    marginBottom: 40,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
    flex: 1,
    fontFamily: 'Inter-Medium',
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 14,
    color: '#666666',
    textDecorationLine: 'underline',
    opacity: 0.6,
  },
});

