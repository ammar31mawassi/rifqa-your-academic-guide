
-- Study sessions table
CREATE TABLE public.study_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  course_name TEXT DEFAULT '',
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  location TEXT DEFAULT '',
  max_participants INTEGER DEFAULT 20,
  category TEXT NOT NULL DEFAULT 'study' CHECK (category IN ('study', 'social', 'tutoring')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Session participants table
CREATE TABLE public.session_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.study_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (session_id, user_id)
);

-- Enable RLS
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;

-- Study sessions policies
CREATE POLICY "Anyone authenticated can view sessions"
  ON public.study_sessions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create sessions"
  ON public.study_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = creator_id);

CREATE POLICY "Creators can update their sessions"
  ON public.study_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their sessions"
  ON public.study_sessions FOR DELETE
  TO authenticated
  USING (auth.uid() = creator_id);

-- Session participants policies
CREATE POLICY "Anyone authenticated can view participants"
  ON public.session_participants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join sessions"
  ON public.session_participants FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave sessions"
  ON public.session_participants FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_study_sessions_updated_at
  BEFORE UPDATE ON public.study_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
