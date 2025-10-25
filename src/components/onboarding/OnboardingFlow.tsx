import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { QuestionCard } from './QuestionCard';
import { PersonalizedGallery } from '../PersonalizedGallery';
import { useOnboardingStore, PERSONA_CONFIGS, calculatePersona } from '../../store/onboardingStore';


const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ONBOARDING_QUESTIONS = [
  {
    id: 'q1',
    type: 'question',
    question: 'What brings you here today?',
    options: [
      { id: 'invest_gold', text: "I'm here to invest in gold and precious metals", icon: 'trending-up' },
      { id: 'build_wealth', text: 'I want to build wealth through tangible assets', icon: 'shield' },
      { id: 'collect_rare', text: 'I collect rare coins and historical pieces', icon: 'medal' },
      { id: 'discover_new', text: "I'm here to discover something new", icon: 'compass' },
    ],
  },
  {
    id: 'q2',
    type: 'question',
    question: 'What excites you most when finding a piece?',
    options: [
      { id: 'lasting_value', text: 'Owning real assets with lasting value', icon: 'diamond' },
      { id: 'rare_meaningful', text: 'Adding a rare and meaningful piece to my collection', icon: 'star' },
      { id: 'thrill_unique', text: 'The thrill of uncovering something unique', icon: 'flash' },
      { id: 'learning_exploring', text: 'Learning and exploring new finds', icon: 'book' },
    ],
  },
  {
    id: 'q3',
    type: 'question',
    question: 'What are you most drawn to?',
    options: [
      { id: 'bullion', text: 'Bullion and precious metals', icon: 'cube' },
      { id: 'ancient-coins', text: 'Ancient and historical coins', icon: 'time' },
      { id: 'shipwreck', text: 'Shipwreck and treasure finds', icon: 'boat' },
      { id: 'all_above', text: 'All of the above', icon: 'grid' },
    ],
  },
  {
    id: 'q4',
    type: 'question',
    question: 'How would you prefer to buy?',
    options: [
      { id: 'fixed_price', text: 'Fixed price purchases', icon: 'card' },
      { id: 'mystery_boxes', text: 'Mystery boxes or curated bundles', icon: 'gift' },
      { id: 'auctions', text: 'Limited auctions for rare pieces', icon: 'hammer' },
      { id: 'not_sure', text: 'Not sure yet', icon: 'help-circle' },
    ],
  },
  {
    id: 'q5',
    type: 'question',
    question: 'When are you planning your first purchase?',
    options: [
      { id: 'today', text: 'Today or soon', icon: 'flash' },
      { id: 'weeks', text: 'In the next few weeks', icon: 'calendar' },
      { id: 'later', text: 'Later on', icon: 'time' },
      { id: 'exploring', text: 'Just exploring', icon: 'eye' },
    ],
  },
];

interface OnboardingFlowProps {
  onComplete: (persona: string) => void;
  onSkip: () => void;
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  
  const {
    startOnboarding,
    answerQuestion,
    nextStep,
    skipOnboarding,
    completeOnboarding,
    persona
  } = useOnboardingStore();

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;

  useEffect(() => {
    startOnboarding();
    // Start with first question immediately
    setCurrentStep(0);
  }, []);

  const handleAnswer = (questionId: string, answerId: string) => {
    console.log('handleAnswer called:', { questionId, answerId, currentStep, totalQuestions: ONBOARDING_QUESTIONS.length });
    const newAnswers = { ...answers, [questionId]: answerId };
    setAnswers(newAnswers);
    answerQuestion(questionId, answerId);
    
    // Check if this is the last question based on question ID
    const isLastQuestion = questionId === 'q5';
    console.log('Question check:', { questionId, isLastQuestion });
    
    // Auto-advance after answering
    setTimeout(() => {
      if (!isLastQuestion) {
        console.log('Moving to next question from:', currentStep);
        setCurrentStep(currentStep + 1);
        nextStep();
      } else {
        console.log('Quiz completed - showing results screen');
        // Quiz completed - show results screen
        // Calculate persona immediately from current answers
        const calculatedPersona = calculatePersona(newAnswers);
        console.log('Calculated persona from answers:', calculatedPersona);
        setShowResults(true);
      }
    }, 300);
  };

  const handleSkip = () => {
    skipOnboarding();
    onSkip();
  };

  const handleItemPress = (item: any) => {
    // Navigate to item detail page
    console.log('Item pressed:', item);
    // TODO: Implement navigation to item detail
  };

  const handleContinue = () => {
    // Complete onboarding and navigate to main app
    // The user should remain logged in throughout this flow
    console.log('Onboarding completed, navigating to main app');
    completeOnboarding(); // Now complete the onboarding
    onComplete(persona || 'explorer');
  };


  // Show results screen after quiz completion
  if (showResults) {
    console.log('showResults is true, checking persona:', { showResults, persona, answers });
    
    if (persona) {
      console.log('Showing PersonalizedGallery for persona:', persona);
      return (
        <PersonalizedGallery
          persona={persona}
          onItemPress={handleItemPress}
          onContinue={handleContinue}
        />
      );
    } else {
      console.log('showResults is true but persona is missing, calculating manually...');
      // Calculate persona manually if store doesn't have it
      const manualPersona = calculatePersona(answers);
      console.log('Manual persona calculation:', manualPersona);
      
      return (
        <PersonalizedGallery
          persona={manualPersona}
          onItemPress={handleItemPress}
          onContinue={handleContinue}
        />
      );
    }
  }

  // Fallback: If showResults is true but PersonalizedGallery fails, show simple results
  if (showResults) {
    console.log('Fallback: Showing simple results screen');
    return (
      <View style={styles.questionContainer}>
        <View style={styles.questionBackground}>
          <SafeAreaView style={styles.questionContent}>
            <Text style={styles.question}>Quiz Completed!</Text>
            <Text style={styles.optionText}>You've completed the onboarding quiz.</Text>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleContinue}
            >
              <Text style={styles.optionText}>Continue to App</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </View>
      </View>
    );
  }

  console.log('OnboardingFlow - showResults:', showResults, 'persona:', persona, 'currentStep:', currentStep);

  const currentQuestion = ONBOARDING_QUESTIONS[currentStep];
  console.log('Current question:', currentQuestion?.id, 'Options:', currentQuestion?.options?.length);
  
  if (currentQuestion?.type === 'question') {
    return (
      <View style={styles.questionContainer}>
        <View style={styles.questionBackground}>
          <SafeAreaView style={styles.questionContent}>
            <QuestionCard
              question={currentQuestion.question}
              options={currentQuestion.options}
              onAnswer={(answerId) => handleAnswer(currentQuestion.id, answerId)}
              onSkip={handleSkip}
              currentStep={currentStep + 1}
              totalSteps={ONBOARDING_QUESTIONS.length}
            />
          </SafeAreaView>
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
  },
  splashBackground: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  splashContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  splashText: {
    alignItems: 'center',
    marginBottom: 60,
  },
  splashTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'PlayfairDisplay-Bold',
  },
  splashSubtitle: {
    fontSize: 18,
    color: '#CCCCCC',
    textAlign: 'center',
    lineHeight: 26,
    fontFamily: 'Inter-Regular',
  },
  splashActions: {
    width: '100%',
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
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
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#D4AF37',
    fontFamily: 'Inter-SemiBold',
  },
  questionContainer: {
    flex: 1,
  },
  questionBackground: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#0A0A0A',
    // Add subtle texture with box shadow
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  questionContent: {
    flex: 1,
  },
});

