import React from 'react';
import { Download, FileText } from 'lucide-react';
import type { Cruise } from '../data/cruises';
import type { Hotel } from '../data/hotels';

interface PDFExportProps {
  data: Cruise | Hotel;
  type: 'cruise' | 'hotel';
  bookingDetails?: any;
}

const PDFExport: React.FC<PDFExportProps> = ({ data, type, bookingDetails }) => {
  const generatePDF = () => {
    // Create PDF content
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${type === 'cruise' ? 'Cruise' : 'Hotel'} Details - ${data.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; color: #333; }
          .header { text-align: center; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { color: #3B82F6; font-size: 24px; font-weight: bold; }
          .section { margin-bottom: 25px; }
          .section h3 { color: #3B82F6; border-bottom: 1px solid #E5E7EB; padding-bottom: 5px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #F3F4F6; }
          .detail-label { font-weight: bold; }
          .amenities { display: flex; flex-wrap: wrap; gap: 8px; }
          .amenity { background: #EFF6FF; color: #1D4ED8; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
          .booking-summary { background: #F0FDF4; padding: 20px; border-radius: 8px; border: 1px solid #BBF7D0; }
          .total-price { font-size: 24px; font-weight: bold; color: #059669; text-align: center; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Yorker Holidays</div>
          <h1>${data.name}</h1>
          <p>Generated on ${new Date().toLocaleDateString('en-IN')}</p>
        </div>

        <div class="section">
          <h3>${type === 'cruise' ? 'Cruise' : 'Hotel'} Information</h3>
          <div class="grid">
            <div>
              ${type === 'cruise' ? `
                <div class="detail-row">
                  <span class="detail-label">Route:</span>
                  <span>${(data as Cruise).from} → ${(data as Cruise).to}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Duration:</span>
                  <span>${(data as Cruise).duration} nights</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Ship Type:</span>
                  <span>${(data as Cruise).shipType}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Cruise Line:</span>
                  <span>${(data as Cruise).cruiseLine}</span>
                </div>
              ` : `
                <div class="detail-row">
                  <span class="detail-label">Location:</span>
                  <span>${(data as Hotel).location}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Star Rating:</span>
                  <span>${(data as Hotel).starRating} Stars</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Hotel Type:</span>
                  <span>${(data as Hotel).hotelType}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Hotel Chain:</span>
                  <span>${(data as Hotel).hotelChain}</span>
                </div>
              `}
            </div>
            <div>
              <div class="detail-row">
                <span class="detail-label">Price per ${type === 'cruise' ? 'Person' : 'Night'}:</span>
                <span>₹${type === 'cruise' ? (data as Cruise).pricePerPerson : (data as Hotel).pricePerNight}</span>
              </div>
              ${type === 'cruise' ? `
                <div class="detail-row">
                  <span class="detail-label">Available Cabins:</span>
                  <span>${(data as Cruise).roomTypes.join(', ')}</span>
                </div>
              ` : `
                <div class="detail-row">
                  <span class="detail-label">Room Types:</span>
                  <span>${(data as Hotel).availableRoomTypes.join(', ')}</span>
                </div>
              `}
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Description</h3>
          <p>${data.description}</p>
        </div>

        <div class="section">
          <h3>Amenities</h3>
          <div class="amenities">
            ${data.amenities.map(amenity => `<span class="amenity">${amenity}</span>`).join('')}
          </div>
        </div>

        ${bookingDetails ? `
          <div class="section">
            <h3>Booking Summary</h3>
            <div class="booking-summary">
              <div class="detail-row">
                <span class="detail-label">Booking ID:</span>
                <span>${bookingDetails.id}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Booking Date:</span>
                <span>${new Date(bookingDetails.bookingDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Travel Date:</span>
                <span>${new Date(bookingDetails.travelDate).toLocaleDateString('en-IN')}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Passengers:</span>
                <span>${bookingDetails.passengers?.length || 1}</span>
              </div>
              <div class="total-price">
                Total Amount: ₹${bookingDetails.totalAmount?.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        ` : ''}

        <div class="section">
          <p style="text-align: center; color: #6B7280; font-size: 12px;">
            This document was generated by Yorker Holidays CRM System<br>
            For support, contact: support@yorkeholidays.com | +91 98765 43210
          </p>
        </div>
      </body>
      </html>
    `;

    // Create and download PDF
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.name.replace(/\s+/g, '_')}_details.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={generatePDF}
      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
    >
      <Download size={18} />
      <span>Download PDF</span>
    </button>
  );
};

export default PDFExport;