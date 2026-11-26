export class SlotTakenError extends Error {
  constructor(message = 'That slot is no longer available.') {
    super(message);
    this.name = 'SlotTakenError';
  }
}

// A booking blocks its slot when it is confirmed, or when it is an unpaid online booking still inside its hold time.
export function isActive(b, nowMs = Date.now()) {
  if (b.status === 'confirmed') return true;
  if (b.status === 'pending_payment') {
    return !!b.hold_expires_at && new Date(b.hold_expires_at).getTime() > nowMs;
  }
  return false;
}
