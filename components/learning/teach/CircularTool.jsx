'use client';

import TeachDraft from '../TeachDraft';

export default function CircularTool() {
  return (
    <TeachDraft
      demo="circular"
      tile="PC"
      eyebrow="TEACH WITH AI • PARENT COMMS"
      title="Parent circular"
      sub="Formal circular plus a 160-character SMS plus a Hindi version — ready for you to send."
      route="/dashboard/teach/circular"
      cta="Draft circular"
      requireNote="Draft only — check dates, names and amounts, then send from the school channel yourself."
      emptySteps={['Give brief', 'Draft + SMS', 'Send it']}
      initial={{ topic: '', audience: 'All parents', date: '', details: '' }}
      fields={[
        { key: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. PTM on Saturday', required: true },
        { key: 'audience', label: 'Audience', type: 'text', placeholder: 'All parents / Class VII' },
        { key: 'date', label: 'Date / time', type: 'text', placeholder: 'e.g. 12 Oct, 9 AM' },
        { key: 'details', label: 'One-line brief', type: 'textarea', placeholder: 'e.g. PTM to discuss Half-yearly results; bring report cards', required: true },
      ]}
      brief={(v) => [
        `Draft a parent circular plus a 160-character SMS plus a Hindi version.`,
        `Topic: ${(v.topic || '').trim()}. Audience: ${v.audience || 'parents'}. Date/time: ${v.date || 'TBD'}.`,
        `Brief: ${(v.details || '').trim()}. Formal school tone, placeholders for [School Name] and [Signatory].`,
        `SMS must fit 160 characters — state it and keep it under the limit.`,
      ].join(' ')}
      outputTitle={(v) => `Circular · ${v.topic || 'Parents'}`}
    />
  );
}
