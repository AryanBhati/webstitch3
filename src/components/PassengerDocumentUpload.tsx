import React, { useState } from 'react';
import { Upload, Calendar, AlertTriangle, CheckCircle, FileText, Camera } from 'lucide-react';
import { validatePassportExpiry, validatePassportNumber, validateDateOfBirth, formatRemainingValidity } from '../utils/passportValidator';
import type { PassengerDocument, Passenger } from '../types/booking';

interface PassengerDocumentUploadProps {
  passenger: Passenger;
  onDocumentUpdate: (passengerId: string, document: PassengerDocument) => void;
}

const PassengerDocumentUpload: React.FC<PassengerDocumentUploadProps> = ({ 
  passenger, 
  onDocumentUpdate 
}) => {
  const [document, setDocument] = useState<PassengerDocument>(
    passenger.document || {
      passportNumber: '',
      frontImage: '',
      backImage: '',
      expiryDate: '',
      issueDate: '',
      dateOfBirth: passenger.dateOfBirth || '',
      isEligible: false,
      remainingValidity: 0,
      renewalRequired: false
    }
  );


  const handleFieldChange = (field: keyof PassengerDocument, value: string | File) => {
    const updatedDocument = { ...document, [field]: value };
    
    // Auto-validate when expiry date or passport number changes
    if (field === 'expiryDate' && typeof value === 'string') {
      const validation = validatePassportExpiry(value);
      updatedDocument.remainingValidity = validation.remainingMonths;
      updatedDocument.isEligible = validation.isValid;
      updatedDocument.renewalRequired = validation.renewalRequired;
    }
    
    if (field === 'passportNumber' && typeof value === 'string') {
      // Validate passport number format
      const isValidFormat = validatePassportNumber(value);
      if (!isValidFormat && value.length > 0) {
        alert('Invalid passport number format. Please enter a valid passport number.');
        return;
      }
    }
    
    if (field === 'dateOfBirth' && typeof value === 'string') {
      const dobValidation = validateDateOfBirth(value, updatedDocument.dateOfBirth);
      if (!dobValidation.isValid && value.length > 0) {
        alert(dobValidation.error);
        return;
      }
    }
    
    setDocument(updatedDocument);
    onDocumentUpdate(passenger.id, updatedDocument);
  };

  const handleFileUpload = (field: 'frontImage' | 'backImage', file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file.');
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }
    
    // In production, this would upload to cloud storage
    const fileUrl = URL.createObjectURL(file);
    handleFieldChange(field, fileUrl);
  };

  const getValidityStatus = () => {
    if (!document.expiryDate) return null;
    
    if (document.remainingValidity >= 12) {
      return { color: 'text-green-600', bg: 'bg-green-50', icon: <CheckCircle size={16} />, text: 'Valid' };
    } else if (document.remainingValidity >= 6) {
      return { color: 'text-yellow-600', bg: 'bg-yellow-50', icon: <AlertTriangle size={16} />, text: 'Expiring Soon' };
    } else {
      return { color: 'text-red-600', bg: 'bg-red-50', icon: <AlertTriangle size={16} />, text: 'Renewal Required' };
    }
  };

  const validityStatus = getValidityStatus();

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-lg border border-white/30 p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FileText size={20} />
        Passport Details - {passenger.firstName} {passenger.lastName}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Document Details */}
        <div className="space-y-4">
          {/* Passport Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passport Number *
            </label>
            <input
              type="text"
              value={document.passportNumber}
              onChange={(e) => handleFieldChange('passportNumber', e.target.value.toUpperCase())}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter passport number"
              maxLength={9}
              required
            />
            {document.passportNumber && !validatePassportNumber(document.passportNumber) && (
              <p className="text-red-600 text-xs mt-1">Invalid passport number format</p>
            )}
          </div>

          {/* Issue Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Issue Date *
            </label>
            <input
              type="date"
              value={document.issueDate}
              onChange={(e) => handleFieldChange('issueDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date *
            </label>
            <input
              type="date"
              value={document.expiryDate}
              onChange={(e) => handleFieldChange('expiryDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              value={document.dateOfBirth}
              onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>
        </div>

        {/* Right Column - Document Upload */}
        <div className="space-y-4">
          {/* Passport Front */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passport Front Page *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              {document.frontImage ? (
                <div className="space-y-2">
                  <img 
                    src={typeof document.frontImage === 'string' ? document.frontImage : URL.createObjectURL(document.frontImage)}
                    alt="Passport front"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleFieldChange('frontImage', '')}
                    className="text-red-600 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Camera size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload passport front page</p>
                  <p className="text-xs text-gray-500 mt-1">Max size: 5MB, Format: JPG, PNG</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('frontImage', e.target.files[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Passport Back */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Passport Back Page *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              {document.backImage ? (
                <div className="space-y-2">
                  <img 
                    src={typeof document.backImage === 'string' ? document.backImage : URL.createObjectURL(document.backImage)}
                    alt="Passport back"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => handleFieldChange('backImage', '')}
                    className="text-red-600 text-sm hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <Camera size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Upload passport back page</p>
                  <p className="text-xs text-gray-500 mt-1">Max size: 5MB, Format: JPG, PNG</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    onChange={(e) => e.target.files?.[0] && handleFileUpload('backImage', e.target.files[0])}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Validity Status */}
      {validityStatus && (
        <div className={`mt-6 p-4 rounded-lg border ${validityStatus.bg} ${validityStatus.color}`}>
          <div className="flex items-center gap-2 mb-2">
            {validityStatus.icon}
            <span className="font-medium">Passport Status: {validityStatus.text}</span>
          </div>
          <div className="text-sm">
            <p>Remaining validity: {formatRemainingValidity(document.remainingValidity)}</p>
            {document.renewalRequired && (
              <p className="font-medium">⚠️ Passport renewal required before travel</p>
            )}
            {document.isEligible && (
              <p className="text-green-600 font-medium">✅ Eligible for travel</p>
            )}
          </div>
        </div>
      )}
      
      {/* Validation Summary */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-medium text-blue-800 mb-2">Document Checklist:</h4>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            {document.passportNumber && validatePassportNumber(document.passportNumber) ? 
              <CheckCircle size={14} className="text-green-600" /> : 
              <AlertTriangle size={14} className="text-red-600" />
            }
            <span>Valid passport number</span>
          </div>
          <div className="flex items-center gap-2">
            {document.frontImage ? 
              <CheckCircle size={14} className="text-green-600" /> : 
              <AlertTriangle size={14} className="text-red-600" />
            }
            <span>Passport front page uploaded</span>
          </div>
          <div className="flex items-center gap-2">
            {document.backImage ? 
              <CheckCircle size={14} className="text-green-600" /> : 
              <AlertTriangle size={14} className="text-red-600" />
            }
            <span>Passport back page uploaded</span>
          </div>
          <div className="flex items-center gap-2">
            {document.isEligible ? 
              <CheckCircle size={14} className="text-green-600" /> : 
              <AlertTriangle size={14} className="text-red-600" />
            }
            <span>Minimum 6 months validity</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerDocumentUpload;