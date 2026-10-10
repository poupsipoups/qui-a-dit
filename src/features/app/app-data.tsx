import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react';

import { removePlayerPhoto } from '@/features/players/photo';
import type { Player } from '@/features/players/types';
import { seedQuestions } from '@/features/questions/seed';
import { normalizeQuestionText } from '@/features/questions/normalize';
import { fetchRemoteQuestions, submitRemoteQuestion } from '@/features/questions/remote';
import type { Question } from '@/features/questions/types';
import { supabase } from '@/lib/supabase';

const PLAYERS_KEY = 'qui-a-dit/players-v1';
const DISABLED_QUESTIONS_KEY = 'qui-a-dit/disabled-questions-v1';
const SUGGESTIONS_KEY = 'qui-a-dit/local-suggestions-v1';
const QUESTIONS_CACHE_KEY = 'qui-a-dit/questions-cache-v1';

type AppData = {
  ready: boolean;
  players: Player[];
  questions: Question[];
  disabledQuestionIds: string[];
  addPlayer: (input: Player) => Promise<void>;
  removePlayer: (id: string) => Promise<void>;
  toggleQuestion: (id: string) => Promise<void>;
  addLocalSuggestion: (text: string) => Promise<'added' | 'duplicate'>;
};

const AppDataContext = createContext<AppData | null>(null);

export function AppDataProvider({ children }: PropsWithChildren) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [suggestions, setSuggestions] = useState<Question[]>([]);
  const [remoteQuestions, setRemoteQuestions] = useState<Question[]>([]);
  const [disabledQuestionIds, setDisabledQuestionIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([AsyncStorage.getItem(PLAYERS_KEY), AsyncStorage.getItem(SUGGESTIONS_KEY), AsyncStorage.getItem(DISABLED_QUESTIONS_KEY), AsyncStorage.getItem(QUESTIONS_CACHE_KEY)])
      .then(([savedPlayers, savedSuggestions, savedDisabled, savedQuestions]) => {
        if (savedPlayers) setPlayers(JSON.parse(savedPlayers));
        if (savedSuggestions) setSuggestions(JSON.parse(savedSuggestions));
        if (savedDisabled) setDisabledQuestionIds(JSON.parse(savedDisabled));
        if (savedQuestions) setRemoteQuestions(JSON.parse(savedQuestions));
      })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (!ready || !supabase) return;
    fetchRemoteQuestions().then(async (questions) => {
      if (!questions) return;
      setRemoteQuestions(questions);
      await AsyncStorage.setItem(QUESTIONS_CACHE_KEY, JSON.stringify(questions));
    }).catch(() => undefined);
  }, [ready]);

  const addPlayer = async (player: Player) => {
    const next = [...players, player];
    setPlayers(next);
    await AsyncStorage.setItem(PLAYERS_KEY, JSON.stringify(next));
  };

  const removePlayer = async (id: string) => {
    const player = players.find((item) => item.id === id);
    const next = players.filter((item) => item.id !== id);
    setPlayers(next);
    await AsyncStorage.setItem(PLAYERS_KEY, JSON.stringify(next));
    if (player?.photoUri) removePlayerPhoto(player.photoUri);
  };

  const toggleQuestion = async (id: string) => {
    const next = disabledQuestionIds.includes(id) ? disabledQuestionIds.filter((item) => item !== id) : [...disabledQuestionIds, id];
    setDisabledQuestionIds(next);
    await AsyncStorage.setItem(DISABLED_QUESTIONS_KEY, JSON.stringify(next));
  };

  const addLocalSuggestion = async (text: string) => {
    const cleaned = text.trim().replace(/\s+/g, ' ');
    const allQuestions = remoteQuestions.length ? remoteQuestions : [...seedQuestions, ...suggestions];
    if (allQuestions.some((question) => normalizeQuestionText(question.text) === normalizeQuestionText(cleaned))) return 'duplicate';
    if (supabase) {
      const result = await submitRemoteQuestion(cleaned);
      if (result === 'duplicate') return result;
      const questions = await fetchRemoteQuestions();
      if (questions) {
        setRemoteQuestions(questions);
        await AsyncStorage.setItem(QUESTIONS_CACHE_KEY, JSON.stringify(questions));
      }
      return result;
    }
    const next = [...suggestions, { id: `local-${Date.now()}`, text: cleaned, origin: 'suggestion' as const }];
    setSuggestions(next);
    await AsyncStorage.setItem(SUGGESTIONS_KEY, JSON.stringify(next));
    return 'added';
  };

  const questions = remoteQuestions.length ? remoteQuestions : [...seedQuestions, ...suggestions];
  const value: AppData = { ready, players, questions, disabledQuestionIds, addPlayer, removePlayer, toggleQuestion, addLocalSuggestion };
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const value = useContext(AppDataContext);
  if (!value) throw new Error('useAppData must be used inside AppDataProvider');
  return value;
}
