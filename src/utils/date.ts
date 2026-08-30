export function formatMonthYear(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function formatDateRange(start: string, end: string | null): string {
  const startLabel = formatMonthYear(start);
  const endLabel = end ? formatMonthYear(end) : 'Present';
  return `${startLabel} — ${endLabel}`;
}

export function formatFullDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

// admin pastes a block of text, we split it into bullet lines
export function toBulletList(text: string | null | undefined): string[] {
  if (!text) return [];
  return text
    .split('\n')
    .map((line) => line.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean);
}
