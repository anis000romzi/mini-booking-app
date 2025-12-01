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

export async function getAllBookings(
  page = 1,
  limit = 10,
  order = 'desc',
  orderBy = 'id'
) {
  const response = await fetchWithAuth(
    `${BASE_URL}/booking/all-bookings?page=${page}&limit=${limit}&order=${order}&orderBy=${orderBy}`
  );

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data;
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

  return responseJson.data;
}

export async function updateBookingStatus({ bookingId, status }) {
  const response = await fetchWithAuth(
    `${BASE_URL}/booking/update-status/${bookingId}`,
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

export async function cancelBooking(bookingId) {
  const response = await fetchWithAuth(
    `${BASE_URL}/booking/cancel/${bookingId}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const responseJson = await response.json();
  const { success, message } = responseJson;

  if (!success) {
    throw new Error(message);
  }

  return responseJson.data;
}
