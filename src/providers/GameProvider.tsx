'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { GameState, UserProfile, CompletedLevel, ModuleSlug } from '@/types';
import { getLevelFromXP } from '@/lib/gamification/xp';
import { checkBadges } from '@/lib/gamification/badges';
import { calculateStreak } from '@/lib/gamification/streaks';

const STORAGE_KEY = 'wordquest_state';

const initialState: GameState = {
  profile: null,
  xp: 0,
  level: 1,
  coins: 0,
  streak: 0,
  lastPlayedDate: null,
  hearts: 5,
  completedLevels: {},
  badges: [],
  dailyChallengeCompleted: [],
  shopPurchases: [],
  comboCount: 0,
};

type GameAction =
  | { type: 'SET_PROFILE'; payload: UserProfile }
  | { type: 'ADD_XP'; payload: number }
  | { type: 'ADD_COINS'; payload: number }
  | { type: 'SPEND_COINS'; payload: number }
  | { type: 'LOSE_HEART' }
  | { type: 'RESET_HEARTS' }
  | { type: 'COMPLETE_LEVEL'; payload: CompletedLevel }
  | { type: 'ADD_BADGES'; payload: string[] }
  | { type: 'UPDATE_STREAK' }
  | { type: 'COMPLETE_DAILY_CHALLENGE'; payload: string }
  | { type: 'SET_COMBO'; payload: number }
  | { type: 'ADD_SHOP_PURCHASE'; payload: string }
  | { type: 'LOAD_STATE'; payload: GameState }
  | { type: 'RESET_STATE' };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PROFILE':
      return { ...state, profile: action.payload };
    case 'ADD_XP': {
      const newXP = state.xp + action.payload;
      const newLevel = getLevelFromXP(newXP);
      return { ...state, xp: newXP, level: newLevel };
    }
    case 'ADD_COINS':
      return { ...state, coins: state.coins + action.payload };
    case 'SPEND_COINS':
      return { ...state, coins: Math.max(0, state.coins - action.payload) };
    case 'LOSE_HEART':
      return { ...state, hearts: Math.max(0, state.hearts - 1) };
    case 'RESET_HEARTS':
      return { ...state, hearts: 5 };
    case 'COMPLETE_LEVEL':
      return {
        ...state,
        completedLevels: {
          ...state.completedLevels,
          [action.payload.levelId]: action.payload,
        },
      };
    case 'ADD_BADGES':
      return { ...state, badges: [...state.badges, ...action.payload] };
    case 'UPDATE_STREAK': {
      const { streak, isNewDay } = calculateStreak(state.lastPlayedDate, state.streak);
      if (!isNewDay) return state;
      return {
        ...state,
        streak,
        lastPlayedDate: new Date().toISOString().split('T')[0],
      };
    }
    case 'COMPLETE_DAILY_CHALLENGE':
      return {
        ...state,
        dailyChallengeCompleted: [...state.dailyChallengeCompleted, action.payload],
      };
    case 'SET_COMBO':
      return { ...state, comboCount: action.payload };
    case 'ADD_SHOP_PURCHASE':
      return { ...state, shopPurchases: [...state.shopPurchases, action.payload] };
    case 'LOAD_STATE':
      return action.payload;
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  setProfile: (profile: UserProfile) => void;
  addXP: (amount: number) => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  loseHeart: () => void;
  resetHearts: () => void;
  completeLevel: (level: CompletedLevel) => void;
  updateStreak: () => void;
  completeDailyChallenge: (date: string) => void;
  setCombo: (count: number) => void;
  addShopPurchase: (itemId: string) => void;
  checkAndAwardBadges: () => string[];
  resetGame: () => void;
  getModuleProgress: (moduleSlug: ModuleSlug) => number;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load state from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: { ...initialState, ...parsed } });
      }
    } catch (e) {
      console.error('Failed to load game state:', e);
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (state.profile) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (e) {
        console.error('Failed to save game state:', e);
      }
    }
  }, [state]);

  const setProfile = useCallback((profile: UserProfile) => {
    dispatch({ type: 'SET_PROFILE', payload: profile });
  }, []);

  const addXP = useCallback((amount: number) => {
    dispatch({ type: 'ADD_XP', payload: amount });
  }, []);

  const addCoins = useCallback((amount: number) => {
    dispatch({ type: 'ADD_COINS', payload: amount });
  }, []);

  const spendCoins = useCallback((amount: number): boolean => {
    if (state.coins >= amount) {
      dispatch({ type: 'SPEND_COINS', payload: amount });
      return true;
    }
    return false;
  }, [state.coins]);

  const loseHeart = useCallback(() => {
    dispatch({ type: 'LOSE_HEART' });
  }, []);

  const resetHearts = useCallback(() => {
    dispatch({ type: 'RESET_HEARTS' });
  }, []);

  const completeLevel = useCallback((level: CompletedLevel) => {
    dispatch({ type: 'COMPLETE_LEVEL', payload: level });
  }, []);

  const updateStreak = useCallback(() => {
    dispatch({ type: 'UPDATE_STREAK' });
  }, []);

  const completeDailyChallenge = useCallback((date: string) => {
    dispatch({ type: 'COMPLETE_DAILY_CHALLENGE', payload: date });
  }, []);

  const setCombo = useCallback((count: number) => {
    dispatch({ type: 'SET_COMBO', payload: count });
  }, []);

  const addShopPurchase = useCallback((itemId: string) => {
    dispatch({ type: 'ADD_SHOP_PURCHASE', payload: itemId });
  }, []);

  const checkAndAwardBadges = useCallback((): string[] => {
    const newBadges = checkBadges(state);
    if (newBadges.length > 0) {
      dispatch({ type: 'ADD_BADGES', payload: newBadges });
    }
    return newBadges;
  }, [state]);

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const getModuleProgress = useCallback((moduleSlug: ModuleSlug): number => {
    const moduleLevels = Object.values(state.completedLevels)
      .filter(l => l.moduleSlug === moduleSlug);
    return moduleLevels.length;
  }, [state.completedLevels]);

  return (
    <GameContext.Provider
      value={{
        state,
        setProfile,
        addXP,
        addCoins,
        spendCoins,
        loseHeart,
        resetHearts,
        completeLevel,
        updateStreak,
        completeDailyChallenge,
        setCombo,
        addShopPurchase,
        checkAndAwardBadges,
        resetGame,
        getModuleProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
