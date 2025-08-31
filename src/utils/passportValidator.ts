// Utility functions for passport validation

export interface PassportValidation {
  isValid: boolean;
  remainingMonths: number;
  renewalRequired: boolean;
  errors: string[];
}

/**
 * Validate passport expiry date
 * @param expiryDate - Passport expiry date string
 * @param travelDate - Planned travel date string (optional)
 * @returns Validation result
 */
export const validatePassportExpiry = (
  expiryDate: string, 
  travelDate?: string
): PassportValidation => {
  const errors: string[] = [];
  
  if (!expiryDate) {
    return {
      isValid: false,
      remainingMonths: 0,
      renewalRequired: true,
      errors: ['Passport expiry date is required']
    };
  }

  const expiry = new Date(expiryDate);
  const now = new Date();
  const travel = travelDate ? new Date(travelDate) : now;

  // Check if passport is already expired
  if (expiry <= now) {
    errors.push('Passport has already expired');
    return {
      isValid: false,
      remainingMonths: 0,
      renewalRequired: true,
      errors
    };
  }

  // Calculate remaining validity in months
  const diffTime = expiry.getTime() - now.getTime();
  const remainingMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));

  // Check minimum 6-month validity requirement
  const travelTime = travel.getTime() - now.getTime();
  const monthsUntilTravel = Math.ceil(travelTime / (1000 * 60 * 60 * 24 * 30));
  const validityAtTravel = remainingMonths - monthsUntilTravel;

  if (validityAtTravel < 6) {
    errors.push('Passport must have at least 6 months validity from travel date');
  }

  const isValid = errors.length === 0 && remainingMonths >= 6;
  const renewalRequired = remainingMonths < 6;

  return {
    isValid,
    remainingMonths: Math.max(0, remainingMonths),
    renewalRequired,
    errors
  };
};

/**
 * Validate passport number format
 * @param passportNumber - Passport number string
 * @returns Boolean indicating if format is valid
 */
export const validatePassportNumber = (passportNumber: string): boolean => {
  if (!passportNumber) return false;
  
  // Basic validation - alphanumeric, 6-9 characters
  const passportRegex = /^[A-Z0-9]{6,9}$/;
  return passportRegex.test(passportNumber.toUpperCase());
};

/**
 * Validate date of birth
 * @param dateOfBirth - Date of birth string
 * @param passportDOB - Date of birth from passport (optional)
 * @returns Validation result
 */
export const validateDateOfBirth = (
  dateOfBirth: string, 
  passportDOB?: string
): { isValid: boolean; error?: string } => {
  if (!dateOfBirth) {
    return { isValid: false, error: 'Date of birth is required' };
  }

  const dob = new Date(dateOfBirth);
  const now = new Date();

  // Check if date is in the future
  if (dob > now) {
    return { isValid: false, error: 'Date of birth cannot be in the future' };
  }

  // Check minimum age (must be at least 1 year old)
  const age = now.getFullYear() - dob.getFullYear();
  if (age < 1) {
    return { isValid: false, error: 'Passenger must be at least 1 year old' };
  }

  // Check if DOB matches passport DOB (if provided)
  if (passportDOB && dateOfBirth !== passportDOB) {
    return { 
      isValid: false, 
      error: 'Date of birth does not match passport information' 
    };
  }

  return { isValid: true };
};

/**
 * Calculate age from date of birth
 * @param dateOfBirth - Date of birth string
 * @returns Age in years
 */
export const calculateAge = (dateOfBirth: string): number => {
  if (!dateOfBirth) return 0;
  
  const dob = new Date(dateOfBirth);
  const now = new Date();
  const age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    return age - 1;
  }
  
  return age;
};

/**
 * Format remaining validity for display
 * @param remainingMonths - Remaining validity in months
 * @returns Formatted string
 */
export const formatRemainingValidity = (remainingMonths: number): string => {
  if (remainingMonths <= 0) return 'Expired';
  if (remainingMonths < 12) return `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
  
  const years = Math.floor(remainingMonths / 12);
  const months = remainingMonths % 12;
  
  if (months === 0) return `${years} year${years > 1 ? 's' : ''}`;
  return `${years}y ${months}m`;
};