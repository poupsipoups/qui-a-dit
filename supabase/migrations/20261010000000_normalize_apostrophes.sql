-- Les apostrophes typographiques (’) et droites (') doivent donner la même clé de comparaison.
create or replace function public.normalize_question_text(value text)
returns text
language sql
stable
as $$
  select lower(
    regexp_replace(
      translate(extensions.unaccent(trim(value)), E'‘’ʼ', ''''''''),
      '\s+', ' ', 'g'
    )
  );
$$;

-- Recalcule normalized_text pour les lignes existantes (le trigger se déclenche sur "update of text").
update public.questions set text = text;
