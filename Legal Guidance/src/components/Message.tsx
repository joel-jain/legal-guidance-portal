import { useEffect, useState } from 'react';
import { 
  Mail, 
  User, 
  Clock, 
  Send, 
  Search, 
  ChevronDown, 
  MoreVertical,
  MessageSquare,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const Messages = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'inbox' | 'sent'>('inbox');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const fetchMessages = async () => {
            const response = await fetch('http://localhost:5000/api/messages');
            const data = await response.json();
            const userMessages = data.filter(
                (msg: any) => msg.senderId === user.id || msg.receiverId === user.id
            );
            setMessages(userMessages);
        };
        fetchMessages();
    }, [user.id]);

    const filteredMessages = messages.filter(msg => {
        const matchesSearch = msg.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            msg.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            msg.receiver.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (activeTab === 'inbox') {
            return matchesSearch && msg.receiverId === user.id;
        } else {
            return matchesSearch && msg.senderId === user.id;
        }
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        
        if (diffInSeconds < 60) return 'just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                    <Mail className="h-6 w-6 mr-2 text-blue-600" />
                    Messages
                </h1>
                <div className="relative w-full md:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="pl-10 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="border-b border-gray-200">
                    <div className="flex">
                        <button
                            onClick={() => setActiveTab('inbox')}
                            className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'inbox' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <ArrowRight className="h-5 w-5" />
                                <span>Inbox</span>
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    {messages.filter(msg => msg.receiverId === user.id).length}
                                </span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('sent')}
                            className={`flex-1 py-4 px-6 text-center font-medium ${activeTab === 'sent' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <ArrowLeft className="h-5 w-5" />
                                <span>Sent</span>
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    {messages.filter(msg => msg.senderId === user.id).length}
                                </span>
                            </div>
                        </button>
                    </div>
                </div>

                {selectedMessage ? (
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <button 
                                onClick={() => setSelectedMessage(null)}
                                className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                                <ChevronDown className="h-5 w-5 mr-1 transform rotate-90" />
                                Back to messages
                            </button>
                            <div className="text-sm text-gray-500">
                                {formatDate(selectedMessage.timestamp)}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0">
                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {selectedMessage.senderId === user.id ? 
                                                `To: ${selectedMessage.receiver}` : 
                                                `From: ${selectedMessage.sender}`}
                                        </h3>
                                    </div>
                                    <p className="mt-2 text-gray-700 whitespace-pre-line">
                                        {selectedMessage.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {filteredMessages.length === 0 ? (
                            <div className="p-8 text-center">
                                <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">
                                    No {activeTab === 'inbox' ? 'incoming' : 'sent'} messages
                                </h3>
                                <p className="mt-1 text-gray-500">
                                    {activeTab === 'inbox' ? 
                                        'Your inbox is empty' : 
                                        "You haven't sent any messages yet"}
                                </p>
                            </div>
                        ) : (
                            filteredMessages.map((msg) => (
                                <div 
                                    key={msg.id} 
                                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                    onClick={() => setSelectedMessage(msg)}
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                <User className="h-5 w-5 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-medium text-gray-900">
                                                    {msg.senderId === user.id ? 
                                                        `To: ${msg.receiver}` : 
                                                        `From: ${msg.sender}`}
                                                </h3>
                                                <div className="text-xs text-gray-500">
                                                    {formatDate(msg.timestamp)}
                                                </div>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600 truncate">
                                                {msg.content}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;