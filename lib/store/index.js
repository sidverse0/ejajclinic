import * as file from './file.js';
import * as supabase from './supabase.js';

// STORE=supabase in production. Anything else uses the local file database.
const impl = process.env.STORE === 'supabase' ? supabase : file;

export const getBookings = (...a) => impl.getBookings(...a);
export const getBooking = (...a) => impl.getBooking(...a);
export const getBookingByOrder = (...a) => impl.getBookingByOrder(...a);
export const getTakenSlots = (...a) => impl.getTakenSlots(...a);
export const createBooking = (...a) => impl.createBooking(...a);
export const updateBooking = (...a) => impl.updateBooking(...a);
export const getBlocks = (...a) => impl.getBlocks(...a);
export const addBlock = (...a) => impl.addBlock(...a);
export const removeBlock = (...a) => impl.removeBlock(...a);
export { SlotTakenError } from './common.js';
