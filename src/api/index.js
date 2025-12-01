import { putAccessToken, getAccessToken, removeAccessToken } from './config.js';
import { getProfile, login, register } from './auth.js';
import {
  createBooking,
  getAvailableRooms,
  getOwnedBookings,
} from './bookings.js';

export default {
  putAccessToken,
  getAccessToken,
  removeAccessToken,
  register,
  login,
  getProfile,
  createBooking,
  getAvailableRooms,
  getOwnedBookings,
};
