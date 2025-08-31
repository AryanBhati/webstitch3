// Utility functions for cruise hold period calculations

export interface HoldPeriodConfig {
  duration: number;
  holdDays: number;
}

// Hold period rules based on cruise duration
const HOLD_PERIOD_RULES: HoldPeriodConfig[] = [
  { duration: 7, holdDays: 1 },   // 1 day for 7-day cruises
  { duration: 15, holdDays: 2 },  // 2 days for 15-day cruises
  { duration: Infinity, holdDays: 3 } // 3 days for longer cruises
];

/**
 * Calculate hold period based on cruise duration
 * @param cruiseDuration - Duration of cruise in nights
 * @returns Number of hold days
 */
export const calculateHoldPeriod = (cruiseDuration: number): number => {
  for (const rule of HOLD_PERIOD_RULES) {
    if (cruiseDuration <= rule.duration) {
      return rule.holdDays;
    }
  }
  return 3; // Default fallback
};

/**
 * Calculate hold expiry date
 * @param bookingDate - Date when booking was made
 * @param cruiseDuration - Duration of cruise in nights
 * @returns Hold expiry date
 */
export const calculateHoldExpiry = (bookingDate: Date, cruiseDuration: number): Date => {
  const holdDays = calculateHoldPeriod(cruiseDuration);
  const expiryDate = new Date(bookingDate);
  expiryDate.setDate(expiryDate.getDate() + holdDays);
  return expiryDate;
};

/**
 * Check if hold period is still valid
 * @param holdExpiryDate - Hold expiry date
 * @returns Boolean indicating if hold is still valid
 */
export const isHoldValid = (holdExpiryDate: Date): boolean => {
  return new Date() < holdExpiryDate;
};

/**
 * Get remaining hold time in hours
 * @param holdExpiryDate - Hold expiry date
 * @returns Remaining hours (0 if expired)
 */
export const getRemainingHoldTime = (holdExpiryDate: Date): number => {
  const now = new Date();
  const diffMs = holdExpiryDate.getTime() - now.getTime();
  const diffHours = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)));
  return diffHours;
};

/**
 * Format hold period for display
 * @param cruiseDuration - Duration of cruise in nights
 * @returns Formatted hold period string
 */
export const formatHoldPeriod = (cruiseDuration: number): string => {
  const holdDays = calculateHoldPeriod(cruiseDuration);
  return `${holdDays} day${holdDays > 1 ? 's' : ''}`;
};