import { BASE_URL, fetchWithAuth } from './config.js';

export async function createRoom({ roomName, available }) {
  const response = await fetchWithAuth(`${BASE_URL}/room`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ roomName, available }),
  });

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data;
}

export async function getAllRooms(
  page = 1,
  limit = 10,
  order = 'desc',
  orderBy = 'id'
) {
  const response = await fetchWithAuth(
    `${BASE_URL}/room?page=${page}&limit=${limit}&order=${order}&orderBy=${orderBy}`
  );

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data;
}

export async function getRoomById(id) {
  const response = await fetchWithAuth(`${BASE_URL}/room/${id}`);

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data;
}

export async function updateRoom({ roomId, roomName, available }) {
  const response = await fetchWithAuth(`${BASE_URL}/room/${roomId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ roomName, available }),
  });

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data;
}

export async function deleteRoom(roomId) {
  const response = await fetchWithAuth(`${BASE_URL}/room/${roomId}`, {
    method: 'DELETE',
  });

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data;
}
