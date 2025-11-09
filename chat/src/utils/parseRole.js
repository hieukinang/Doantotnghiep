
export default function parseCompositeUserId(id) {
  if (!id || typeof id !== 'string') return null;
  const m = id.match(/^([A-Za-z]+)[_\-]?(\d+)$/);
  if (m) return { user_id: m[2], role: m[1].toUpperCase() };
  const m2 = id.match(/^([A-Za-z]+)(.+)$/);
  if (m2) return { user_id: m2[2], role: m2[1].toUpperCase() };
  return null;
}