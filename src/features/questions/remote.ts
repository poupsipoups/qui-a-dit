import { supabase } from '@/lib/supabase';
import type { Question } from './types';

type QuestionRow = { id: string; text: string; origin: 'official' | 'suggestion' };

export async function fetchRemoteQuestions(): Promise<Question[] | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('questions').select('id, text, origin').order('created_at', { ascending: true });
  if (error) throw error;
  return (data as QuestionRow[]).map(({ id, text, origin }) => ({ id, text, origin }));
}

export async function submitRemoteQuestion(text: string): Promise<'added' | 'duplicate'> {
  if (!supabase) throw new Error('Supabase n’est pas configuré.');
  const { error } = await supabase.from('questions').insert({ text, origin: 'suggestion', normalized_text: '' });
  if (!error) return 'added';
  if (error.code === '23505') return 'duplicate';
  throw error;
}
