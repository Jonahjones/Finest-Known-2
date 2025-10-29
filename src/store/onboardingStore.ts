import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface OnboardingState {
  currentStep: number;
  answers: Record<string, string>;
  persona: PersonaType | null;
  isCompleted: boolean;
  isSkipped: boolean;
  startTime: number | null;
  endTime: number | null;
}

export type PersonaType = 'precious_metal_investor' | 'tangible_asset_buyer' | 'collector' | 'explorer';

export interface PersonaConfig {
  name: string;
  description: string;
  categories: string[];
  cta: string;
  landingPath: string;
}

export const PERSONA_CONFIGS: Record<PersonaType, PersonaConfig> = {
  precious_metal_investor: {
    name: 'Precious Metal Investor',
    description: 'Track prices and buy securely',
    categories: ['bullion', 'precious-metals'],
    cta: 'Create your profile to track prices and buy securely.',
    landingPath: '/catalog?category=bullion'
  },
  tangible_asset_buyer: {
    name: 'Tangible Asset Buyer',
    description: 'Build wealth through real assets',
    categories: ['bullion', 'bundles'],
    cta: 'Build your portfolio and start buying real assets.',
    landingPath: '/catalog?category=bullion'
  },
  collector: {
    name: 'Collector',
    description: 'Authenticated pieces and rare finds',
    categories: ['ancient-coins', 'graded-sets'],
    cta: 'Create your profile to watch and collect authenticated pieces.',
    landingPath: '/catalog?category=ancient-coins'
  },
  explorer: {
    name: 'Explorer',
    description: 'Discover at your own pace',
    categories: ['all'],
    cta: 'Explore the marketplace at your own pace.',
    landingPath: '/catalog'
  }
};

const SCORING_WEIGHTS = {
  q1: 50,
  q2: 20,
  q3: 15,
  q4: 10,
  q5: 5
};

const PERSONA_MAPPING = {
  'precious_metal_investor': {
    q1: ['invest_gold', 'build_wealth'],
    q2: ['lasting_value'],
    q3: ['bullion', 'precious-metals'],
    q4: ['fixed_price'],
    q5: ['today', 'weeks']
  },
  'tangible_asset_buyer': {
    q1: ['build_wealth'],
    q2: ['lasting_value', 'rare_meaningful'],
    q3: ['bullion', 'bundles'],
    q4: ['fixed_price', 'mystery_boxes'],
    q5: ['today', 'weeks', 'later']
  },
  'collector': {
    q1: ['collect_rare'],
    q2: ['rare_meaningful', 'thrill_unique'],
    q3: ['ancient-coins', 'shipwreck'],
    q4: ['auctions', 'mystery_boxes'],
    q5: ['weeks', 'later', 'exploring']
  },
  'explorer': {
    q1: ['discover_new'],
    q2: ['thrill_unique', 'learning_exploring'],
    q3: ['all_above'],
    q4: ['not_sure'],
    q5: ['exploring']
  }
};

export const useOnboardingStore = create<OnboardingState & {
  startOnboarding: () => void;
  answerQuestion: (questionId: string, answer: string) => void;
  nextStep: () => void;
  skipOnboarding: () => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}>()(
  persist(
    (set, get) => ({
      currentStep: 0,
      answers: {},
      persona: null,
      isCompleted: false,
      isSkipped: false,
      startTime: null,
      endTime: null,

      // Actions
      startOnboarding: () => set({ 
        startTime: Date.now(),
        currentStep: 0,
        answers: {},
        persona: null,
        isCompleted: false,
        isSkipped: false
      }),

      answerQuestion: (questionId: string, answer: string) => {
        const { answers } = get();
        set({ 
          answers: { ...answers, [questionId]: answer }
        });
      },

      nextStep: () => {
        const { currentStep } = get();
        set({ currentStep: currentStep + 1 });
      },

      skipOnboarding: () => {
        set({ 
          isSkipped: true,
          isCompleted: true,
          endTime: Date.now(),
          persona: 'explorer'
        });
      },

      completeOnboarding: () => {
        const { answers } = get();
        const persona = calculatePersona(answers);
        set({ 
          isCompleted: true,
          endTime: Date.now(),
          persona
        });
      },

      resetOnboarding: () => set({
        currentStep: 0,
        answers: {},
        persona: null,
        isCompleted: false,
        isSkipped: false,
        startTime: null,
        endTime: null
      })
    }),
    {
      name: 'finestknown-onboarding',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        persona: state.persona,
        isCompleted: state.isCompleted,
        isSkipped: state.isSkipped
      }),
      // Ensure booleans are properly parsed when hydrating from storage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isCompleted = Boolean(state.isCompleted);
          state.isSkipped = Boolean(state.isSkipped);
        }
      }
    }
  )
);

export function calculatePersona(answers: Record<string, string>): PersonaType {
  const scores: Record<PersonaType, number> = {
    precious_metal_investor: 0,
    tangible_asset_buyer: 0,
    collector: 0,
    explorer: 0
  };

  // Count skipped questions
  const skippedQuestions = Object.values(answers).filter(answer => answer === 'skip').length;
  
  // If 3 or more questions skipped, return explorer
  if (skippedQuestions >= 3) {
    return 'explorer';
  }

  // Calculate scores for each persona
  Object.entries(PERSONA_MAPPING).forEach(([persona, mappings]) => {
    Object.entries(mappings).forEach(([questionId, matchingAnswers]) => {
      const answer = answers[questionId];
      if (answer && matchingAnswers.includes(answer)) {
        const weight = SCORING_WEIGHTS[questionId as keyof typeof SCORING_WEIGHTS] || 0;
        scores[persona as PersonaType] += weight;
      }
    });
  });

  // Find persona with highest score
  const maxScore = Math.max(...Object.values(scores));
  const topPersonas = Object.entries(scores).filter(([_, score]) => score === maxScore);
  
  // If tie, use Q1 answer, fallback to Q3
  if (topPersonas.length > 1) {
    const q1Answer = answers.q1;
    if (q1Answer) {
      const q1Persona = Object.entries(PERSONA_MAPPING).find(([_, mappings]) => 
        mappings.q1.includes(q1Answer)
      )?.[0] as PersonaType;
      if (q1Persona) return q1Persona;
    }
    
    const q3Answer = answers.q3;
    if (q3Answer) {
      const q3Persona = Object.entries(PERSONA_MAPPING).find(([_, mappings]) => 
        mappings.q3.includes(q3Answer)
      )?.[0] as PersonaType;
      if (q3Persona) return q3Persona;
    }
  }

  return topPersonas[0]?.[0] as PersonaType || 'explorer';
}

// Export actions - these will be available after the store is created
export const useOnboardingActions = () => {
  const store = useOnboardingStore();
  return {
    startOnboarding: store.startOnboarding,
    answerQuestion: store.answerQuestion,
    nextStep: store.nextStep,
    skipOnboarding: store.skipOnboarding,
    completeOnboarding: store.completeOnboarding,
    resetOnboarding: store.resetOnboarding
  };
};
