import { BASE_URL, fetchWithAuth } from './config.js';

export async function register({
  firstName,
  lastName,
  userName,
  email,
  password,
}) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ firstName, lastName, userName, email, password }),
  });

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data.user;
}

export async function login({ email, password }) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const responseJson = await response.json();

  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  const {
    data: { access_token },
  } = responseJson;

  return access_token;
}

export async function getProfile() {
  const response = await fetchWithAuth(`${BASE_URL}/auth/profile`);

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data.user;
}
