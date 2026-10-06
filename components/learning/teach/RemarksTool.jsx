'use client';

import TeachDraft from '../TeachDraft';

export default function RemarksTool() {
  return (
    <TeachDraft
      demo="remarks"
      tile="RM"
      eyebrow="TEACH WITH AI • REPORT CARD"
      title="Class remarks"
      sub="Warm, specific 3–5 line remarks per student — strengths plus one next step, never compared with classmates."
      route="/dashboard/teach/remarks"
      cta="Draft remarks"
      requireNote="Draft only — verify against real results, then enter in the report card yourself. One student at a time."
      emptySteps={['Name student', 'Draft lines', 'Enter in card']}
      initial={{ student: '', grade: '7', subject: 'Science', strengths: '', areas: '' }}
      fields={[
        { key: 'student', label: 'Student name / ID', type: 'text', placeholder: 'e.g. Aarav (VII-A)', required: true },
        { key: 'grade', label: 'Class', type: 'text', placeholder: '7', required: true },
        { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Science', required: true },
        { key: 'strengths', label: 'Strengths observed', type: 'textarea', placeholder: 'e.g. Asks sharp questions, neat diagrams' },
        { key: 'areas', label: 'Area to improve', type: 'textarea', placeholder: 'e.g. Show steps in numericals' },
      ]}
      brief={(v) => [
        `Draft report-card remarks for student "${(v.student || '').trim()}" (Class ${v.grade}, ${v.subject}).`,
        v.strengths ? `Observed strengths: ${v.strengths}.` : `Infer nothing; keep strengths generic but warm.`,
        v.areas ? `Area to improve: ${v.areas}.` : `Suggest one plausible next step.`,
        `3-5 lines, warm and specific, no comparison with other students, grade-level parent-friendly language.`,
      ].join(' ')}
      outputTitle={(v) => `Remarks · ${v.student || 'Student'}`}
    />
  );
}
