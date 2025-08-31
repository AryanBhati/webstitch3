import React, { useState } from "react";
import {
  Shield,
  Users,
  TrendingUp,
  AlertTriangle,
  Settings,
  Award,
  FileText,
  BarChart3,
  PieChart,
  Globe,
  Lock,
  Unlock,
  UserCheck,
  UserX,
  DollarSign,
  Calendar,
  Home,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Ship,
  Building,
  Plane,
  Download
} from "lucide-react";
import {
  Table,
  Modal,
  Form,
  Input,
  Select,
  Button,
  Card,
  Statistic,
  Progress,
  Tag,
  Switch,
  Rate,
  DatePicker,
  InputNumber,
  Tabs,
} from "antd";
import NotificationSystem from './NotificationSystem';
import { useToast } from './ToastNotification';
import { basicAdmins, agents, complaints, offers } from "../data/admins";
import { additionalAgents, additionalComplaints, additionalOffers, systemAnalytics } from '../data/extendedMockData';
import { bookings, performanceMetrics } from "../data/bookings";
import { additionalBookings } from '../data/extendedMockData';
import type { BasicAdmin, Agent, Complaint, Offer } from "../data/admins";

interface SuperAdminDashboardProps {
  userRole: string;
  onLogout: () => void;
  onBack: () => void;
}
const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  userRole,
  onLogout,
  onBack,
}) => {
  // Toast notifications
  const { showSuccess, showError, showInfo, ToastContainer } = useToast();
  
  const [activeTab, setActiveTab] = useState("overview");
  const [showCruiseModal, setShowCruiseModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showCorporateModal, setShowCorporateModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  // Combine all data
  const allAgents = [...agents, ...additionalAgents];
  const allComplaints = [...complaints, ...additionalComplaints];
  const allOffers = [...offers, ...additionalOffers];
  const allBookings = [...bookings, ...additionalBookings];
  
  // Mock corporate accounts data
  const corporateAccounts = [
    { id: 'corp1', name: 'TechCorp Solutions', bookings: 45, revenue: 2500000, status: 'Active' },
    { id: 'corp2', name: 'Global Industries', bookings: 32, revenue: 1800000, status: 'Active' },
    { id: 'corp3', name: 'StartUp Hub', bookings: 18, revenue: 950000, status: 'Pending' }
  ];

  // Mock blog posts data
  const blogPosts = [
    { id: 'blog1', title: 'Top 10 Cruise Destinations 2024', status: 'Published', views: 15420 },
    { id: 'blog2', title: 'Luxury Hotel Guide: Mumbai Edition', status: 'Draft', views: 0 },
    { id: 'blog3', title: 'Travel Tips for First-Time Cruisers', status: 'Published', views: 8930 }
  ];
  // Handle cruise management
  const handleManageCruise = (action: string, cruiseId?: string) => {
    switch (action) {
      case 'add':
        setShowCruiseModal(true);
        break;
      case 'edit':
        console.log('Edit cruise:', cruiseId);
        showInfo('Edit Cruise', 'Cruise editing functionality would open here');
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this cruise?')) {
          showSuccess('Cruise Deleted', 'Cruise has been removed from inventory');
        }
        break;
      default:
        break;
    }
  };
  
  // Handle user management
  const handleUserManagement = (action: string, userId?: string) => {
    switch (action) {
      case 'add':
        setEditingUser(null);
        setShowUserModal(true);
        break;
      case 'edit':
        const user = [...allAgents, ...basicAdmins].find(u => u.id === userId);
        setEditingUser(user);
        setShowUserModal(true);
        break;
      case 'suspend':
        if (window.confirm('Are you sure you want to suspend this user?')) {
          showSuccess('User Suspended', 'User has been suspended successfully');
        }
        break;
      case 'activate':
        showSuccess('User Activated', 'User has been activated successfully');
        break;
    }
  };

  // Handle corporate account management
  const handleCorporateAction = (action: string, accountId?: string) => {
    switch (action) {
      case 'add':
        setShowCorporateModal(true);
        break;
      case 'view':
        showInfo('Corporate Account', `Viewing details for account: ${accountId}`);
        break;
      case 'contract':
        showInfo('Contract Management', 'Contract management would open here');
        break;
    }
  };

  // Handle blog management
  const handleBlogAction = (action: string, postId?: string) => {
    switch (action) {
      case 'add':
        setShowBlogModal(true);
        break;
      case 'edit':
        showInfo('Edit Post', `Editing blog post: ${postId}`);
        break;
      case 'publish':
        showSuccess('Post Published', 'Blog post has been published successfully');
        break;
      case 'delete':
        if (window.confirm('Are you sure you want to delete this post?')) {
          showSuccess('Post Deleted', 'Blog post has been deleted');
        }
        break;
    }
  };

  // Handle permission management
  const handlePermissionChange = (userId: string, permission: string, granted: boolean) => {
    console.log('Permission change:', userId, permission, granted);
    showSuccess(
      'Permissions Updated',
      `User permissions have been ${granted ? 'granted' : 'revoked'} successfully.`
    );
  };
  
  return (
    <div className="bg-[#f9fafb] text-gray-800 flex">
      {/* Toast Notifications */}
      <ToastContainer />
      
      <aside className="w-64 bg-gray-50 border-r fixed top-0 left-0 h-full flex flex-col items-center py-6 z-40">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
          <span className="text-white font-bold text-xl">YH</span>
        </div>
        <h1 className="text-center text-sm text-yellow-600 font-semibold leading-tight px-3 mb-6">
          Yorker Holidays
          <br />
          Services Pvt. Ltd.
        </h1>
        <nav className="flex flex-col gap-2 w-full px-4">
          {[
            {
              key: "overview",
              label: "Overview",
              icon: <BarChart3 size={16} />,
            },
            { key: "users", label: "User Management", icon: <Users size={16} /> },
            {
              key: "inventory",
              label: "Inventory Control",
              icon: <Ship size={16} />,
            },
            {
              key: "permissions",
              label: "Permissions",
              icon: <Lock size={16} />,
            },
            { key: "analytics", label: "Analytics", icon: <TrendingUp size={16} /> },
            { key: "corporate", label: "Corporate", icon: <Award size={16} /> },
            { key: "blog", label: "Blog", icon: <FileText size={16} /> },
            { key: "social", label: "Social", icon: <Globe size={16} /> },
          ].map((item, idx) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 
          ${
            activeTab === item.key
              ? "bg-gray-200 text-purple-700"
              : "hover:bg-gray-100 text-gray-700"
          }`}
            >
              <span className="bg-white p-1 rounded-md shadow-sm">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <div className="ps-64 w-full">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-5 border-b bg-white shadow-sm w-full">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center text-purple-600 font-semibold text-lg"
            >
              <Home size={20} className="mr-2" />
              Super Admin Dashboard
            </button>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Welcome back</p>
            <h1 className="font-bold text-lg">Michael Chen</h1>
          </div>
          <div className="flex gap-4">
            {/* Notification System */}
            <NotificationSystem userId="super-admin" />
            
            <Button className="text-sm font-medium" type="default">
              System Logs
            </Button>
            <Button className="bg-purple-100 text-purple-700 border-none hover:text-purple-900">
              Control Panel
            </Button>
            <Button
              danger
              type="text"
              onClick={onLogout}
              className="flex items-center"
            >
              <LogOut size={16} className="mr-1" /> Logout
            </Button>
          </div>
        </header>

        {/* Main Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-8">
          <Card
            bordered
            className="bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow"
          >
            <Statistic
              title={<span className="text-white">Total Users</span>}
              value={systemAnalytics.totalUsers}
              valueStyle={{ color: "white" }}
              suffix={<span className="text-xs text-white ml-1">+12.5%</span>}
            />
          </Card>
          <Card
            bordered
            className="bg-gradient-to-br from-teal-500 to-green-400 text-white shadow"
          >
            <Statistic
              title={<span className="text-white">Active Users</span>}
              value={systemAnalytics.activeUsers}
              valueStyle={{ color: "white" }}
              suffix={<span className="text-xs text-white ml-1">+15.03%</span>}
            />
          </Card>
          <Card
            bordered
            className="bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow"
          >
            <Statistic
              title={<span className="text-white">Total Bookings</span>}
              value={systemAnalytics.totalBookings}
              valueStyle={{ color: "white" }}
              suffix={<span className="text-xs text-white ml-1">+8.7%</span>}
            />
          </Card>
          <Card
            bordered
            className="bg-gradient-to-br from-teal-500 to-green-400 text-white shadow"
          >
            <Statistic
              title={<span className="text-white">Revenue (M)</span>}
              value={systemAnalytics.totalRevenue / 1000000}
              valueStyle={{ color: "white" }}
              suffix={<span className="text-xs text-white ml-1">+6.08%</span>}
            />
          </Card>
        </section>

        {/* Main Content Area */}
        <div className="px-8 pb-12">
          
          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div>
              <div className="text-sm text-gray-400 mb-2">
                Dashboards / Overview
              </div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  System Performance Overview
                </h2>
                <div className="text-sm text-gray-500">Last 7 days</div>
              </div>
              
              {/* Performance Chart */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Bookings & Revenue Trends
                </h3>
                <div className="flex items-end justify-around h-64">
                  {[
                    { label: "Jan", bookings: 245, revenue: 32 },
                    { label: "Feb", bookings: 289, revenue: 38 },
                    { label: "Mar", bookings: 356, revenue: 46, highlight: true },
                    { label: "Apr", bookings: 298, revenue: 41 },
                    { label: "May", bookings: 334, revenue: 44 },
                    { label: "Jun", bookings: 278, revenue: 39 },
                    { label: "Jul", bookings: 312, revenue: 42 },
                  ].map(({ label, bookings, revenue, highlight }, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="flex gap-1">
                        <div
                          className={`rounded-t-lg w-6 transition-all duration-300 ${
                            highlight ? "bg-blue-500" : "bg-blue-200"
                          }`}
                          style={{ height: `${bookings / 2}px` }}
                          title={`${bookings} bookings`}
                        ></div>
                        <div
                          className={`rounded-t-lg w-6 transition-all duration-300 ${
                            highlight ? "bg-teal-500" : "bg-teal-200"
                          }`}
                          style={{ height: `${revenue * 4}px` }}
                          title={`₹${revenue}L revenue`}
                        ></div>
                      </div>
                      {highlight && (
                        <div className="text-xs -mt-6 mb-2 px-2 py-1 bg-black text-white rounded-full">
                          {bookings}
                        </div>
                      )}
                      <span className="mt-2 text-xs text-gray-700">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>Bookings</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-teal-500 rounded"></div>
                    <span>Revenue (₹L)</span>
                  </div>
                </div>
              </div>
              
              {/* Agent Performance Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allAgents.slice(0, 9).map((agent) => (
                  <Card key={agent.id} className="bg-white shadow hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <div className="text-md font-semibold">{agent.name}</div>
                        <div className="text-xs text-gray-400">{agent.region}</div>
                      </div>
                      <Tag
                        color={
                          agent.performance.grade === "A"
                            ? "green"
                            : agent.performance.grade === "B"
                            ? "orange"
                            : "red"
                        }
                      >
                        Grade {agent.performance.grade}
                      </Tag>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Bookings:</span>
                        <span className="font-medium">{agent.performance.totalBookings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue:</span>
                        <span className="font-medium text-green-600">
                          ₹{agent.performance.totalSales.toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Success Rate:</span>
                        <span className="font-medium">{agent.performance.successRate}%</span>
                      </div>
                      <Progress 
                        percent={agent.performance.successRate} 
                        size="small" 
                        strokeColor={agent.performance.successRate >= 80 ? '#10b981' : '#f59e0b'}
                      />
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button size="small" onClick={() => setSelectedUser(agent)}>
                        View Details
                      </Button>
                      <Button size="small" type="primary" onClick={() => {
                        setSelectedUser(agent);
                        setShowPermissionModal(true);
                      }}>
                        Permissions
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">User Management</h2>
                <div className="flex gap-2">
                  <Button type="primary" icon={<Plus />}>
                    Add User
                  </Button>
                    onClick={() => handleUserManagement('add')}
                  <Button icon={<Download />}>
                    Export Users
                  </Button>
                </div>
              </div>
              
              {/* User Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <Statistic
                    title="Total Agents"
                    value={allAgents.length}
                    prefix={<Users className="text-blue-500" size={20} />}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Basic Admins"
                    value={basicAdmins.length}
                    prefix={<UserCheck className="text-green-500" size={20} />}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Active Users"
                    value={allAgents.filter(a => a.status === 'Active').length + basicAdmins.filter(a => a.status === 'Active').length}
                    prefix={<CheckCircle className="text-teal-500" size={20} />}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Pending Approvals"
                    value={allAgents.filter(a => a.status === 'Pending').length}
                    prefix={<Clock className="text-orange-500" size={20} />}
                  />
                </Card>
              </div>
              
              {/* Users Table */}
              <Card>
                <Table
                  dataSource={[...allAgents, ...basicAdmins.map(admin => ({
                    ...admin,
                    performance: { grade: 'Admin', totalBookings: 0, successRate: 100 }
                  }))]}
                  columns={[
                    {
                      title: 'Name',
                      dataIndex: 'name',
                      key: 'name',
                      render: (text: string, record: any) => (
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
                      title: 'Role',
                      key: 'role',
                      render: (record: any) => (
                        <Tag color={record.team ? 'blue' : 'green'}>
                          {record.team ? 'Basic Admin' : 'Travel Agent'}
                        </Tag>
                      )
                    },
                    {
                      title: 'Region/Team',
                      key: 'region',
                      render: (record: any) => record.region || record.team || 'N/A'
                    },
                    {
                      title: 'Status',
                      dataIndex: 'status',
                      key: 'status',
                      render: (status: string) => (
                        <Tag color={status === 'Active' ? 'green' : 'red'}>
                          {status}
                        </Tag>
                      )
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      render: (record: any) => (
                        <div className="flex gap-2">
                          <Button size="small" onClick={() => setSelectedUser(record)}>
                            View
                          </Button>
                          <Button size="small" type="primary" onClick={() => {
                            setSelectedUser(record);
                            setShowPermissionModal(true);
                          }}>
                            Permissions
                          </Button>
                          <Button size="small" danger>
                            Suspend
                          </Button>
                        </div>
                      )
                    }
                  ]}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            </div>
          )}
          
          {/* Inventory Control Tab */}
          {activeTab === 'inventory' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Inventory Management</h2>
                <div className="flex gap-2">
                  <Button type="primary" icon={<Plus />} onClick={() => handleManageCruise('add')}>
                    Add Cruise
                  </Button>
                  <Button 
                    icon={<Download />}
                    onClick={() => showInfo('Export', 'User data export would be generated here')}
                  >
                    Export Inventory
                  </Button>
                </div>
              </div>
              
              {/* Inventory Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="text-center">
                  <Ship className="mx-auto text-blue-500 mb-2" size={32} />
                  <Statistic title="Cruises" value={15} />
                  <Button type="link" onClick={() => handleManageCruise('add')}>
                    Manage Cruises
                  </Button>
                </Card>
                <Card className="text-center">
                  <Building className="mx-auto text-purple-500 mb-2" size={32} />
                  <Statistic title="Hotels" value={25} />
                  <Button type="link">
                    Manage Hotels
                  </Button>
                </Card>
                <Card className="text-center">
                  <Plane className="mx-auto text-teal-500 mb-2" size={32} />
                  <Statistic title="Flights" value={50} />
                  <Button type="link">
                    Manage Flights
                  </Button>
                </Card>
              </div>
              
              {/* Recent Inventory Changes */}
              <Card title="Recent Inventory Updates">
                <div className="space-y-3">
                  {[
                    { type: 'cruise', name: 'Royal Caribbean Explorer', action: 'Updated pricing', time: '2 hours ago' },
                          <Button 
                            size="small" 
                            onClick={() => handleUserManagement('edit', record.id)}
                          >
                            Edit
                          </Button>
                    { type: 'hotel', name: 'The Oberoi Mumbai', action: 'Added new room type', time: '4 hours ago' },
                    { type: 'cruise', name: 'Celebrity Infinity', action: 'Extended booking period', time: '1 day ago' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {item.type === 'cruise' ? <Ship size={16} className="text-blue-500" /> : <Building size={16} className="text-purple-500" />}
                          <Button 
                            size="small" 
                            danger
                            onClick={() => handleUserManagement('suspend', record.id)}
                          >
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-600">{item.action}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{item.time}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
          
          {/* Permissions Tab */}
          {activeTab === 'permissions' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                  <Button 
                    icon={<Download />}
                    onClick={() => showInfo('Export', 'Inventory export would be generated here')}
                  >
                <Button type="primary" icon={<Plus />}>
                  Create Role
                </Button>
              </div>
              
              {/* Permission Matrix */}
              <Card title="Role-Based Permissions">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">Permission</th>
                        <th className="text-center py-2">Travel Agent</th>
                        <th className="text-center py-2">Basic Admin</th>
                        <th className="text-center py-2">Super Admin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { name: 'Book Cruises', agent: true, basic: false, super: true },
                        { name: 'Manage Agents', agent: false, basic: true, super: true },
                        { name: 'View All Bookings', agent: false, basic: true, super: true },
                        { name: 'Manage Inventory', agent: false, basic: true, super: true },
                        { name: 'System Settings', agent: false, basic: false, super: true },
                        { name: 'User Permissions', agent: false, basic: false, super: true }
                      ].map((perm, index) => (
                        <tr key={index} className="border-b">
                          <td className="py-3 font-medium">{perm.name}</td>
                          <td className="text-center py-3">
                            {perm.agent ? <CheckCircle className="text-green-500 mx-auto" size={16} /> : <XCircle className="text-red-500 mx-auto" size={16} />}
                          </td>
                          <td className="text-center py-3">
                            {perm.basic ? <CheckCircle className="text-green-500 mx-auto" size={16} /> : <XCircle className="text-red-500 mx-auto" size={16} />}
                          </td>
                          <td className="text-center py-3">
                            {perm.super ? <CheckCircle className="text-green-500 mx-auto" size={16} /> : <XCircle className="text-red-500 mx-auto" size={16} />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
          
          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Advanced Analytics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Revenue Analytics */}
                <Card title="Revenue Breakdown">
                  <div className="space-y-4">
                    {[
                      { service: 'Cruises', amount: 28500000, percentage: 62 },
                      { service: 'Hotels', amount: 13200000, percentage: 29 },
                      { service: 'Flights', amount: 3900000, percentage: 9 }
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{item.service}</span>
                          <span className="text-green-600 font-bold">
                            ₹{item.amount.toLocaleString('en-IN')}
                          </span>
                    ))}
                  </div>
                </Card>
                
                {/* Customer Satisfaction */}
                      <div key={index} className="space-y-2">
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-green-600 mb-2">4.8</div>
                  <Button 
                    type="link" 
                    onClick={() => showInfo('Cruise Management', 'Cruise management interface would open here')}
                        </div>
                        <Progress percent={item.percentage} strokeColor="#10b981" />
                      </div>
                  >
                    <p className="text-gray-600 mt-2">Based on 1,247 reviews</p>
                        <Progress percent={item.percentage} strokeColor="#10b981" />
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="w-3 text-sm">{rating}</span>
                  <Button 
                    type="link"
                    onClick={() => showInfo('Hotel Management', 'Hotel management interface would open here')}
                  </div>
                        <Progress 
                          percent={rating === 5 ? 78 : rating === 4 ? 15 : rating === 3 ? 5 : rating === 2 ? 1 : 1} 
                          size="small" 
                          strokeColor="#fbbf24"
                          className="flex-1"
                        />
                  <Button 
                    type="link"
                    onClick={() => showInfo('Flight Management', 'Flight management interface would open here')}
                  >
                    ))}
                  </div>
                </Card>
              </div>
            </div>
          )}
          
          {/* Corporate Tab */}
          {activeTab === 'corporate' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Corporate Accounts</h2>
              <div className="text-center py-12 text-gray-500">
                <Award size={48} className="mx-auto mb-4 opacity-50" />
                <p>Corporate account management features coming soon</p>
                <Button 
                  type="primary" 
                  icon={<Plus />}
                  onClick={() => handleCorporateAction('add')}
                >
                  Add Corporate Account
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <Statistic
                    title="Total Accounts"
                    value={corporateAccounts.length}
                    prefix={<Award className="text-blue-500" size={20} />}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Active Accounts"
                    value={corporateAccounts.filter(acc => acc.status === 'Active').length}
                    prefix={<CheckCircle className="text-green-500" size={20} />}
                  />
                </Card>
                <Card>
                  <Statistic
                    title="Corporate Revenue"
                    value={corporateAccounts.reduce((sum, acc) => sum + acc.revenue, 0)}
                    formatter={(value) => `₹${Number(value).toLocaleString('en-IN')}`}
                    prefix={<DollarSign className="text-purple-500" size={20} />}
                  />
                </Card>
              </div>
              
              <Card title="Corporate Accounts">
                <Table
                  dataSource={corporateAccounts}
                  columns={[
                    {
                      title: 'Company Name',
                      dataIndex: 'name',
                      key: 'name'
                    },
                    {
                      title: 'Total Bookings',
                      dataIndex: 'bookings',
                      key: 'bookings'
                    },
                    {
                      title: 'Revenue',
                      dataIndex: 'revenue',
                      key: 'revenue',
                      render: (amount: number) => `₹${amount.toLocaleString('en-IN')}`
                    },
                    {
                      title: 'Status',
                      dataIndex: 'status',
                      key: 'status',
                      render: (status: string) => (
                        <Tag color={status === 'Active' ? 'green' : 'orange'}>
                          {status}
                        </Tag>
                      )
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      render: (record: any) => (
                        <div className="flex gap-2">
                          <Button 
                            size="small"
                            onClick={() => handleCorporateAction('view', record.id)}
                          >
                            View
                          </Button>
                          <Button 
                            size="small" 
                            type="primary"
                            onClick={() => handleCorporateAction('contract', record.id)}
                          >
                            Contract
                          </Button>
                        </div>
                      )
                    }
                  ]}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
          {/* Blog Tab */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Content Management</h2>
              <div className="text-center py-12 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>Blog and content management features coming soon</p>
              </div>
            </div>
                <Button 
                  type="primary" 
                  icon={<Plus />}
                  onClick={() => handleBlogAction('add')}
                >
                  Create Post
                </Button>
          )}
              
              <Card title="Blog Posts">
                <Table
                  dataSource={blogPosts}
                  columns={[
                    {
                      title: 'Title',
                      dataIndex: 'title',
                      key: 'title'
                    },
                    {
                      title: 'Status',
                      dataIndex: 'status',
                      key: 'status',
                      render: (status: string) => (
                        <Tag color={status === 'Published' ? 'green' : 'orange'}>
                          {status}
                        </Tag>
                      )
                    },
                    {
                      title: 'Views',
                      dataIndex: 'views',
                      key: 'views',
                      render: (views: number) => views.toLocaleString()
                    },
                    {
                      title: 'Actions',
                      key: 'actions',
                      render: (record: any) => (
                        <div className="flex gap-2">
                          <Button 
                            size="small"
                            onClick={() => handleBlogAction('edit', record.id)}
                          >
                            Edit
                          </Button>
                          {record.status === 'Draft' && (
                            <Button 
                              size="small" 
                              type="primary"
                              onClick={() => handleBlogAction('publish', record.id)}
                            >
                              Publish
                            </Button>
                          )}
                          <Button 
                            size="small" 
                            danger
                            onClick={() => handleBlogAction('delete', record.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      )
                    }
                  ]}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            <div>
              <div className="text-center py-12 text-gray-500">
                <Globe size={48} className="mx-auto mb-4 opacity-50" />
                <p>Social media management features coming soon</p>
              </div>
            </div>
          )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="text-center">
                  <div className="text-2xl font-bold text-blue-600 mb-2">12.5K</div>
                  <div className="text-sm text-gray-600">Facebook Followers</div>
                </Card>
                <Card className="text-center">
                  <div className="text-2xl font-bold text-pink-600 mb-2">8.3K</div>
                  <div className="text-sm text-gray-600">Instagram Followers</div>
                </Card>
                <Card className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-2">5.1K</div>
                  <div className="text-sm text-gray-600">Twitter Followers</div>
                </Card>
                <Card className="text-center">
                  <div className="text-2xl font-bold text-red-600 mb-2">15.2K</div>
                  <div className="text-sm text-gray-600">YouTube Subscribers</div>
                </Card>
              </div>
              
              <Card title="Recent Social Media Activity">
                <div className="space-y-3">
                  {[
                    { platform: 'Instagram', post: 'Luxury cruise to Maldives', engagement: '1.2K likes', time: '2 hours ago' },
                    { platform: 'Facebook', post: 'Hotel booking special offer', engagement: '856 likes', time: '5 hours ago' },
                    { platform: 'Twitter', post: 'Customer testimonial thread', engagement: '234 retweets', time: '1 day ago' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Globe size={16} className="text-blue-500" />
                        <div>
                          <div className="font-medium">{item.platform}: {item.post}</div>
                          <div className="text-sm text-gray-600">{item.engagement}</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">{item.time}</div>
                    </div>
                  ))}
                </div>
              </Card>
      {/* Cruise Management Modal */}
        title="Add New Cruise"
        open={showCruiseModal}
        onCancel={() => setShowCruiseModal(false)}
        footer={null}
      {/* User Management Modal */}
      <Modal
        title={editingUser ? "Edit User" : "Add New User"}
        open={showUserModal}
        onCancel={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          layout="vertical"
          initialValues={editingUser || {}}
          onFinish={(values) => {
            console.log('User form submitted:', values);
            showSuccess(
              editingUser ? 'User Updated' : 'User Created',
              `User has been ${editingUser ? 'updated' : 'created'} successfully.`
            );
            setShowUserModal(false);
            setEditingUser(null);
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Full Name" name="name" required>
              <Input placeholder="Enter full name" />
            </Form.Item>
            <Form.Item label="Email" name="email" required>
              <Input type="email" placeholder="Enter email address" />
            </Form.Item>
            <Form.Item label="Role" name="role" required>
              <Select placeholder="Select role">
                <Select.Option value="Travel Agent">Travel Agent</Select.Option>
                <Select.Option value="Basic Admin">Basic Admin</Select.Option>
                <Select.Option value="Super Admin">Super Admin</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Region/Team" name="region" required>
              <Input placeholder="Enter region or team" />
            </Form.Item>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowUserModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </Form>
      </Modal>

        width={800}
      >
        <Form layout="vertical">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item label="Cruise Name" required>
              <Input placeholder="Enter cruise name" />
            </Form.Item>
            <Form.Item label="Cruise Line" required>
        <Form 
          layout="vertical"
          onFinish={(values) => {
            console.log('Cruise form submitted:', values);
            showSuccess('Cruise Added', 'New cruise has been added to inventory successfully.');
            setShowCruiseModal(false);
          }}
        >
                <Select.Option value="Royal Caribbean">Royal Caribbean</Select.Option>
                <Select.Option value="Celebrity">Celebrity Cruises</Select.Option>
                <Select.Option value="Norwegian">Norwegian Cruise Line</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="From Port" required>
              <Input placeholder="Departure port" />
            </Form.Item>
            <Form.Item label="To Port" required>
              <Input placeholder="Destination port" />
            </Form.Item>
            <Form.Item label="Duration (nights)" required>
              <InputNumber min={1} max={30} className="w-full" />
            </Form.Item>
            <Form.Item label="Price per Person" required>
              <InputNumber min={1000} className="w-full" formatter={value => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')} />
            </Form.Item>
          </div>
          <Form.Item label="Description" required>
            <Input.TextArea rows={3} placeholder="Cruise description" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowCruiseModal(false)}>Cancel</Button>
            <Button type="primary" onClick={() => {
              setShowCruiseModal(false);
              showSuccess('Cruise Added', 'New cruise has been added to inventory successfully.');
            }}>
          <Form.Item label="Hold Period (days)" required>
            <Select placeholder="Select hold period based on duration">
              <Select.Option value={1}>1 day (for 7-day cruises)</Select.Option>
              <Select.Option value={2}>2 days (for 15-day cruises)</Select.Option>
              <Select.Option value={3}>3 days (for longer cruises)</Select.Option>
            </Select>
          </Form.Item>
              Add Cruise
            </Button>
            <Button type="primary" htmlType="submit">
      {/* Permission Management Modal */}
      <Modal
        title="Manage User Permissions"
        open={showPermissionModal}
        onCancel={() => setShowPermissionModal(false)}
        footer={null}
      {/* Corporate Account Modal */}
      <Modal
        title="Add Corporate Account"
        open={showCorporateModal}
        onCancel={() => setShowCorporateModal(false)}
        footer={null}
        width={600}
      >
        <Form 
          layout="vertical"
          onFinish={(values) => {
            console.log('Corporate account form submitted:', values);
            showSuccess('Corporate Account Added', 'New corporate account has been created successfully.');
            setShowCorporateModal(false);
          }}
        >
          <Form.Item label="Company Name" name="companyName" required>
            <Input placeholder="Enter company name" />
          </Form.Item>
          <Form.Item label="Contact Person" name="contactPerson" required>
            <Input placeholder="Enter contact person name" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item label="Email" name="email" required>
              <Input type="email" placeholder="Enter email" />
            </Form.Item>
            <Form.Item label="Phone" name="phone" required>
              <Input placeholder="Enter phone number" />
            </Form.Item>
          </div>
          <Form.Item label="Billing Address" name="address" required>
            <Input.TextArea rows={3} placeholder="Enter billing address" />
          </Form.Item>
          
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowCorporateModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Create Account
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Blog Post Modal */}
      <Modal
        title="Create Blog Post"
        open={showBlogModal}
        onCancel={() => setShowBlogModal(false)}
        footer={null}
        width={800}
      >
        <Form 
          layout="vertical"
          onFinish={(values) => {
            console.log('Blog post form submitted:', values);
            showSuccess('Blog Post Created', 'New blog post has been created successfully.');
            setShowBlogModal(false);
          }}
        >
          <Form.Item label="Post Title" name="title" required>
            <Input placeholder="Enter blog post title" />
          </Form.Item>
          <Form.Item label="Category" name="category" required>
            <Select placeholder="Select category">
              <Select.Option value="Travel Tips">Travel Tips</Select.Option>
              <Select.Option value="Destinations">Destinations</Select.Option>
              <Select.Option value="Cruise Guides">Cruise Guides</Select.Option>
              <Select.Option value="Hotel Reviews">Hotel Reviews</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="Content" name="content" required>
            <Input.TextArea rows={8} placeholder="Enter blog post content" />
          </Form.Item>
          <Form.Item label="Tags" name="tags">
            <Input placeholder="Enter tags separated by commas" />
          </Form.Item>
          
          <div className="flex justify-end gap-2">
            <Button onClick={() => setShowBlogModal(false)}>Cancel</Button>
            <Button htmlType="submit">Save as Draft</Button>
            <Button type="primary" htmlType="submit">
              Publish Post
            </Button>
          </div>
        </Form>
      </Modal>

        width={600}
      >
        {selectedUser && (
          <div>
            <div className="mb-4">
              <h4 className="font-medium text-gray-800">User: {selectedUser.name}</h4>
              <p className="text-gray-600">Role: {selectedUser.team ? 'Basic Admin' : 'Travel Agent'}</p>
            </div>
            
            <div className="space-y-3">
              {[
                'book_cruise', 'book_hotel', 'view_bookings', 'manage_agents', 
                'manage_inventory', 'resolve_complaints', 'create_offers', 'view_reports'
              ].map(permission => (
                <div key={permission} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium capitalize">{permission.replace('_', ' ')}</span>
                  <Switch
                    checked={Math.random() > 0.5} // Mock permission state
                    onChange={(checked) => handlePermissionChange(selectedUser.id, permission, checked)}
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button onClick={() => setShowPermissionModal(false)}>Cancel</Button>
              <Button type="primary" onClick={() => {
                setShowPermissionModal(false);
                showSuccess('Permissions Updated', 'User permissions have been updated successfully.');
              }}>
                <Button 
                  type="primary" 
                  icon={<Plus />}
                  onClick={() => showInfo('Create Role', 'Role creation interface would open here')}
                >
              </Button>
            </div>
        )}
      </Modal>
          </div>
        </div>
      </div>
};

export default SuperAdminDashboard;
