export function getUserRole(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.authorities && payload.authorities.length > 0) {
      return payload.authorities[0];
    }
    return null;
  } catch (e) {
    return null;
  }
}
