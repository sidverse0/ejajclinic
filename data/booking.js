// Booking rules. Edit these to match the clinic. All times are Indian Standard Time.
export const booking = {
  slotMinutes: 15,        // length of one appointment slot
  advanceDays: 14,        // how many days ahead patients can book (including today)
  minLeadMinutes: 60,     // a same-day slot must start at least this many minutes from now
  holdMinutes: 10,        // an unpaid online booking holds the slot for this long
  defaultFee: 500,        // TODO: confirm the real consultation fee (in rupees)
  // TODO: confirm real OPD sessions per doctor. By default every doctor is bookable during OPD hours
  // on their listed days. Example of a split day: [{ start: '10:00', end: '14:00' }, { start: '17:00', end: '20:00' }]
  sessions: [{ start: '09:00', end: '21:00' }],
  // Per doctor overrides, for example:
  // 'dr-shahzad-ali': { fee: 800, sessions: [{ start: '10:00', end: '13:00' }] },
  doctorOverrides: {},
};
