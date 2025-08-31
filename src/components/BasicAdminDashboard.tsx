import React, { useState } from 'react';
import { 
  Users, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  DollarSign,
  FileText,
  Settings,
  Download,
  Plus,
  Edit,
  Trash2,
  MessageSquare,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  PieChart,
  User,
  LogOut,
  Home,
  Filter,
  Search
} from 'lucide-react';
import { Table, Modal, Form, Input, Select, Button, Card, Statistic, Progress, Tag, Rate, DatePicker } from 'antd';
import NotificationSystem from './NotificationSystem';
import { useToast } from './ToastNotification';
import { agents, complaints, offers } from '../data/admins';
import { additionalAgents, additionalComplaints, additionalOffers } from '../data/extendedMockData';
import { bookings, performanceMetrics } from '../data/bookings';
import { additionalBookings } from '../data/extendedMockData';
import { cruises } from '../data/cruises';
import { additionalCruises } from '../data/extendedMockData';
import { hotels } from '../data/hotels';
import { additionalHotels } from '../data/extendedMockData';
import type { Agent, Complaint, Offer } from '../data/admins';
import type { Booking } from '../data/bookings';

interface BasicAdminDashboardProps {
  userRole: string;
  onLogout: () => void;
  onBack: () => void;
}

const BasicAdminDashboard: React.FC<BasicAdminDashboardProps> = ({ userRole, onLogout, onBack }) => {
  // Toast notifications
  const { showSuccess, showError, showWarning, ToastContainer } = useToast();
  
  // State management
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showInventoryModal, setShowInventoryModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [inventoryType, setInventoryType] = useState<'cruise' | 'hotel'>('cruise');
  const [bookingFilters, setBookingFilters] = useState({
    dateRange: null as any,
    agentName: '',
    companyName: '',
    paymentStatus: 'All'
  });

  // Mock current admin data
  const currentAdmin = {
    name: "Sarah Johnson",
    email: "sarah.johnson@yorkeholidays.com",
    team: "North India Operations",
    region: "Delhi, Punjab, Haryana",
    avatar: "SJ"
  };

  // Combine original and additional data
  const allAgents = [...agents, ...additionalAgents];
  const allComplaints = [...complaints, ...additionalComplaints];
  const allOffers = [...offers, ...additionalOffers];
  const allBookings = [...bookings, ...additionalBookings];
  const allCruises = [...cruises, ...additionalCruises];
  const allHotels = [...hotels, ...additionalHotels];

  // Filter data for current admin's region
  const myAgents = allAgents.filter(agent => agent.adminId === "ba1");
  const myComplaints = complaints.filter(complaint => 
    myAgents.some(agent => agent.id === complaint.agentId)
  );
  const myBookings = allBookings.filter(booking => 
    myAgents.some(agent => agent.id === booking.agentId)
  );

  // Calculate quick stats
  const todayBookings = myBookings.filter(booking => 
    booking.bookingDate === new Date().toISOString().split('T')[0]
  ).length;
  const activeAgents = myAgents.filter(agent => agent.status === 'Active').length;
  const openComplaints = myComplaints.filter(complaint => complaint.status === 'Open').length;

  // Handle complaint resolution
  const handleResolveComplaint = (complaintId: string, resolution: string) => {
    console.log('Resolving complaint:', complaintId, resolution);
    // In real app, this would update the database
    showSuccess(
      'Complaint Resolved',
      'The complaint has been marked as resolved successfully.'
    );
  };

  // Handle offer assignment
  const handleAssignOffer = (offerId: string, agentIds: string[]) => {
    console.log('Assigning offer:', offerId, 'to agents:', agentIds);
    // In real app, this would update the database
    showSuccess(
      'Offer Assigned',
      `Offer has been assigned to ${agentIds.length} agent(s) successfully.`
    );
  };
  
  // Handle agent commission edit
  const handleEditCommission = (agentId: string, newRate: number) => {
    console.log('Updating commission rate for agent:', agentId, 'to:', newRate);
    showSuccess(
      'Commission Updated',
      `Commission rate has been updated to ${newRate}% successfully.`
    );
  };
  
  // Handle chat with customer
  const handleChatCustomer = (bookingId: string, customerName: string) => {
    console.log('Opening chat with customer for booking:', bookingId);
    alert(`Opening chat with ${customerName} for booking ${bookingId}`);
  };

  // Table columns for agents
  const agentColumns = [
    {
      title: 'Agent Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Agent) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {text.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-sm text-gray-500">{record.email}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Region',
      dataIndex: 'region',
      key: 'region'
    },
    {
      title: 'Performance',
      key: 'performance',
      render: (record: Agent) => (
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">Grade:</span>
            <Tag color={record.performance.grade === 'A' ? 'green' : record.performance.grade === 'B' ? 'orange' : 'red'}>
              {record.performance.grade}
            </Tag>
          </div>
          <div className="text-sm text-gray-600">
            {record.performance.totalBookings} bookings | {record.performance.successRate}% success
          </div>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : status === 'Pending' ? 'orange' : 'red'}>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Agent) => (
        <div className="flex gap-2">
          <Button size="small" onClick={() => setSelectedAgent(record)}>
            View Details
          </Button>
          <Button 
            size="small" 
            type="primary"
            onClick={() => {
              const newRate = prompt('Enter new commission rate (%)', record.performance.grade === 'A' ? '7' : '5');
              if (newRate && !isNaN(Number(newRate))) {
                handleEditCommission(record.id, Number(newRate));
              }
            }}
          >
            Edit Commission
          </Button>
        </div>
      )
    }
  ];

  // Table columns for bookings
  const bookingColumns = [
    {
      title: 'Booking ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-mono text-sm">{text}</span>
    },
    {
      title: 'Date',
      dataIndex: 'bookingDate',
      key: 'bookingDate'
    },
    {
      title: 'Agent',
      dataIndex: 'agentName',
      key: 'agentName'
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: 'Service',
      key: 'service',
      render: (record: Booking) => (
        <div>
          <div className="font-medium">{record.itemName}</div>
          <Tag color={record.type === 'Cruise' ? 'blue' : 'purple'}>{record.type}</Tag>
        </div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `₹${amount.toLocaleString('en-IN')}`
    },
    {
      title: 'Payment Status',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      render: (status: string) => (
        <Tag color={
          status === 'Paid' ? 'green' : 
          status === 'Pending' ? 'orange' : 
          status === 'Failed' ? 'red' : 'blue'
        }>
          {status}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'Confirmed' ? 'green' : 
          status === 'Pending' ? 'orange' : 
          status === 'Cancelled' ? 'red' : 'blue'
        }>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Booking) => (
        <div className="flex gap-2">
          <Button 
            size="small" 
            icon={<MessageCircle size={14} />}
            onClick={() => handleChatCustomer(record.id, record.customerName)}
            title="Chat with customer"
          />
        </div>
      )
    }
  ];

  // Table columns for complaints
  const complaintColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-mono text-xs">{text}</span>
    },
    {
      title: 'Customer',
      dataIndex: 'customerName',
      key: 'customerName'
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject'
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: string) => (
        <Tag color={
          priority === 'Critical' ? 'red' : 
          priority === 'High' ? 'orange' : 
          priority === 'Medium' ? 'blue' : 'green'
        }>
          {priority}
        </Tag>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'Open' ? 'red' : 
          status === 'In Progress' ? 'orange' : 
          status === 'Resolved' ? 'green' : 'purple'
        }>
          {status}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record: Complaint) => (
        <Button size="small" onClick={() => setSelectedComplaint(record)}>
          {record.status === 'Open' ? 'Resolve' : 'View'}
        </Button>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Toast Notifications */}
      <ToastContainer />
      
      {/* Top Navigation */}
      <nav className="bg-white/20 backdrop-blur-md border-b border-white/30 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Portal Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Home size={24} />
                <span className="text-xl font-bold">Basic Admin Portal</span>
              </button>
            </div>

            {/* Center - Welcome Message */}
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-gray-800">
                Welcome back, {currentAdmin.name}
              </h2>
              <p className="text-sm text-gray-600">{currentAdmin.team}</p>
            </div>

            {/* Right - Navigation */}
            <div className="flex items-center gap-4">
              {/* Notification System */}
              <NotificationSystem userId="ba1" />
              
              <button className="text-gray-600 hover:text-gray-800 transition-colors font-medium">
                My Team
              </button>
              <button className="text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-lg">
                Dashboard
              </button>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile & Summary Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                {currentAdmin.avatar}
              </div>
              <h3 className="font-bold text-gray-800 mb-1">{currentAdmin.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{currentAdmin.email}</p>
              <Tag color="blue">{userRole}</Tag>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Team:</p>
              <p className="font-medium text-gray-800 mb-2">{currentAdmin.team}</p>
              <p className="text-sm text-gray-600 mb-1">Region:</p>
              <p className="font-medium text-gray-800">{currentAdmin.region}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/20 backdrop-blur-md border-white/30">
              <Statistic
                title="Bookings Today"
                value={todayBookings}
                prefix={<Calendar className="text-blue-500" size={20} />}
                valueStyle={{ color: '#3b82f6' }}
              />
            </Card>
            <Card className="bg-white/20 backdrop-blur-md border-white/30">
              <Statistic
                title="Active Agents"
                value={activeAgents}
                prefix={<Users className="text-green-500" size={20} />}
                valueStyle={{ color: '#10b981' }}
              />
            </Card>
            <Card className="bg-white/20 backdrop-blur-md border-white/30">
              <Statistic
                title="Open Complaints"
                value={openComplaints}
                prefix={<AlertCircle className="text-red-500" size={20} />}
                valueStyle={{ color: '#ef4444' }}
              />
            </Card>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-lg mb-6">
          <div className="flex flex-wrap gap-2 p-4">
            {[
              { key: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
              { key: 'agents', label: 'My Agents', icon: <Users size={18} /> },
              { key: 'bookings', label: 'Bookings', icon: <Calendar size={18} /> },
              { key: 'complaints', label: 'Complaints', icon: <MessageSquare size={18} /> },
              { key: 'inventory', label: 'Inventory', icon: <Settings size={18} /> },
              { key: 'offers', label: 'Offers', icon: <FileText size={18} /> }
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
        <div className="bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-lg p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Team Performance Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-white/30">
                  <Statistic
                    title="Total Bookings"
                    value={myBookings.length}
                    prefix={<Calendar className="text-blue-500" size={20} />}
                  />
                </Card>
                <Card className="bg-white/30">
                  <Statistic
                    title="Total Revenue"
                    value={myBookings.reduce((sum, booking) => sum + booking.totalAmount, 0)}
                    formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                    prefix={<DollarSign className="text-green-500" size={20} />}
                  />
                </Card>
                <Card className="bg-white/30">
                  <Statistic
                    title="Commission Earned"
                    value={myBookings.reduce((sum, booking) => sum + booking.commissionAmount, 0)}
                    formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                    prefix={<TrendingUp className="text-purple-500" size={20} />}
                  />
                </Card>
                <Card className="bg-white/30">
                  <Statistic
                    title="Success Rate"
                    value={85}
                    suffix="%"
                    prefix={<CheckCircle className="text-teal-500" size={20} />}
                  />
                </Card>
              </div>

              {/* Agent Performance */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Agent Performance</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myAgents.map(agent => (
                    <Card key={agent.id} className="bg-white/30">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                            {agent.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div className="font-medium">{agent.name}</div>
                            <div className="text-sm text-gray-600">{agent.region}</div>
                          </div>
                        </div>
                        <Tag color={agent.performance.grade === 'A' ? 'green' : 'orange'}>
                          Grade {agent.performance.grade}
                        </Tag>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Bookings:</span>
                          <span className="font-medium">{agent.performance.totalBookings}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Success Rate:</span>
                          <span className="font-medium">{agent.performance.successRate}%</span>
                        </div>
                        <Progress percent={agent.performance.successRate} size="small" />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Agents Tab */}
          {activeTab === 'agents' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">My Agents</h2>
                <Button type="primary" icon={<Download />}>
                  Export Report
                </Button>
              </div>
              <Table
                columns={agentColumns}
                dataSource={myAgents}
                rowKey="id"
                className="bg-white/50 rounded-lg"
                pagination={{ pageSize: 10 }}
              />
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Booking Logs</h2>
                <div className="flex gap-2">
                  <Button type="primary" icon={<Download />}>
                    Export Data
                  </Button>
                </div>
              </div>
              
              {/* Booking Filters */}
              <div className="bg-white/30 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
                    <DatePicker.RangePicker
                      value={bookingFilters.dateRange}
                      onChange={(dates) => setBookingFilters(prev => ({ ...prev, dateRange: dates }))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                    <Input
                      placeholder="Filter by agent"
                      value={bookingFilters.agentName}
                      onChange={(e) => setBookingFilters(prev => ({ ...prev, agentName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <Input
                      placeholder="Filter by company"
                      value={bookingFilters.companyName}
                      onChange={(e) => setBookingFilters(prev => ({ ...prev, companyName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                    <Select
                      value={bookingFilters.paymentStatus}
                      onChange={(value) => setBookingFilters(prev => ({ ...prev, paymentStatus: value }))}
                      className="w-full"
                    >
                      <Select.Option value="All">All Status</Select.Option>
                      <Select.Option value="Paid">Paid</Select.Option>
                      <Select.Option value="Pending">Pending</Select.Option>
                      <Select.Option value="Failed">Failed</Select.Option>
                    </Select>
                  </div>
                </div>
              </div>
              
              <Table
                columns={bookingColumns}
                dataSource={myBookings.filter(booking => {
                  const matchesAgent = !bookingFilters.agentName || 
                    booking.agentName.toLowerCase().includes(bookingFilters.agentName.toLowerCase());
                  const matchesPayment = bookingFilters.paymentStatus === 'All' || 
                    booking.paymentStatus === bookingFilters.paymentStatus;
                  return matchesAgent && matchesPayment;
                })}
                rowKey="id"
                className="bg-white/50 rounded-lg"
                pagination={{ pageSize: 10 }}
              />
            </div>
          )}

          {/* Complaints Tab */}
          {activeTab === 'complaints' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Complaint Management</h2>
                <div className="flex gap-2">
                  <Tag color="red">Open: {myComplaints.filter(c => c.status === 'Open').length}</Tag>
                  <Tag color="orange">In Progress: {myComplaints.filter(c => c.status === 'In Progress').length}</Tag>
                  <Tag color="green">Resolved: {myComplaints.filter(c => c.status === 'Resolved').length}</Tag>
                </div>
              </div>
              <Table
                columns={complaintColumns}
                dataSource={myComplaints}
                rowKey="id"
                className="bg-white/50 rounded-lg"
                pagination={{ pageSize: 10 }}
              />
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Inventory Management</h2>
                <Button 
                  type="primary" 
                  icon={<Plus />}
                  onClick={() => setShowInventoryModal(true)}
                >
                  Add New Item
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cruises */}
                <Card title="Cruises" className="bg-white/30">
                  <div className="space-y-3">
                    {allCruises.slice(0, 5).map(cruise => (
                      <div key={cruise.id} className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                        <div>
                          <div className="font-medium">{cruise.name}</div>
                          <div className="text-sm text-gray-600">{cruise.from} → {cruise.to}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="small" icon={<Edit />} />
                          <Button size="small" icon={<Trash2 />} danger />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Hotels */}
                <Card title="Hotels" className="bg-white/30">
                  <div className="space-y-3">
                    {allHotels.slice(0, 5).map(hotel => (
                      <div key={hotel.id} className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                        <div>
                          <div className="font-medium">{hotel.name}</div>
                          <div className="text-sm text-gray-600">{hotel.location}</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="small" icon={<Edit />} />
                          <Button size="small" icon={<Trash2 />} danger />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Offers Tab */}
          {activeTab === 'offers' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Offer Distribution</h2>
                <Button 
                  type="primary" 
                  icon={<Plus />}
                  onClick={() => setShowOfferModal(true)}
                >
                  Create Offer
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allOffers.map(offer => (
                  <Card key={offer.id} className="bg-white/30">
                    <div className="mb-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{offer.title}</h4>
                        <Tag color={offer.status === 'Active' ? 'green' : 'red'}>
                          {offer.status}
                        </Tag>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{offer.description}</p>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Discount:</span>
                        <span className="font-medium">
                          {offer.discountType === 'Percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mb-3">
                        <span>Usage:</span>
                        <span>{offer.usageCount}/{offer.maxUsage || '∞'}</span>
                      </div>
                    </div>
                    <Button 
                      block 
                      onClick={() => handleAssignOffer(offer.id, myAgents.map(a => a.id))}
                    >
                      Assign to My Agents
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Agent Details Modal */}
      <Modal
        title="Agent Details"
        open={!!selectedAgent}
        onCancel={() => setSelectedAgent(null)}
        footer={null}
        width={600}
      >
        {selectedAgent && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {selectedAgent.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-xl font-bold">{selectedAgent.name}</h3>
                <p className="text-gray-600">{selectedAgent.email}</p>
                <Tag color={selectedAgent.status === 'Active' ? 'green' : 'red'}>
                  {selectedAgent.status}
                </Tag>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
                <p className="text-gray-900">{selectedAgent.region}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Joined Date</label>
                <p className="text-gray-900">{selectedAgent.joinedDate}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <p className="text-gray-900">{selectedAgent.contactInfo.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Performance Grade</label>
                <Tag color={selectedAgent.performance.grade === 'A' ? 'green' : 'orange'}>
                  Grade {selectedAgent.performance.grade}
                </Tag>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <p className="text-gray-900">{selectedAgent.contactInfo.address}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <Card size="small">
                <Statistic title="Total Bookings" value={selectedAgent.performance.totalBookings} />
              </Card>
              <Card size="small">
                <Statistic 
                  title="Commission Earned" 
                  value={selectedAgent.performance.commissionEarned}
                  formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                />
              </Card>
            </div>
          </div>
        )}
      </Modal>

      {/* Complaint Resolution Modal */}
      <Modal
        title="Resolve Complaint"
        open={!!selectedComplaint}
        onCancel={() => setSelectedComplaint(null)}
        onOk={() => {
          if (selectedComplaint) {
            handleResolveComplaint(selectedComplaint.id, "Issue resolved by admin");
            setSelectedComplaint(null);
          }
        }}
      >
        {selectedComplaint && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
              <p className="text-gray-900">{selectedComplaint.customerName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <p className="text-gray-900">{selectedComplaint.subject}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <p className="text-gray-900">{selectedComplaint.description}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <Tag color={
                selectedComplaint.priority === 'Critical' ? 'red' : 
                selectedComplaint.priority === 'High' ? 'orange' : 'blue'
              }>
                {selectedComplaint.priority}
              </Tag>
            </div>
            {selectedComplaint.status !== 'Open' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution</label>
                <p className="text-gray-900">{selectedComplaint.resolution || 'No resolution provided'}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BasicAdminDashboard;