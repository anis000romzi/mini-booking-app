import { putAccessToken, getAccessToken, removeAccessToken } from './config.js';
import { getProfile, login, register } from './auth.js';
import {
  cancelBooking,
  createBooking,
  getAllBookings,
  getAvailableRooms,
  getOwnedBookings,
  updateBookingStatus,
} from './bookings.js';
import { createRoom, deleteRoom, getAllRooms, updateRoom } from './rooms.js';

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
  getAllBookings,
  updateBookingStatus,
  cancelBooking,
  createRoom,
  getAllRooms,
  updateRoom,
  deleteRoom,
};
