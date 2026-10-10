create extension if not exists unaccent with schema extensions;

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  text text not null check (char_length(trim(text)) between 8 and 180),
  normalized_text text not null unique,
  origin text not null check (origin in ('official', 'suggestion')),
  created_at timestamptz not null default now()
);

create or replace function public.normalize_question_text(value text)
returns text
language sql
stable
as $$
  select lower(regexp_replace(extensions.unaccent(trim(value)), '\s+', ' ', 'g'));
$$;

create or replace function public.set_question_normalized_text()
returns trigger
language plpgsql
as $$
begin
  new.text := trim(regexp_replace(new.text, '\s+', ' ', 'g'));
  new.normalized_text := public.normalize_question_text(new.text);
  return new;
end;
$$;

drop trigger if exists questions_normalized_text_trigger on public.questions;
create trigger questions_normalized_text_trigger
before insert or update of text on public.questions
for each row execute function public.set_question_normalized_text();

alter table public.questions enable row level security;
grant select, insert on public.questions to anon, authenticated;

create policy "questions are readable by everyone"
on public.questions for select
using (true);

create policy "anyone can suggest a question"
on public.questions for insert
with check (origin = 'suggestion');

insert into public.questions (text, normalized_text, origin) values
  ('Quel est ton talent le plus inutile ?', 'quel est ton talent le plus inutile ?', 'official'),
  ('Quelle phrase regrettes-tu encore d’avoir dite ?', 'quelle phrase regrettes-tu encore d''avoir dite ?', 'official'),
  ('Quel est le dernier mensonge que tu as sorti ?', 'quel est le dernier mensonge que tu as sorti ?', 'official'),
  ('Qu’est-ce que tu ne dirais jamais à table ?', 'qu''est-ce que tu ne dirais jamais a table ?', 'official'),
  ('Si tu devenais célèbre demain, pour quelle raison ?', 'si tu devenais celebre demain, pour quelle raison ?', 'official'),
  ('Quelle est ta pire habitude secrète ?', 'quelle est ta pire habitude secrete ?', 'official'),
  ('Quel message aurais-tu aimé ne jamais envoyer ?', 'quel message aurais-tu aime ne jamais envoyer ?', 'official'),
  ('Quel super-pouvoir serait totalement inutile pour toi ?', 'quel super-pouvoir serait totalement inutile pour toi ?', 'official')
on conflict (normalized_text) do nothing;
