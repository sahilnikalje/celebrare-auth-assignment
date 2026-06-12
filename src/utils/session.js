const SESSION_KEY = "auth_session";
const EXPIRY_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const saveSession = (user) => {
  const loginTime = Date.now();
  const expiryTime = loginTime + EXPIRY_DURATION;

  const session = {
    user,
    loginTime,
    expiryTime,
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const getSession = () => {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  const session = JSON.parse(raw);

  if (Date.now() > session.expiryTime) {
    clearSession();
    return null;
  }

  return session;
};

export const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};