export function getToken() {
  try { return localStorage.getItem('token') }
  catch { return null }
}

export function setToken(token) {
  try { localStorage.setItem('token', token) } catch {}
}

export function clearToken() {
  try { localStorage.removeItem('token') } catch {}
}

export function isAuthenticated() {
  return !!getToken()
}
