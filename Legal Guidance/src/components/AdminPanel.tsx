import { useEffect, useState } from 'react';
import { 
  Mail, 
  UserCheck, 
  UserX, 
  Trash2, 
  Clock, 
  Activity, 
  AlertCircle,
  ChevronDown,
  Search,
  MoreVertical,
  CheckCircle2,
  XCircle
} from 'lucide-react';

const AdminPanel = () => {
  const [requests, setRequests] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('activity'); // Set to 'activity' by default
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetch('http://localhost:5000/api/lawyer-verifications');
      const data = await response.json();
      setRequests(data);
    };
    fetchRequests();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch('http://localhost:5000/api/messages');
      const data = await response.json();
      setMessages(data);
    };
    fetchMessages();
  }, []);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      const response = await fetch('http://localhost:5000/api/activity-logs');
      const data = await response.json();
      setActivityLogs(data);
    };
    fetchActivityLogs();
  }, []);

  const handleUpdate = async (id: number, status: string) => {
    const response = await fetch('http://localhost:5000/api/lawyer-verification-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    const data = await response.json();
    if (data.success) {
      setRequests(requests.filter((req: any) => req.id !== id));
    }
  };

  const handleDeleteMessage = async (id: number) => {
    const response = await fetch(`http://localhost:5000/api/messages/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      setMessages(messages.filter((msg: any) => msg.id !== id));
    }
  };

  const filteredRequests = requests.filter((req: any) => 
    req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMessages = messages.filter((msg: any) => 
    msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.receiver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredActivityLogs = activityLogs.filter((log: any) => 
    log.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>
        
        {/* Search and Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search across all sections..."
                className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2 w-full md:w-auto">
              <button
                onClick={() => setActiveTab('activity')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'activity' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Activity className="h-5 w-5" />
                <span>Activity ({activityLogs.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('requests')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'requests' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <UserCheck className="h-5 w-5" />
                <span>Verifications ({requests.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                  activeTab === 'messages' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Mail className="h-5 w-5" />
                <span>Messages ({messages.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Activity Logs (shown by default) */}
          {activeTab === 'activity' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Activity className="h-6 w-6 mr-2 text-blue-600" />
                  User Activity Logs
                </h2>
              </div>
              
              {filteredActivityLogs.length === 0 ? (
                <div className="p-8 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No activity logs found</h3>
                  <p className="mt-1 text-gray-500">No user activity has been recorded yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredActivityLogs.map((log: any) => (
                    <div key={log.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <Activity className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {log.username}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {log.action}
                          </p>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{new Date(log.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Verification Requests */}
          {activeTab === 'requests' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <UserCheck className="h-6 w-6 mr-2 text-blue-600" />
                  Lawyer Verification Requests
                </h2>
              </div>
              
              {filteredRequests.length === 0 ? (
                <div className="p-8 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No pending requests</h3>
                  <p className="mt-1 text-gray-500">All verification requests have been processed</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredRequests.map((req: any) => (
                    <div key={req.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{req.name}</span>
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                              {req.specialization}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{req.email}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Submitted: {new Date(req.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleUpdate(req.id, 'accepted')}
                            className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center"
                          >
                            <CheckCircle2 className="h-5 w-5 mr-2" />
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdate(req.id, 'rejected')}
                            className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center"
                          >
                            <XCircle className="h-5 w-5 mr-2" />
                            Reject
                          </button>
                          <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                            <MoreVertical className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Messages */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  <Mail className="h-6 w-6 mr-2 text-blue-600" />
                  User Messages
                </h2>
              </div>
              
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center">
                  <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No messages found</h3>
                  <p className="mt-1 text-gray-500">No messages have been sent yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredMessages.map((msg: any) => (
                    <div key={msg.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{msg.sender}</span>
                            <span className="text-gray-500">→</span>
                            <span className="font-medium text-gray-900">{msg.receiver}</span>
                          </div>
                          <p className="text-gray-700">{msg.content}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{new Date(msg.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-2 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors flex items-center"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;