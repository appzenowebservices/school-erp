'use client';

import TeachDraft from '../TeachDraft';

export default function LessonPlanTool() {
  return (
    <TeachDraft
      demo="lesson-plan"
      tile="LP"
      eyebrow="TEACH WITH AI • LESSON PLAN"
      title="Lesson plan draft"
      sub="A 40-minute (or your duration) plan: objectives, hook, explain, activity, exit ticket — aligned to your chapter."
      route="/dashboard/teach/lesson-plan"
      cta="Draft lesson plan"
      requireNote="Draft only — review, adjust to your timetable slot, then use in class. Publishing stays with you."
      emptySteps={['Set chapter', 'Draft plan', 'Teach it']}
      initial={{ board: 'CBSE', grade: '7', subject: 'Science', chapter: '', minutes: '40' }}
      fields={[
        { key: 'board', label: 'Board', type: 'select', options: ['CBSE', 'ICSE'] },
        { key: 'grade', label: 'Class', type: 'text', placeholder: '7', required: true },
        { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Science', required: true },
        { key: 'chapter', label: 'Chapter', type: 'text', placeholder: 'e.g. Nutrition in Plants', required: true },
        { key: 'minutes', label: 'Duration (minutes)', type: 'text', placeholder: '40' },
      ]}
      brief={(v) => [
        `Draft a ${v.minutes || 40}-minute lesson plan for Class ${v.grade} ${v.subject}, chapter "${(v.chapter || '').trim()}" (${v.board}).`,
        `Format exactly: Learning objectives (2-4) → Hook (2 min) → Explain (with one example) →`,
        `Class activity → Exit ticket (2 questions). Grade-level language.`,
        `Verify facts against the chapter; never invent. Cite the chapter at the top.`,
      ].join(' ')}
      outputTitle={(v) => `${v.subject} · ${v.chapter || 'Lesson plan'}`}
    />
  );
}
