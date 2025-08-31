export interface PassengerDocument {
  passportNumber: string;
  frontImage: File | string;
  backImage: File | string;
  expiryDate: string;
  issueDate: string;
  dateOfBirth: string;
  isEligible: boolean;
  remainingValidity: number; // in months
  renewalRequired: boolean;
}

export interface Passenger {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  document: PassengerDocument;
}

export interface BookingDetails {
  id: string;
  type: 'cruise' | 'hotel' | 'flight';
  itemId: string;
  itemName: string;
  agentId: string;
  passengers: Passenger[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  holdExpiry?: string;
  bookingDate: string;
  travelDate: string;
}

export interface CruiseBooking extends BookingDetails {
  cabinCategory: string;
  cabinNumber?: string;
  departureDate: string;
  duration: number;
  holdPeriod: number; // days based on cruise duration
}

export interface HotelBooking extends BookingDetails {
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  numberOfNights: number;
}