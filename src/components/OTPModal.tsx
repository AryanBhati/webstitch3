import React, { useState, useEffect } from 'react';
import { X, Shield, RefreshCw } from 'lucide-react';

interface OTPModalProps {
  isOpen: boolean;
  email: string;
  onVerify: (otp: string) => Promise<boolean>;
  onResend: () => Promise<boolean>;
  onClose: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({ isOpen, email, onVerify, onResend, onClose }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isOpen && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setCanResend(true);
    }
  }, [isOpen, countdown]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      alert('Please enter complete OTP');
      return;
    }

    setLoading(true);
    try {
      const success = await onVerify(otpString);
      if (!success) {
        alert('Invalid OTP. Please try again.');
        setOtp(['', '', '', '', '', '']);
      }
    } catch (error) {
      alert('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await onResend();
      setCountdown(30);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    } catch (error) {
      alert('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl max-w-md w-full p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <Shield className="text-white" size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">OTP Verification</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <p className="text-gray-600 mb-2">
            We've sent a 6-digit verification code to
          </p>
          <p className="font-medium text-gray-800">{email}</p>
        </div>

        {/* OTP Input */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              maxLength={1}
              disabled={loading}
            />
          ))}
        </div>

        {/* Demo OTP Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-blue-800 text-sm text-center">
            <strong>Demo OTP:</strong> 123456
          </p>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6}
          className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-medium transition-colors mb-4"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>

        {/* Resend */}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={resendLoading}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mx-auto"
            >
              <RefreshCw size={16} className={resendLoading ? 'animate-spin' : ''} />
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          ) : (
            <p className="text-gray-500 text-sm">
              Resend OTP in {countdown}s
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPModal;