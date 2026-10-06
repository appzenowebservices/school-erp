'use client';

/** Load a sample draft published under /public/demo-drafts (see ai-agent/testdata/publish_drafts.py). */
export async function loadDemoDraft(name) {
  if (!name) return '';
  try {
    const r = await fetch(`/demo-drafts/${name}.md`, { cache: 'no-store' });
    if (!r.ok) return '';
    return await r.text();
  } catch {
    return '';
  }
}
