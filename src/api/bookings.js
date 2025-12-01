import { BASE_URL, fetchWithAuth } from './config.js';

export async function createBooking({ roomId, startAt, endAt }) {
  const response = await fetchWithAuth(`${BASE_URL}/booking/create-booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ roomId, startAt, endAt }),
  });

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data;
}

export async function getAvailableDates() {
  const response = await fetchWithAuth(
    `${BASE_URL}/booking/get-available-dates`
  );

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data;
}

export async function getAvailableRooms(startAt, endAt) {
  const response = await fetchWithAuth(
    `${BASE_URL}/booking/get-available-rooms?startAt=${startAt}&endAt=${endAt}`
  );

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data;
}

export async function getAllBookings() {
  const response = await fetchWithAuth(
    `${BASE_URL}/booking/all-bookings?page=1&limit=100&order=desc&orderBy=id`
  );

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data.data;
}

export async function getOwnedBookings(
  page = 1,
  limit = 10,
  order = 'desc',
  orderBy = 'id'
) {
  const response = await fetchWithAuth(
    `${BASE_URL}/booking/my-bookings?page=${page}&limit=${limit}&order=${order}&orderBy=${orderBy}`
  );

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data; // Assuming this contains data and pagination info
}

export async function updateBookingsuccess({ bookingId, status }) {
  const response = await fetchWithAuth(
    `${BASE_URL}/booking/update-success/${bookingId}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    }
  );

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data;
}
