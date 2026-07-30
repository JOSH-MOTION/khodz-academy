"use client";

interface SwitcherEnrolment {
  course_id: string;
  courses?: { title: string } | { title: string }[] | null;
}

function titleOf(courses: SwitcherEnrolment["courses"]) {
  if (!courses) return null;
  return Array.isArray(courses) ? courses[0]?.title ?? null : courses.title;
}

interface CourseSwitcherProps {
  enrolments: SwitcherEnrolment[];
  activeCourseId: string;
  onSwitch: (courseId: string) => void;
}

/** Only renders when a student has more than one course — students with a
 * single enrolment never see this, nothing changes for them. */
export default function CourseSwitcher({ enrolments, activeCourseId, onSwitch }: CourseSwitcherProps) {
  if (enrolments.length <= 1) return null;

  return (
    <select
      value={activeCourseId}
      onChange={(e) => onSwitch(e.target.value)}
      className="bg-surface-container-high border border-white/10 rounded-full pl-3 pr-7 py-1.5 text-[11px] font-bold text-on-surface outline-none focus:border-primary cursor-pointer"
    >
      {enrolments.map((e) => (
        <option key={e.course_id} value={e.course_id}>
          {titleOf(e.courses) || e.course_id}
        </option>
      ))}
    </select>
  );
}
