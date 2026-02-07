
-- Global course catalog (shared courses anyone can join)
CREATE TABLE public.course_catalog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(name)
);

ALTER TABLE public.course_catalog ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view courses"
ON public.course_catalog FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create courses"
ON public.course_catalog FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Course enrollments (who's in which course - for chat access)
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  catalog_course_id UUID NOT NULL REFERENCES public.course_catalog(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, catalog_course_id)
);

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can view enrollments"
ON public.course_enrollments FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can enroll themselves"
ON public.course_enrollments FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unenroll themselves"
ON public.course_enrollments FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Course chat messages
CREATE TABLE public.course_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catalog_course_id UUID NOT NULL REFERENCES public.course_catalog(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.course_messages ENABLE ROW LEVEL SECURITY;

-- Only enrolled users can view messages
CREATE POLICY "Enrolled users can view messages"
ON public.course_messages FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.course_enrollments
    WHERE course_enrollments.catalog_course_id = course_messages.catalog_course_id
    AND course_enrollments.user_id = auth.uid()
  )
);

-- Only enrolled users can send messages
CREATE POLICY "Enrolled users can send messages"
ON public.course_messages FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.course_enrollments
    WHERE course_enrollments.catalog_course_id = course_messages.catalog_course_id
    AND course_enrollments.user_id = auth.uid()
  )
);

-- Link existing courses table to catalog
ALTER TABLE public.courses ADD COLUMN catalog_course_id UUID REFERENCES public.course_catalog(id);

-- Enable realtime for course messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.course_messages;
