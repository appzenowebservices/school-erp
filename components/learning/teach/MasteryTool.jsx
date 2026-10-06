'use client';

import TeachDraft from '../TeachDraft';

export default function MasteryTool() {
  return (
    <TeachDraft
      demo="mastery"
      tile="MM"
      eyebrow="TEACH WITH AI • CLASS INSIGHT"
      title="Class mastery map"
      sub="≥75 / 50–74 / <50 buckets with a reteach move and worksheet brief per bucket — roll numbers only, no names."
      route="/dashboard/teach/mastery"
      cta="Build mastery map"
      requireNote="Aggregate guidance only — pull real marks from report cards first; names stay in the teacher channel."
      emptySteps={['Set class', 'Map buckets', 'Reteach']}
      initial={{ grade: '7', section: 'A', subject: 'Science' }}
      fields={[
        { key: 'grade', label: 'Class', type: 'text', placeholder: '7', required: true },
        { key: 'section', label: 'Section', type: 'text', placeholder: 'A' },
        { key: 'subject', label: 'Subject', type: 'text', placeholder: 'Science', required: true },
      ]}
      brief={(v) => [
        `Build a mastery map template for Class ${v.grade}-${v.section || 'A'}, subject ${v.subject}.`,
        `Structure: three buckets (≥75% mastered, 50–74% developing, <50% needs support) with how to`,
        `place students from real marks, one reteach move per bucket, and a worksheet brief per bucket.`,
        `Use roll numbers only, never names. End with 3 questions I can ask the class tomorrow.`,
      ].join(' ')}
      outputTitle={(v) => `Mastery · ${v.grade}-${v.section || 'A'} ${v.subject}`}
    />
  );
}
