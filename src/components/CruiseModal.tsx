import React, { useState } from 'react';
import { X, Calendar, Users, Bed, Ship, Star, Download } from 'lucide-react';
import ReviewSystem from './ReviewSystem';
import PassengerDocumentUpload from './PassengerDocumentUpload';
import PDFExport from './PDFExport';
import { Cruise } from '../data/cruises';
import type { Passenger } from '../types/booking';

interface CruiseModalProps {
  cruise: Cruise;
  onClose: () => void;
  onBookingSuccess?: (cruiseId: string) => void;
  isBooked?: boolean;
}

interface BookingForm {
  departureDate: string;
  roomType: string;
  mealPlan: string;
  passengerCount: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const CruiseModal: React.FC<CruiseModalProps> = ({ cruise, onClose, onBookingSuccess, isBooked = false }) => {
  // Booking flow state
  const [currentStep, setCurrentStep] = useState<'details' | 'selection' | 'booking-details' | 'documents' | 'confirmation'>(isBooked ? 'confirmation' : 'details');
  
  // Loading state
  const [loading, setLoading] = useState(false);
  
  // Passengers state
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  
  // Form state
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    departureDate: cruise.departureDates[0],
    roomType: cruise.roomTypes[0],
    mealPlan: cruise.mealPlans[0],
    passengerCount: 2,
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Cabin category pricing multipliers
  const cabinPricing = {
    'Interior': 1.0,
    'Ocean View': 1.3,
    'Balcony': 1.6,
    'Suite': 2.2,
    'Penthouse': 3.0
  };

  // Calculate hold period based on cruise duration
  const getHoldPeriod = () => {
    if (cruise.duration <= 7) return 1; // 1 day for short cruises
    if (cruise.duration <= 14) return 2; // 2 days for medium cruises
    return 3; // 3 days for long cruises
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = cruise.pricePerPerson;
    const cabinMultiplier = cabinPricing[bookingForm.roomType as keyof typeof cabinPricing] || 1.0;
    
    return basePrice * cabinMultiplier * bookingForm.passengerCount;
  };

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Handle form field changes
  const handleFormChange = (field: keyof BookingForm, value: string | number) => {
    setBookingForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Initialize passengers when count changes
    if (field === 'passengerCount') {
      const newPassengers: Passenger[] = Array.from({ length: value as number }, (_, index) => ({
        id: `passenger-${index + 1}`,
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        nationality: 'Indian',
        document: {
          passportNumber: '',
          frontImage: '',
          backImage: '',
          expiryDate: '',
          issueDate: '',
          dateOfBirth: '',
          isEligible: false,
          remainingValidity: 0,
          renewalRequired: false
        }
      }));
      setPassengers(newPassengers);
    }
  };
  
  // Handle passenger document update
  const handleDocumentUpdate = (passengerId: string, document: any) => {
    setPassengers(prev => prev.map(p => 
      p.id === passengerId ? { ...p, document } : p
    ));
  };

  // Handle next step
  const handleNext = () => {
    setCurrentStep('details');
  };

  // Handle booking submission
  const handleBookNow = async () => {
    if (isBooked) {
      onClose();
      return;
    }
    
    // Validate form
    if (!bookingForm.name || !bookingForm.email || !bookingForm.phone || !bookingForm.address) {
      alert('Please fill in all required fields.');
      return;
    }
    
    // Validate all passengers have valid documents
    const invalidPassengers = passengers.filter(p => !p.document.isEligible);
    if (invalidPassengers.length > 0) {
      alert(`${invalidPassengers.length} passenger(s) have invalid or expired passports. Please update documents.`);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookingForm.email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(bookingForm.phone.replace(/\D/g, ''))) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Show confirmation step
      setCurrentStep('confirmation');
      
      // Calculate hold expiry
      const holdDays = getHoldPeriod();
      const holdExpiry = new Date();
      holdExpiry.setDate(holdExpiry.getDate() + holdDays);
      
      // Call success callback
      if (onBookingSuccess) {
        onBookingSuccess(cruise.id);
      }
      
      // Auto close after showing confirmation
      setTimeout(() => {
        onClose();
      }, 3000);
      
    } catch (error) {
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle modal backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {cruise.name}
            {isBooked && <span className="ml-2 text-green-600 text-lg">(Booked)</span>}
          </h2>
          
          {/* Tab Navigation */}
          {!isBooked && (
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep('details')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  currentStep === 'details' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Details
              </button>
              <button
                onClick={() => setCurrentStep('selection')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  currentStep === 'selection' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                Book Now
              </button>
            </div>
          )}
          
          {/* PDF Export Button */}
          <PDFExport 
            data={cruise} 
            type="cruise" 
            bookingDetails={isBooked ? { 
              id: 'BK001', 
              bookingDate: new Date().toISOString(),
              travelDate: bookingForm.departureDate,
              totalAmount: calculateTotalPrice(),
              passengers
            } : undefined} 
          />
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {/* Cruise Details Tab */}
          {currentStep === 'details' && (
            <div>
              {/* Cruise Details Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Left Column - Image and Basic Info */}
            <div>
              <img
                src={cruise.image}
                alt={cruise.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <Ship size={20} />
                  <span><strong>Route:</strong> {cruise.from} → {cruise.to}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar size={20} />
                  <span><strong>Duration:</strong> {cruise.duration} nights</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Star size={20} />
                  <span><strong>Ship Type:</strong> {cruise.shipType}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Amenities and Description */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Description</h3>
              <p className="text-gray-700 mb-4">{cruise.description}</p>
              
              <h3 className="text-lg font-semibold mb-3">Ship Amenities</h3>
              <div className="grid grid-cols-2 gap-2">
                {cruise.amenities.map((amenity, index) => (
                  <span key={index} className="text-sm bg-blue-50 text-blue-800 px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </div>
              
              {/* Action Button */}
              <div className="text-center">
                <button
                  onClick={() => setCurrentStep('selection')}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  Book This Cruise
                </button>
              </div>
            </div>
          )}

          {/* Booking Confirmation Step */}
          {currentStep === 'confirmation' && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-white" size={40} />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-4">
                {isBooked ? 'Booking Details' : 'Booking Confirmed!'}
              </h3>
              {!isBooked && (
                <p className="text-gray-600 mb-6">
                  Thank you for booking with us! Your cruise reservation has been confirmed.
                </p>
              )}
              
              <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto text-left">
                <h4 className="font-semibold text-gray-800 mb-3">Booking Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Cruise:</span>
                    <span className="font-medium">{cruise.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure:</span>
                    <span>{new Date(bookingForm.departureDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cabin Category:</span>
                    <span>{bookingForm.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span>{bookingForm.passengerCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hold Period:</span>
                    <span>{getHoldPeriod()} day(s)</span>
                  </div>
                  <hr className="my-3" />
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total Paid:</span>
                    <span>{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>
              </div>
              
              {!isBooked && (
                <p className="text-sm text-gray-500 mt-4">
                  A confirmation email has been sent to {bookingForm.email}
                </p>
              )}
            </div>
          )}
          {/* Selection Step */}
          {currentStep === 'selection' && !isBooked && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Selection Options */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Customize Your Booking</h3>
                
                {/* Departure Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar size={16} />
                    Departure Date
                  </label>
                  <select
                    value={bookingForm.departureDate}
                    onChange={(e) => handleFormChange('departureDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {cruise.departureDates.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cabin Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Bed size={16} />
                    Cabin Category
                  </label>
                  <select
                    value={bookingForm.roomType}
                    onChange={(e) => handleFormChange('roomType', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {cruise.roomTypes.map((type) => (
                      <option key={type} value={type}>
                        {type} - {Math.round((cabinPricing[type as keyof typeof cabinPricing] || 1) * 100 - 100)}% {(cabinPricing[type as keyof typeof cabinPricing] || 1) > 1 ? 'premium' : 'standard'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Passenger Count */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Users size={16} />
                    Number of Passengers
                  </label>
                  <select
                    value={bookingForm.passengerCount}
                    onChange={(e) => handleFormChange('passengerCount', Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6].map((count) => (
                      <option key={count} value={count}>
                        {count} {count === 1 ? 'Passenger' : 'Passengers'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Column - Booking Summary */}
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Cruise:</span>
                    <span className="font-medium">{cruise.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure:</span>
                    <span>{new Date(bookingForm.departureDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cabin Category:</span>
                    <span>{bookingForm.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span>{bookingForm.passengerCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hold Period:</span>
                    <span>{getHoldPeriod()} day(s)</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total Price:</span>
                    <span>{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep('booking-details')}
                  className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
                >
                  Next: Passenger Details
                </button>
              </div>
            </div>
          )}

          {/* Details Step */}
          {currentStep === 'booking-details' && !isBooked && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Passenger Form */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setCurrentStep('selection')}
                    className="text-blue-500 hover:text-blue-600 font-medium"
                  >
                    ← Back to Selection
                  </button>
                  <h3 className="text-xl font-semibold text-gray-800">Passenger Details</h3>
                </div>

                {/* Passenger Information Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={bookingForm.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                    <input
                      type="email"
                      value={bookingForm.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter email address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                    <input
                      type="tel"
                      value={bookingForm.phone}
                      onChange={(e) => handleFormChange('phone', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter 10-digit phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                    <textarea
                      value={bookingForm.address}
                      onChange={(e) => handleFormChange('address', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
                      placeholder="Enter complete address"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Summary (Repeated) */}
              <div className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Final Summary</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Cruise:</span>
                    <span className="font-medium">{cruise.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Departure:</span>
                    <span>{new Date(bookingForm.departureDate).toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cabin Category:</span>
                    <span>{bookingForm.roomType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Passengers:</span>
                    <span>{bookingForm.passengerCount}</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="flex justify-between text-lg font-bold text-green-600">
                    <span>Total Price:</span>
                    <span>{formatPrice(calculateTotalPrice())}</span>
                  </div>
                </div>

                <button
                  onClick={() => setCurrentStep('documents')}
                  className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 font-medium"
                >
                  Next: Document Upload
                </button>
              </div>
            </div>
          )}
          
          {/* Document Upload Step */}
          {currentStep === 'documents' && !isBooked && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={() => setCurrentStep('booking-details')}
                  className="text-blue-500 hover:text-blue-600 font-medium"
                >
                  ← Back to Details
                </button>
                <h3 className="text-xl font-semibold text-gray-800">Passport Verification</h3>
              </div>
              
              {/* Passenger Documents */}
              {passengers.map((passenger, index) => (
                <div key={passenger.id}>
                  <h4 className="text-lg font-medium text-gray-800 mb-4">
                    Passenger {index + 1}
                  </h4>
                  
                  {/* Basic passenger info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={passenger.firstName}
                      onChange={(e) => {
                        const updatedPassengers = [...passengers];
                        updatedPassengers[index].firstName = e.target.value;
                        setPassengers(updatedPassengers);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={passenger.lastName}
                      onChange={(e) => {
                        const updatedPassengers = [...passengers];
                        updatedPassengers[index].lastName = e.target.value;
                        setPassengers(updatedPassengers);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      placeholder="Date of Birth"
                      value={passenger.dateOfBirth}
                      onChange={(e) => {
                        const updatedPassengers = [...passengers];
                        updatedPassengers[index].dateOfBirth = e.target.value;
                        setPassengers(updatedPassengers);
                      }}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <PassengerDocumentUpload
                    passenger={passenger}
                    onDocumentUpdate={handleDocumentUpdate}
                  />
                </div>
              ))}
              
              {/* Continue Button */}
              <div className="text-center">
                <button
                  onClick={handleBookNow}
                  disabled={loading || passengers.some(p => !p.document.isEligible)}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 px-8 rounded-lg font-medium transition-colors"
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CruiseModal;