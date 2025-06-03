import { Search, Gavel, FileText, Users, MessageSquare, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

interface UserData {
  username: string;
  role: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<UserData>({ username: 'Guest', role: 'user' });

  useEffect(() => {
    // Safely get user data from localStorage
    const loadUserData = () => {
      try {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser({
          username: userData.username || 'Guest',
          role: userData.role || 'user'
        });
      } catch (error: unknown) {
        console.error('Error parsing user data:', error instanceof Error ? error.message : 'Unknown error');
        setUser({ username: 'Guest', role: 'user' });
      }
    };

    loadUserData();
  }, []);

  // Modified array: Removed Legal Consultation, Case Management, and Appointments
  const dashboardButtons = [
    {
      title: "Search Legal Cases",
      href: "/search",
      icon: <Search className="w-6 h-6" />,
      bgColor: "bg-blue-500 hover:bg-blue-600"
    },
    {
      title: "Lawyer Directory",
      href: "/lawyer-directory",
      icon: <Users className="w-6 h-6" />,
      bgColor: "bg-emerald-500 hover:bg-emerald-600"
    },
    {
      title: "Document Templates",
      href: "/document-templates",
      icon: <FileText className="w-6 h-6" />,
      bgColor: "bg-purple-500 hover:bg-purple-600"
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, <span className="font-semibold text-blue-600">{user.username}</span> ({user.role})
          </p>
        </div>
        {/* Settings button has been removed */}
      </div>

      {/* Adjusted grid columns based on remaining items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardButtons.map((button, index) => (
          <a
            key={index}
            href={button.href}
            className={`${button.bgColor} text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center gap-3 aspect-square sm:aspect-auto`}
          >
            <div className="p-3 bg-white/20 rounded-full mb-2">
              {button.icon}
            </div>
            <h3 className="text-xl font-semibold text-center leading-tight">{button.title}</h3>
            <span className="text-white/80 text-sm">Click to access</span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;