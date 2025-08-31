import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  User, 
  LogOut, 
  Edit3, 
  Calendar,
  DollarSign,
  TrendingUp,
  Award,
  FileText,
  BarChart3,
  CheckCircle,
  Star,
  EyeOff
} from 'lucide-react';
import NotificationSystem from './NotificationSystem';

interface AgentPortalProps {
  userRole: string;
  onLogout: () => void;
  onBack: () => void;
}

const AgentPortal: React.FC<AgentPortalProps> = ({ userRole, onLogout, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  // Mock agent data - in real app this would come from API
  const agentData = {
    fullName: 'John Smith',
    email: 'agent@cruise.com',
    role: 'Agent',
    commissionRate: 5,
    status: 'Active',
    joinedDate: 'January 15, 2024',
    totalEarned: 255.84,
    averagePerBooking: 255.84,
    totalBookings: 1,
    totalSales: 3198,
    confirmedBookings: 1,
    commissionEarned: 255.84,
    successRate: 100
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Handle quick actions
  const handleQuickAction = (action: string) => {
    alert(`${action} functionality would be implemented here!`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white/20 backdrop-blur-md border-b border-white/30 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Agent Portal Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Home size={24} />
                <span className="text-xl font-bold">Agent Portal</span>
              </button>
            </div>

            {/* Center - Welcome Message */}
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-gray-800">
                Welcome back, {agentData.fullName}
              </h2>
            </div>

            {/* Right - Search and Navigation */}
            <div className="flex items-center gap-4">
              {/* Notification System */}
              <NotificationSystem userId="ag1" />
              
              {/* Search Box */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search Cruises"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/70 border border-white/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
                />
              </div>

              {/* Navigation Links */}
              <button className="text-gray-600 hover:text-gray-800 transition-colors font-medium">
                My Bookings
              </button>
              <button className="text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-lg">
                Profile
              </button>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors font-medium"
              >
                <LogOut size={18} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
              { key: 'performance', label: 'Performance', icon: <TrendingUp size={18} /> }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white/30 text-gray-700 hover:bg-white/50'
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Information Card - Left Panel */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-8">
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-xl font-bold text-gray-800">Profile Information</h3>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                <Edit3 size={18} />
                <span>Edit</span>
              </button>
            </div>

            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {getInitials(agentData.fullName)}
              </div>
              <div>
                <h4 className="text-2xl font-bold text-gray-800">{agentData.fullName}</h4>
                <p className="text-gray-600">{agentData.email}</p>
              </div>
            </div>

            {/* Profile Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Full Name:</span>
                <span className="text-gray-800 font-semibold">{agentData.fullName}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Email:</span>
                <span className="text-gray-800 font-semibold">{agentData.email}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Role:</span>
                <span className="text-gray-800 font-semibold">{agentData.role}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-200">
                <span className="text-gray-600 font-medium">Status:</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {agentData.status}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-600 font-medium">Joined Date:</span>
                <span className="text-gray-800 font-semibold">{agentData.joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Booking Statistics Card - Right Panel */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Booking Statistics</h3>
            
            {/* Commission visibility hidden for agents */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <EyeOff className="text-gray-500" size={24} />
                <span className="text-gray-600 font-medium">Commission Details</span>
              </div>
              <p className="text-gray-500 text-sm">Commission information is managed by your administrator</p>
            </div>
            
            {/* Booking Performance */}
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-2xl font-bold text-blue-600">{agentData.totalBookings}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-600">{agentData.confirmedBookings}</div>
                <div className="text-sm text-gray-600">Confirmed Bookings</div>
              </div>
              
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="text-2xl font-bold text-purple-600">{agentData.successRate}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Performance Overview Card - Bottom Left Panel */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Performance Overview</h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{agentData.totalBookings}</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div className="bg-white/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-gray-800">{formatCurrency(agentData.totalSales)}</div>
                <div className="text-sm text-gray-600">Total Sales</div>
              </div>
              <div className="bg-white/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{agentData.confirmedBookings}</div>
                <div className="text-sm text-gray-600">Confirmed</div>
              </div>
              <div className="bg-white/50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {formatCurrency(agentData.commissionEarned)}
                </div>
                <div className="text-sm text-gray-600">Commission Earned</div>
              </div>
            </div>

            {/* Success Rate Progress Bar */}
            <div className="bg-white/50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700 font-medium">Success Rate</span>
                <span className="text-blue-600 font-bold">{agentData.successRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${agentData.successRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card - Bottom Right Panel */}
          <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>

            <div className="space-y-4">
              <button
                onClick={() => handleQuickAction('View All Bookings')}
                className="w-full flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white py-4 px-6 rounded-lg transition-colors duration-200 font-medium"
              >
                <FileText size={20} />
                <span>View All Bookings</span>
              </button>

              <button
                onClick={() => handleQuickAction('Performance Report')}
                className="w-full flex items-center gap-3 bg-teal-500 hover:bg-teal-600 text-white py-4 px-6 rounded-lg transition-colors duration-200 font-medium"
              >
                <BarChart3 size={20} />
                <span>Performance Report</span>
              </button>

              <button
                onClick={() => handleQuickAction('Commission History')}
                className="w-full flex items-center gap-3 bg-purple-500 hover:bg-purple-600 text-white py-4 px-6 rounded-lg transition-colors duration-200 font-medium"
              >
                <Award size={20} />
                <span>Commission History</span>
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={18} />
                <span className="font-medium">Account Status: Active</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Your account is in good standing with full access to all features.
              </p>
            </div>
          </div>
        </div>
        )}

        {/* Performance Tab */}
        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Performance Metrics */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Monthly Performance</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">March Bookings:</span>
                  <span className="font-bold text-blue-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Revenue Generated:</span>
                  <span className="font-bold text-green-600">₹6,50,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Commission Earned:</span>
                  <span className="font-bold text-purple-600">₹32,500</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-sm text-gray-600 text-center">75% of monthly target achieved</p>
              </div>
            </div>

            {/* Customer Satisfaction */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Satisfaction</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-500 mb-2">4.8</div>
                <div className="flex justify-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={20}
                      className={star <= 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-gray-600">Based on 24 reviews</p>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded-lg">
                  <Award className="text-green-600" size={20} />
                  <span className="text-sm text-green-800">Top Performer - March 2024</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded-lg">
                  <CheckCircle className="text-blue-600" size={20} />
                  <span className="text-sm text-blue-800">100% Customer Satisfaction</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-purple-50 rounded-lg">
                  <TrendingUp className="text-purple-600" size={20} />
                  <span className="text-sm text-purple-800">Revenue Target Exceeded</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentPortal;