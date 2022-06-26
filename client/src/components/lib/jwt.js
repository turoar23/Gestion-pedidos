import jwtDecode from 'jwt-decode';

export function setJwt(JWToken) {
  window.localStorage.setItem('jwtoken', JWToken);
}

export function getJwt() {
  return window.localStorage.getItem('jwtoken');
}

export function removeJwt() {
  window.localStorage.removeItem('jwtoken');
}

export function getUser() {
  const token = getJwt();

  if (!token) return null;

  return jwtDecode(token).user;
}
