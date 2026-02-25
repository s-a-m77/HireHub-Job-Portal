import { AppProvider, useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { HomePage } from '@/pages/Home';
import { LoginPage, RegisterPage } from '@/pages/auth/AuthPages';
import { AdminLoginPage } from '@/pages/auth/AdminLoginPage';
import { ContactPage } from '@/pages/ContactPage';
import {
  StudentDashboard,
  BrowseJobs,
  JobDetail,
  AppliedJobs,
  StudentProfile,
  StudentMessagesPage,
} from '@/pages/student/StudentPages';
import {
  EmployerDashboard, PostJobPage, ManageJobs, ViewApplicants,
  FindTalent, BrowseCompanies, EmployerBranding, CampusRecruiting, PricingPlans, EmployerMessagesPage
} from '@/pages/employer/EmployerPages';
import { AdminDashboard, ManageStudents, ManageEmployers, ManageAllJobs, AdminMessages, ContactInboxPage, AnnouncementsPage } from '@/pages/admin/AdminPages';
import { PublicAnnouncementsPage } from '@/pages/AnnouncementsPage';



function Router() {
  const { currentPage, theme, currentUser } = useApp();
  const dk = theme === 'dark';

  const renderPage = () => {
    // Admin route protection
    if (currentPage.startsWith('admin-') && currentUser?.role !== 'admin') {
      return <HomePage />; // Redirect unauthorized users to home
    }

    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'login': return <LoginPage />;
      case 'register': return <RegisterPage />;
      case 'contact': return <ContactPage />;
      case 'admin': return <AdminLoginPage />;
      // Student
      case 'student-dashboard': return <StudentDashboard />;
      case 'browse-jobs': return <BrowseJobs />;
      case 'job-detail': return <JobDetail />;
      case 'applied-jobs': return <AppliedJobs />;
      case 'student-profile': return <StudentProfile />;
      case 'student-messages': return <StudentMessagesPage />;
      // Employer
      case 'employer-dashboard': return <EmployerDashboard />;
      case 'post-job': return <PostJobPage />;
      case 'manage-jobs': return <ManageJobs />;
      case 'view-applicants': return <ViewApplicants />;
      case 'find-talent': return <FindTalent />;
      case 'browse-companies': return <BrowseCompanies />;
      case 'employer-branding': return <EmployerBranding />;
      case 'campus-recruiting': return <CampusRecruiting />;
      case 'pricing': return <PricingPlans />;
      case 'employer-messages': return <EmployerMessagesPage />;
      // Admin (protected)
      case 'admin-dashboard': return <AdminDashboard />;
      case 'manage-students': return <ManageStudents />;
      case 'manage-employers': return <ManageEmployers />;
      case 'manage-all-jobs': return <ManageAllJobs />;
      case 'admin-messages': return <AdminMessages />;
      case 'admin-contact-inbox': return <ContactInboxPage />;
      case 'announcements': return <AnnouncementsPage />;
      case 'public-announcements': return <PublicAnnouncementsPage />;
      default: return <HomePage />;
    }
  };

  const hideNavbar = currentPage === 'login' || currentPage === 'register';

  return (
    <div className={`min-h-screen ${dk ? 'bg-gray-950 text-gray-100' : 'bg-white text-gray-900'}`}>
      {!hideNavbar && <Navbar />}
      {renderPage()}
    </div>
  );
}

function AppContent() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Loading HireHub...</h1>
          <p className="text-gray-500 mt-1">Please wait while we set things up</p>
        </div>
      </div>
    );
  }

  return <Router />;
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

