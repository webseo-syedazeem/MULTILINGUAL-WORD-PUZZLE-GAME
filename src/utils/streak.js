// Single source of truth for the "7 day streak" UI used on Home,
// DailyChallenge and Profile. Previously each screen hardcoded its own
// {S,M,T done / W,T,F,S not-done} array, so it always showed 3 ticks
// regardless of the player's real streak. This derives it from real state.

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

/**
 * Returns a 7-item array describing this week, Sunday -> Saturday, where a
 * day is "done" if it falls within the trailing `streakDays` run ending
 * today (inclusive). Days after today are always not-done.
 *
 * @param {number} streakDays - total consecutive days the player has an
 *   active streak (0 if broken/none).
 * @param {Date} [today] - override for testing.
 */
export function getWeekStreak(streakDays, today = new Date()) {
  const todayIndex = today.getDay(); // 0 = Sunday
  const safeStreak = Math.max(0, Math.floor(streakDays || 0));

  return DAY_LABELS.map((label, i) => {
    if (i > todayIndex) {
      return { day: label, done: false, isToday: false };
    }
    const daysAgo = todayIndex - i; // 0 for today, 1 for yesterday, etc.
    const done = daysAgo < safeStreak && daysAgo < 7;
    return { day: label, done, isToday: i === todayIndex };
  });
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

export function isSameDay(a, b) {
  return todayKey(new Date(a)) === todayKey(new Date(b));
}

export function isYesterday(dateStr, today = new Date()) {
  const y = new Date(today);
  y.setDate(y.getDate() - 1);
  return todayKey(y) === todayKey(new Date(dateStr));
}
