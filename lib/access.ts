import { SupabaseClient } from '@supabase/supabase-js'

export async function canAccessLesson(
  studentId: string,
  lessonId: string,
  supabase: SupabaseClient
): Promise<{ allowed: boolean; reason?: string }> {

  // 1. Get the lesson's week number
  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('week_id, weeks(week_number, course_id)')
    .eq('id', lessonId)
    .single();

  if (lessonError || !lesson) return { allowed: false, reason: 'lesson_not_found' };

  // @ts-ignore
  const courseId = lesson.weeks.course_id;
  // @ts-ignore
  const weekNumber = lesson.weeks.week_number;

  // 2. Get student enrolment for this course
  const { data: enrolment, error: enrolError } = await supabase
    .from('enrolments')
    .select('*')
    .eq('student_id', studentId)
    .eq('course_id', courseId)
    .single();

  if (enrolError || !enrolment) return { allowed: false, reason: 'not_enrolled' };

  // 3. Fully paid — always allowed
  if (enrolment.tier === 'paid') return { allowed: true };

  // 4. Not deposited — not allowed
  if (enrolment.tier !== 'deposited') {
    return { allowed: false, reason: 'payment_required' };
  }

  // 5. Deposited — check deadline and waterline
  const deadlinePassed = enrolment.payment_deadline
    && new Date() > new Date(enrolment.payment_deadline);

  if (deadlinePassed && weekNumber > enrolment.waterline_week) {
    return { allowed: false, reason: 'payment_overdue' };
  }

  return { allowed: true };
}
