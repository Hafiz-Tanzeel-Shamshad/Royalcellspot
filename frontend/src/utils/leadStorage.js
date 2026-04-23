const LEAD_KEY = 'royalcellspot-lead';
const DEFAULT_TTL_MS = 60 * 60 * 1000; // 1 hour

export const clearLead = () => {
  try {
    localStorage.removeItem(LEAD_KEY);
  } catch {
    // ignore
  }
};

export const getLead = () => {
  try {
    const raw = localStorage.getItem(LEAD_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.email || !parsed.phone) return null;

    const expiresAt = typeof parsed.expiresAt === 'number' ? parsed.expiresAt : null;
    if (expiresAt && Date.now() >= expiresAt) {
      clearLead();
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

export const setLead = ({ email, phone, ttlMs = DEFAULT_TTL_MS }) => {
  const expiresAt = Date.now() + ttlMs;

  try {
    localStorage.setItem(LEAD_KEY, JSON.stringify({ email, phone, expiresAt }));
  } catch {
    // ignore
  }

  // Auto-remove after expiry (works while tab is open)
  try {
    window.setTimeout(() => {
      const lead = getLead();
      if (!lead) return;
      if (typeof lead.expiresAt === 'number' && Date.now() >= lead.expiresAt) {
        clearLead();
      }
    }, ttlMs + 50);
  } catch {
    // ignore
  }

  return { expiresAt };
};
