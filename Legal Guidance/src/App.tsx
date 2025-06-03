import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import LawyerVerification from './components/LawyerVerification';
import LawyerVerificationStatus from './components/LawyerVerificationStatus';
import Search from './components/Search';
import LawyerDirectory from './components/LawyerDirectory';
import DocumentTemplates from './components/DocumentTemplates';
import PrivateRoute from './components/PrivateRoute';
import Messages from './components/Message';
import { LogIn, UserPlus, Gavel, Scale, BookOpen, FileText, Users, MessageSquare, Shield } from 'lucide-react';

const SplashScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Hero Section */}
      <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl w-full">
          <div className="flex justify-center mb-6">
            <Gavel className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-blue-600">Legal Guidance Portal</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your comprehensive legal solution with expert advice, document templates, and lawyer connections.
          </p>
          
          {/* Feature Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              { icon: <Scale className="w-8 h-8 mx-auto" />, text: "Case Evaluation" },
              { icon: <BookOpen className="w-8 h-8 mx-auto" />, text: "Legal Resources" },
              { icon: <Users className="w-8 h-8 mx-auto" />, text: "Expert Lawyers" },
              { icon: <FileText className="w-8 h-8 mx-auto" />, text: "Document Templates" },
            ].map((feature, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg hover:bg-blue-100 transition-colors">
                <div className="text-blue-600 mb-2">{feature.icon}</div>
                <p className="font-medium text-gray-700">{feature.text}</p>
              </div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/login" 
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg transition-colors shadow-md"
            >
              <UserPlus className="w-5 h-5" />
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <div className="container mx-auto">
          <p className="text-sm">© {new Date().getFullYear()} Legal Guidance Portal. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <main className="main-content fade-in">
      <h1 style={{ fontWeight: 600, fontSize: '2.5rem', marginBottom: '1rem', letterSpacing: '-1px' }}>
        Legal Guidance
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem', color: 'var(--color-primary)' }}>
        Your trusted platform for legal document templates, lawyer directory, and more.
      </p>
      <Router>
        <div className="min-h-screen">
          {/* Navigation Bar */}
          <nav className="bg-white shadow-sm p-4 sticky top-0 z-10">
            <div className="container mx-auto flex justify-between items-center">
              <Link to="/" className="text-xl font-bold text-blue-600 flex items-center gap-2">
                <Gavel className="w-6 h-6" />
                <span>Legal Guidance</span>
              </Link>
              <div className="flex items-center gap-4">
                {user.id ? (
                  <>
                    <div className="hidden md:flex gap-4">
                      <Link to="/dashboard" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
                        <Scale className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link to="/search" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
                        <BookOpen className="w-4 h-4" />
                        Search
                      </Link>
                      <Link to="/lawyer-directory" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
                        <Users className="w-4 h-4" />
                        Lawyers
                      </Link>
                      <Link to="/document-templates" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
                        <FileText className="w-4 h-4" />
                        Templates
                      </Link>
                      <Link to="/messages" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        Messages
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin-panel" className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors">
                          <Shield className="w-4 h-4" />
                          Admin
                        </Link>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        localStorage.removeItem('user');
                        window.location.href = '/login';
                      }}
                      className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <LogIn className="w-4 h-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-4">
                    <Link to="/login" className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
                      <LogIn className="w-4 h-4" />
                      Login
                    </Link>
                    <Link to="/register" className="flex items-center gap-1 px-4 py-2 border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <UserPlus className="w-4 h-4" />
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </nav>

          {/* Routes */}
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin-panel"
              element={
                <PrivateRoute>
                  <AdminPanel />
                </PrivateRoute>
              }
            />
            <Route
              path="/lawyer-verification"
              element={
                <PrivateRoute>
                  <LawyerVerification />
                </PrivateRoute>
              }
            />
            <Route
              path="/lawyer-verification-status"
              element={
                <PrivateRoute>
                  <LawyerVerificationStatus />
                </PrivateRoute>
              }
            />
            <Route
              path="/search"
              element={
                <PrivateRoute>
                  <Search />
                </PrivateRoute>
              }
            />
            <Route
              path="/lawyer-directory"
              element={
                <PrivateRoute>
                  <LawyerDirectory />
                </PrivateRoute>
              }
            />
            <Route
              path="/document-templates"
              element={
                <PrivateRoute>
                  <DocumentTemplates />
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <Messages />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
      {/* Example button for interactivity */}
      <button className="button">Get Started</button>
    </main>
  );
};

export default App;