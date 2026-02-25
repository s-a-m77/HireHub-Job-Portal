import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { Job } from '@/types';
import {
  Briefcase, Plus, Users, Eye, MapPin, Clock, DollarSign,
  Trash2, CheckCircle, XCircle, ArrowLeft, Mail, Building2,
  Search, GraduationCap, Crown, Zap, Shield, Check, Megaphone,
  Target, Award, BarChart3, MessageSquare, Send
} from 'lucide-react';

const formatDate = (d: string) => {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff}d ago`;
};

export { EmployerMessagesPage } from './EmployerMessages';

export function EmployerDashboard() {
  const { currentUser, navigate, getJobsForEmployer, getApplicationsForJob, applications, users, sendMessage, theme } = useApp();
  
  // Hooks must be called at the top, before any early returns
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  
  const dk = theme === 'dark';
  if (!currentUser) return null;

  // Check if employer is approved
  if (currentUser.role === 'employer' && !currentUser.isApproved) {
    return (
      <div className={`min-h-screen ${dk ? 'bg-gray-950' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className={`max-w-md w-full mx-auto p-8 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>Account Pending Approval</h1>
            <p className={`mb-6 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
              Your employer account is currently under review by our administrators. 
              You will receive an email notification once your account has been approved.
            </p>
            <div className={`bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-lg border ${dk ? 'border-indigo-800/50' : 'border-indigo-200/50'} mb-6`}>
              <p className={`text-sm ${dk ? 'text-gray-300' : 'text-gray-600'}`}>
                <strong>What happens next?</strong><br />
                • An administrator will review your account<br />
                • You'll receive an email when approved<br />
                • You'll be able to post jobs and access all employer features
              </p>
            </div>
            <button
              onClick={() => navigate('home')}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const myJobs = getJobsForEmployer(currentUser.id);
  const activeJobs = myJobs.filter(j => j.status === 'active');
  const totalApplicants = myJobs.reduce((sum, j) => sum + j.applicantCount, 0);
  const allMyApps = applications.filter(a => myJobs.some(j => j.id === a.jobId));
  const pendingApps = allMyApps.filter(a => a.status === 'pending');

  const admins = users.filter(u => u.role === 'admin');

  const stats = [
    { label: 'Total Jobs Posted', value: myJobs.length, icon: Briefcase, bg: dk ? 'bg-indigo-900/30' : 'bg-indigo-50', color: dk ? 'text-indigo-400' : 'text-indigo-600' },
    { label: 'Active Listings', value: activeJobs.length, icon: Eye, bg: dk ? 'bg-green-900/30' : 'bg-green-50', color: dk ? 'text-green-400' : 'text-green-600' },
    { label: 'Total Applicants', value: totalApplicants, icon: Users, bg: dk ? 'bg-purple-900/30' : 'bg-purple-50', color: dk ? 'text-purple-400' : 'text-purple-600' },
    { label: 'Pending Review', value: pendingApps.length, icon: Clock, bg: dk ? 'bg-amber-900/30' : 'bg-amber-50', color: dk ? 'text-amber-400' : 'text-amber-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Employer Dashboard</h1>
          <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{currentUser.companyName || 'Your Company'}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMessageModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl text-sm font-medium hover:from-purple-600 hover:to-pink-700 shadow-lg shadow-purple-200"
          >
            <MessageSquare className="w-4 h-4" /> Message Admin
          </button>
          <button
            onClick={() => navigate('post-job')}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-200"
          >
            <Plus className="w-4 h-4" /> Post New Job
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className={`rounded-2xl border p-5 ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>{s.value}</div>
            <div className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Post a Job', icon: Plus, page: 'post-job' as const, desc: 'Create new listing' },
          { label: 'Find Talent', icon: Search, page: 'find-talent' as const, desc: 'Browse candidates' },
          { label: 'Employer Branding', icon: Megaphone, page: 'employer-branding' as const, desc: 'Build your brand' },
          { label: 'Campus Recruiting', icon: GraduationCap, page: 'campus-recruiting' as const, desc: 'Hire students' },
        ].map((action, i) => (
          <button
            key={i}
            onClick={() => navigate(action.page)}
            className={`rounded-xl border p-5 text-left hover:shadow-md transition-all group ${dk ? 'bg-gray-900 border-gray-800 hover:border-indigo-800' : 'bg-white border-gray-100 hover:border-indigo-100'}`}
          >
            <action.icon className="w-6 h-6 text-indigo-500 mb-2 group-hover:scale-110 transition-transform" />
            <div className={`font-medium ${dk ? 'text-white' : 'text-gray-900'}`}>{action.label}</div>
            <div className={`text-xs ${dk ? 'text-gray-500' : 'text-gray-500'}`}>{action.desc}</div>
          </button>
        ))}
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>Your Job Listings</h2>
          <button onClick={() => navigate('manage-jobs')} className="text-sm text-indigo-600 font-medium">View All</button>
        </div>
        {myJobs.length === 0 ? (
          <div className={`text-center py-12 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <Briefcase className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
            <p className={`mb-4 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>You haven't posted any jobs yet</p>
            <button onClick={() => navigate('post-job')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium">Post Your First Job</button>
          </div>
        ) : (
          <div className={`rounded-xl border overflow-hidden ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            {myJobs.slice(0, 5).map(job => {
              const jobApps = getApplicationsForJob(job.id);
              return (
                <div key={job.id} className={`flex items-center justify-between p-4 border-b last:border-0 transition ${dk ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-50 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${dk ? 'bg-gray-800' : 'bg-indigo-50'}`}>
                      {job.companyLogo || '🏢'}
                    </div>
                    <div className="min-w-0">
                      <div className={`font-medium text-sm truncate ${dk ? 'text-white' : 'text-gray-900'}`}>{job.title}</div>
                      <div className={`text-xs ${dk ? 'text-gray-500' : 'text-gray-500'}`}>{job.location} • {job.type} • {formatDate(job.postedDate)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${job.status === 'active' ? (dk ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700') : (dk ? 'bg-red-900/40 text-red-400' : 'bg-red-50 text-red-700')
                      }`}>
                      {job.status}
                    </span>
                    <span className={`text-xs ${dk ? 'text-gray-500' : 'text-gray-500'}`}>{jobApps.length} applicants</span>
                    <button onClick={() => navigate('view-applicants', job.id)} className="px-3 py-1.5 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium">
                      View
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Message Admin Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl border max-w-2xl w-full max-h-[90vh] overflow-y-auto ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className={`p-6 border-b flex items-center justify-between ${dk ? 'border-gray-800' : 'border-gray-100'}`}>
              <div>
                <h2 className={`text-xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Message Admin</h2>
                <p className={`text-sm mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Send a message to the platform administrators</p>
              </div>
              <button
                onClick={() => {
                  setShowMessageModal(false);
                  setMessageSent(false);
                  setMessageSubject('');
                  setMessageBody('');
                }}
                className={`p-2 rounded-lg ${dk ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {messageSent ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className={`text-lg font-semibold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>Message Sent!</h3>
                  <p className={dk ? 'text-gray-400' : 'text-gray-500'}>Your message has been sent to the administrators. They will get back to you soon.</p>
                  <button
                    onClick={() => {
                      setShowMessageModal(false);
                      setMessageSent(false);
                      setMessageSubject('');
                      setMessageBody('');
                    }}
                    className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage(messageSubject, messageBody);
                    setMessageSent(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Subject *</label>
                    <input
                      type="text"
                      value={messageSubject}
                      onChange={(e) => setMessageSubject(e.target.value)}
                      required
                      placeholder="What is this message about?"
                      className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Message *</label>
                    <textarea
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      required
                      rows={6}
                      placeholder="Describe your question or concern..."
                      className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'}`}
                    />
                  </div>
                  {admins.length > 0 && (
                    <div className={`rounded-lg p-3 ${dk ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className={`text-xs font-medium mb-1 ${dk ? 'text-gray-400' : 'text-gray-600'}`}>Sending to:</p>
                      <div className="flex flex-wrap gap-2">
                        {admins.map(admin => (
                          <span key={admin.id} className={`text-xs px-2 py-1 rounded ${dk ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                            {admin.name || admin.email}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
                    >
                      Send Message
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMessageModal(false);
                        setMessageSubject('');
                        setMessageBody('');
                      }}
                      className={`px-6 py-2.5 border rounded-xl text-sm font-medium ${dk ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PostJobPage() {
  const { currentUser, postJob, navigate, theme } = useApp();
  
  // Hooks must be called at the top, before any early returns
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<Job['type']>('Full-time');
  const [salary, setSalary] = useState('');
  const [category, setCategory] = useState('');
  const [deadline, setDeadline] = useState('');
  const [reqInput, setReqInput] = useState('');
  const [requirements, setRequirements] = useState<string[]>([]);
  
  const dk = theme === 'dark';
  if (!currentUser) return null;

  // Check if employer is approved
  if (currentUser.role === 'employer' && !currentUser.isApproved) {
    return (
      <div className={`min-h-screen ${dk ? 'bg-gray-950' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className={`max-w-md w-full mx-auto p-8 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className={`text-2xl font-bold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>Account Pending Approval</h1>
            <p className={`mb-6 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
              Your employer account is currently under review by our administrators. 
              You will receive an email notification once your account has been approved.
            </p>
            <div className={`bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-lg border ${dk ? 'border-indigo-800/50' : 'border-indigo-200/50'} mb-6`}>
              <p className={`text-sm ${dk ? 'text-gray-300' : 'text-gray-600'}`}>
                <strong>What happens next?</strong><br />
                • An administrator will review your account<br />
                • You'll receive an email when approved<br />
                • You'll be able to post jobs and access all employer features
              </p>
            </div>
            <button
              onClick={() => navigate('employer-dashboard')}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const addReq = () => {
    if (reqInput.trim()) { setRequirements([...requirements, reqInput.trim()]); setReqInput(''); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postJob({ employerId: currentUser.id, companyName: currentUser.companyName || currentUser.name, companyLogo: currentUser.companyLogo, title, description, location, type, salary, category, deadline: deadline || new Date(Date.now() + 30 * 86400000).toISOString(), requirements, status: 'active' });
    navigate('manage-jobs');
  };

  const inputCls = `w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate('employer-dashboard')} className={`flex items-center gap-1 text-sm mb-6 ${dk ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'}`}>
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <h1 className={`text-2xl font-bold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>Post a New Job</h1>
      <p className={`mb-6 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Fill in the details to create a new job listing</p>

      <form onSubmit={handleSubmit} className={`rounded-2xl border p-6 sm:p-8 space-y-5 ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div>
          <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Job Title *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Senior Frontend Developer" className={inputCls} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Location *</label>
            <input value={location} onChange={e => setLocation(e.target.value)} required placeholder="e.g. San Francisco, CA" className={inputCls} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Job Type *</label>
            <select value={type} onChange={e => setType(e.target.value as Job['type'])} className={inputCls}>
              <option>Full-time</option><option>Part-time</option><option>Internship</option><option>Contract</option><option>Remote</option>
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Salary Range *</label>
            <input value={salary} onChange={e => setSalary(e.target.value)} required placeholder="e.g. $80,000 - $120,000" className={inputCls} />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Category *</label>
            <select value={category} onChange={e => setCategory(e.target.value)} required className={inputCls}>
              <option value="">Select category</option>
              <option>Engineering</option><option>Design</option><option>Marketing</option><option>Data & Analytics</option><option>Sales</option><option>Human Resources</option><option>Finance</option><option>Operations</option><option>Other</option>
            </select>
          </div>
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Application Deadline</label>
          <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className={inputCls} />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Job Description *</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={6} placeholder="Describe the role..." className={`${inputCls} resize-none`} />
        </div>
        <div>
          <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Requirements</label>
          <div className="flex gap-2 mb-2">
            <input value={reqInput} onChange={e => setReqInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addReq(); } }} placeholder="Add a requirement" className={`flex-1 ${inputCls}`} />
            <button type="button" onClick={addReq} className={`px-4 py-2.5 rounded-xl text-sm font-medium ${dk ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Add</button>
          </div>
          {requirements.length > 0 && (
            <ul className="space-y-1.5">
              {requirements.map((r, i) => (
                <li key={i} className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm ${dk ? 'bg-gray-800 text-gray-300' : 'bg-gray-50'}`}>
                  <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> {r}</span>
                  <button type="button" onClick={() => setRequirements(requirements.filter((_, idx) => idx !== i))} className="text-gray-400 hover:text-red-500"><XCircle className="w-4 h-4" /></button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-200">Publish Job</button>
          <button type="button" onClick={() => navigate('employer-dashboard')} className={`px-6 py-3 border rounded-xl font-medium ${dk ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export function ManageJobs() {
  const { currentUser, navigate, getJobsForEmployer, getApplicationsForJob, updateJob, deleteJob, theme } = useApp();
  const dk = theme === 'dark';
  if (!currentUser) return null;
  const myJobs = getJobsForEmployer(currentUser.id);

  const toggleStatus = (job: Job) => { updateJob({ ...job, status: job.status === 'active' ? 'closed' : 'active' }); };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Manage Jobs</h1>
          <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{myJobs.length} total job listings</p>
        </div>
        <button onClick={() => navigate('post-job')} className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> New Job
        </button>
      </div>

      {myJobs.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <Briefcase className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={`mb-4 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>No jobs posted yet</p>
          <button onClick={() => navigate('post-job')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium">Post Your First Job</button>
        </div>
      ) : (
        <div className="space-y-3">
          {myJobs.map(job => {
            const jobApps = getApplicationsForJob(job.id);
            return (
              <div key={job.id} className={`rounded-xl border p-5 ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold truncate ${dk ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${job.status === 'active' ? (dk ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700') : (dk ? 'bg-red-900/40 text-red-400' : 'bg-red-50 text-red-700')
                        }`}>{job.status}</span>
                    </div>
                    <div className={`flex flex-wrap gap-3 text-xs ${dk ? 'text-gray-500' : 'text-gray-500'}`}>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {job.type}</span>
                      <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                      <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {jobApps.length} applicants</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(job.postedDate)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => navigate('view-applicants', job.id)} className={`px-3 py-1.5 text-xs font-medium text-indigo-600 rounded-lg border ${dk ? 'border-indigo-800 hover:bg-indigo-900/30' : 'border-indigo-100 hover:bg-indigo-50'}`}>
                      <Users className="w-3.5 h-3.5 inline mr-1" />{jobApps.length}
                    </button>
                    <button onClick={() => toggleStatus(job)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${job.status === 'active' ? (dk ? 'text-red-400 border-red-800 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50 border-red-100') : (dk ? 'text-green-400 border-green-800 hover:bg-green-900/30' : 'text-green-600 hover:bg-green-50 border-green-100')
                      }`}>{job.status === 'active' ? 'Close' : 'Reopen'}</button>
                    <button onClick={() => deleteJob(job.id)} className={`p-1.5 rounded-lg ${dk ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ViewApplicants() {
  const {
    selectedJobId,
    getJobById,
    getApplicationsForJob,
    updateApplicationStatus,
    navigate,
    users,
    sendStudentMessage,
    theme,
  } = useApp();
  const dk = theme === 'dark';
  const job = selectedJobId ? getJobById(selectedJobId) : undefined;
  const applicants = selectedJobId ? getApplicationsForJob(selectedJobId) : [];

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className={dk ? 'text-gray-400' : 'text-gray-500'}>Job not found</p>
        <button onClick={() => navigate('manage-jobs')} className="mt-4 text-indigo-600">
          Back to Jobs
        </button>
      </div>
    );
  }

  const handleSendMessageClick = (student: any, app: any) => {
    // Use student from users array, or fall back to app data
    const studentData = student || {
      id: app.studentId,
      name: app.studentName,
      email: app.studentEmail
    };
    
    if (!studentData || !studentData.id) {
      console.error('Student data not found for messaging');
      return;
    }
    
    setSelectedStudent(studentData);
    setShowMessageModal(true);
    setMessageSent(false);
    setMessageSubject(`Regarding your application for ${job.title}`);
    setMessageBody('');
  };

  const handleSendMessage = () => {
    if (selectedStudent && messageSubject && messageBody) {
      sendStudentMessage(selectedStudent.id, messageSubject, messageBody);
      setMessageSent(true);
    }
  };

  const statusColors: Record<string, string> = {
    pending: dk ? 'bg-yellow-900/40 text-yellow-400' : 'bg-yellow-50 text-yellow-700',
    reviewed: dk ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-700',
    shortlisted: dk ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700',
    accepted: dk ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-50 text-emerald-700',
    rejected: dk ? 'bg-red-900/40 text-red-400' : 'bg-red-50 text-red-700',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate('manage-jobs')}
        className={`flex items-center gap-1 text-sm mb-6 ${
          dk ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'
        }`}
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Jobs
      </button>
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>
          Applicants for "{job.title}"
        </h1>
        <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
          {applicants.length} total applicants
        </p>
      </div>

      {applicants.length === 0 ? (
        <div
          className={`text-center py-16 rounded-2xl border ${
            dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
          }`}
        >
          <Users className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={dk ? 'text-gray-400' : 'text-gray-500'}>
            No one has applied to this job yet
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applicants.map(app => {
            const student = users.find(u => u.id === app.studentId);
            return (
              <div
                key={app.id}
                className={`rounded-xl border p-5 ${
                  dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium flex-shrink-0">
                      {app.studentName.charAt(0)}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>
                        {app.studentName}
                      </h3>
                      <p
                        className={`text-sm flex items-center gap-1 ${
                          dk ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        <Mail className="w-3 h-3" /> {app.studentEmail}
                      </p>
                      {student?.education && (
                        <p
                          className={`text-sm flex items-center gap-1 mt-0.5 ${
                            dk ? 'text-gray-400' : 'text-gray-500'
                          }`}
                        >
                          <GraduationCap className="w-3 h-3" /> {student.education}
                        </p>
                      )}
                      {student?.skills && student.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {student.skills.map(s => (
                            <span
                              key={s}
                              className={`px-2 py-0.5 rounded text-xs ${
                                dk
                                  ? 'bg-indigo-900/40 text-indigo-400'
                                  : 'bg-indigo-50 text-indigo-600'
                              }`}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      {app.coverLetter && (
                        <div className={`mt-3 p-3 rounded-lg ${dk ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <p
                            className={`text-xs font-medium mb-1 ${
                              dk ? 'text-gray-500' : 'text-gray-500'
                            }`}
                          >
                            Cover Letter:
                          </p>
                          <p className={`text-sm ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                            {app.coverLetter}
                          </p>
                        </div>
                      )}
                      <p className={`text-xs mt-2 ${dk ? 'text-gray-500' : 'text-gray-400'}`}>
                        Applied {formatDate(app.appliedDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        statusColors[app.status] || ''
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => handleSendMessageClick(student, app)}
                        className={`px-2.5 py-1 text-xs rounded-lg flex items-center gap-1 ${
                          dk
                            ? 'bg-purple-900/30 text-purple-400 hover:bg-purple-900/50'
                            : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                        }`}
                      >
                        <MessageSquare className="w-3 h-3" /> Message
                      </button>
                      {app.status !== 'reviewed' && (
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'reviewed')}
                          className={`px-2.5 py-1 text-xs rounded-lg ${
                            dk
                              ? 'bg-blue-900/30 text-blue-400 hover:bg-blue-900/50'
                              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                          }`}
                        >
                          Review
                        </button>
                      )}
                      {app.status !== 'shortlisted' && (
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'shortlisted')}
                          className={`px-2.5 py-1 text-xs rounded-lg ${
                            dk
                              ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                              : 'bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          Shortlist
                        </button>
                      )}
                      {app.status !== 'accepted' && (
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'accepted')}
                          className={`px-2.5 py-1 text-xs rounded-lg ${
                            dk
                              ? 'bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          }`}
                        >
                          Accept
                        </button>
                      )}
                      {app.status !== 'rejected' && (
                        <button
                          onClick={() => updateApplicationStatus(app.id, 'rejected')}
                          className={`px-2.5 py-1 text-xs rounded-lg ${
                            dk
                              ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                              : 'bg-red-50 text-red-700 hover:bg-red-100'
                          }`}
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl border max-w-lg w-full ${
              dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'
            }`}
          >
            <div
              className={`p-6 border-b flex items-center justify-between ${
                dk ? 'border-gray-800' : 'border-gray-100'
              }`}
            >
              <div>
                <h2 className={`text-xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>
                  Send Message
                </h2>
                <p className={`text-sm mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                  To: {selectedStudent?.name}
                </p>
              </div>
              <button
                onClick={() => setShowMessageModal(false)}
                className={`p-2 rounded-lg ${
                  dk ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {messageSent ? (
                <div className="text-center py-8">
                  <Send className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className={`text-lg font-semibold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>
                    Message Sent!
                  </h3>
                  <p className={dk ? 'text-gray-400' : 'text-gray-500'}>
                    Your message has been sent to {selectedStudent?.name}.
                  </p>
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    if (selectedStudent && messageSubject && messageBody) {
                      sendStudentMessage(selectedStudent.id, messageSubject, messageBody);
                      setMessageSent(true);
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        dk ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Subject *
                    </label>
                    <input
                      type="text"
                      value={messageSubject}
                      onChange={e => setMessageSubject(e.target.value)}
                      required
                      placeholder="Message subject"
                      className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${
                        dk
                          ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        dk ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      Message *
                    </label>
                    <textarea
                      value={messageBody}
                      onChange={e => setMessageBody(e.target.value)}
                      required
                      rows={5}
                      placeholder="Your message..."
                      className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                        dk
                          ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500'
                          : 'border-gray-200'
                      }`}
                    />
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Send Message
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMessageModal(false)}
                      className={`px-6 py-2.5 border rounded-xl text-sm font-medium ${
                        dk
                          ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function FindTalent() {
  const { getStudents, theme } = useApp();
  const dk = theme === 'dark';
  const students = getStudents();
  const [search, setSearch] = useState('');

  const filtered = students.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.skills?.some(sk => sk.toLowerCase().includes(search.toLowerCase())) ||
    s.education?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className={`text-2xl font-bold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>Find Talent</h1>
      <p className={`mb-6 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Browse student profiles to find the perfect candidate</p>

      <div className="flex gap-3 mb-6">
        <div className={`flex-1 flex items-center gap-2 px-4 border rounded-xl ${dk ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <Search className={`w-5 h-5 ${dk ? 'text-gray-500' : 'text-gray-400'}`} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, skills, or education..." className={`w-full py-2.5 outline-none text-sm ${dk ? 'bg-transparent text-gray-100 placeholder-gray-500' : ''}`} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <Users className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={dk ? 'text-gray-400' : 'text-gray-500'}>No students found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(student => (
            <div key={student.id} className={`rounded-xl border p-5 hover:shadow-sm transition ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {student.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>{student.name}</h3>
                  <p className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{student.email}</p>
                  {student.education && <p className={`text-sm mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>🎓 {student.education}</p>}
                  {student.bio && <p className={`text-sm mt-2 ${dk ? 'text-gray-400' : 'text-gray-600'}`}>{student.bio}</p>}
                  {student.skills && student.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {student.skills.map(s => (
                        <span key={s} className={`px-2.5 py-1 rounded-full text-xs font-medium ${dk ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BrowseCompanies() {
  const { getEmployers, jobs, navigate, currentUser, theme } = useApp();
  const dk = theme === 'dark';
  const employers = getEmployers();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className={`text-2xl font-bold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>Companies</h1>
      <p className={`mb-6 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Explore companies hiring on HireHub</p>

      {employers.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <Building2 className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={dk ? 'text-gray-400' : 'text-gray-500'}>No companies registered yet</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {employers.map(emp => {
            const companyJobs = jobs.filter(j => j.employerId === emp.id && j.status === 'active');
            const isOwn = currentUser?.id === emp.id;
            return (
              <div key={emp.id} className={`rounded-2xl border p-6 hover:shadow-md transition ${isOwn ? 'border-indigo-200 ring-1 ring-indigo-100' : dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                {isOwn && <span className="text-xs font-medium text-indigo-600 mb-2 block">Your Company</span>}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${dk ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
                    {emp.companyLogo || '🏢'}
                  </div>
                  <div>
                    <h3 className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>{emp.companyName || emp.name}</h3>
                    <p className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{emp.industry || 'Technology'}</p>
                  </div>
                </div>
                {emp.companyDescription && <p className={`text-sm mb-3 line-clamp-2 ${dk ? 'text-gray-400' : 'text-gray-600'}`}>{emp.companyDescription}</p>}
                <div className={`flex flex-wrap gap-2 text-xs mb-4 ${dk ? 'text-gray-500' : 'text-gray-500'}`}>
                  {emp.companyLocation && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {emp.companyLocation}</span>}
                  {emp.companySize && <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {emp.companySize}</span>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-600">{companyJobs.length} open positions</span>
                  {companyJobs.length > 0 && (
                    <button onClick={() => navigate('browse-jobs')} className={`text-sm ${dk ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'}`}>View Jobs →</button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function EmployerBranding() {
  const { currentUser, updateUser, navigate, theme } = useApp();
  const dk = theme === 'dark';
  if (!currentUser) return null;

  const [companyName, setCompanyName] = useState(currentUser.companyName || '');
  const [description, setDescription] = useState(currentUser.companyDescription || '');
  const [website, setWebsite] = useState(currentUser.companyWebsite || '');
  const [location, setLocation] = useState(currentUser.companyLocation || '');
  const [size, setSize] = useState(currentUser.companySize || '');
  const [industry, setIndustry] = useState(currentUser.industry || '');
  const [logo, setLogo] = useState(currentUser.companyLogo || '🏢');
  const [saved, setSaved] = useState(false);

  const logos = ['🏢', '🏗️', '💼', '🚀', '🎨', '🌱', '💰', '⚡', '🔬', '🎯', '🌐', '💎', '🛡️', '📱', '🤖'];
  const inputCls = `w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${dk ? 'bg-gray-800 border-gray-700 text-gray-100' : 'border-gray-200'}`;

  const handleSave = () => {
    updateUser({ ...currentUser, companyName, companyDescription: description, companyWebsite: website, companyLocation: location, companySize: size, industry, companyLogo: logo });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate('employer-dashboard')} className={`flex items-center gap-1 text-sm mb-6 ${dk ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'}`}>
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <div className="flex items-center gap-3 mb-6">
        <Megaphone className="w-7 h-7 text-indigo-600" />
        <div>
          <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Employer Branding</h1>
          <p className={dk ? 'text-gray-400' : 'text-gray-500'}>Customize your company profile to attract top talent</p>
        </div>
      </div>

      <div className={`rounded-2xl border p-6 sm:p-8 space-y-5 ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div>
          <label className={`block text-sm font-medium mb-2 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Company Logo</label>
          <div className="flex flex-wrap gap-2">
            {logos.map(l => (
              <button key={l} type="button" onClick={() => setLogo(l)}
                className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center border-2 transition ${logo === l ? 'border-indigo-500 bg-indigo-50' : dk ? 'border-gray-700 hover:border-gray-600' : 'border-gray-100 hover:border-gray-200'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Company Name</label><input value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputCls} /></div>
          <div><label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Industry</label><input value={industry} onChange={e => setIndustry(e.target.value)} className={inputCls} /></div>
          <div><label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Location</label><input value={location} onChange={e => setLocation(e.target.value)} placeholder="City, State" className={inputCls} /></div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Company Size</label>
            <select value={size} onChange={e => setSize(e.target.value)} className={inputCls}>
              <option value="">Select size</option><option>1-10</option><option>10-50</option><option>50-200</option><option>200-500</option><option>500-1000</option><option>1000+</option>
            </select>
          </div>
        </div>
        <div><label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Website</label><input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://..." className={inputCls} /></div>
        <div><label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Company Description</label><textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder="Tell candidates about your company..." className={`${inputCls} resize-none`} /></div>
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">Save Changes</button>
          {saved && <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Saved!</span>}
        </div>
      </div>
    </div>
  );
}

export function CampusRecruiting() {
  const { navigate, theme } = useApp();
  const dk = theme === 'dark';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate('employer-dashboard')} className={`flex items-center gap-1 text-sm mb-6 ${dk ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'}`}>
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className={`text-3xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Campus Recruiting</h1>
        <p className={`mt-2 max-w-xl mx-auto ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Connect directly with university students and recent graduates.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        {[
          { icon: Target, title: 'Targeted Outreach', desc: 'Reach students at specific universities with tailored job postings and internship opportunities.' },
          { icon: Award, title: 'Campus Events', desc: 'Host virtual career fairs, info sessions, and hackathons to engage with student talent.' },
          { icon: BarChart3, title: 'Analytics', desc: 'Track engagement, application rates, and conversion metrics from campus campaigns.' },
        ].map((item, i) => (
          <div key={i} className={`rounded-2xl border p-6 ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${dk ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
              <item.icon className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className={`font-semibold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
            <p className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
          </div>
        ))}
      </div>
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
        <h2 className="text-2xl font-bold mb-3">Start Recruiting on Campus</h2>
        <p className="text-indigo-100 mb-6">Post internships and entry-level positions to attract top university talent.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <button onClick={() => navigate('post-job')} className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-medium hover:bg-gray-50">Post an Internship</button>
          <button onClick={() => navigate('find-talent')} className="px-6 py-3 border border-white/30 text-white rounded-xl font-medium hover:bg-white/10">Browse Students</button>
        </div>
      </div>
    </div>
  );
}

export function PricingPlans() {
  const { navigate, theme } = useApp();
  const dk = theme === 'dark';

  const plans = [
    { name: 'Starter', price: 'Free', period: '', desc: 'Perfect for small businesses getting started', icon: Zap, features: ['Post up to 3 jobs', 'Basic applicant tracking', 'Email support', 'Company profile'], cta: 'Current Plan', popular: false },
    { name: 'Professional', price: '$49', period: '/month', desc: 'For growing companies with active hiring needs', icon: Crown, features: ['Unlimited job posts', 'Advanced analytics', 'Priority support', 'Employer branding', 'Featured listings', 'Campus recruiting'], cta: 'Upgrade Now', popular: true },
    { name: 'Enterprise', price: '$149', period: '/month', desc: 'For large organizations with complex needs', icon: Shield, features: ['Everything in Pro', 'Dedicated account manager', 'Custom integrations', 'API access', 'Bulk job posting', 'Advanced reporting', 'SLA guarantee'], cta: 'Contact Sales', popular: false },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate('employer-dashboard')} className={`flex items-center gap-1 text-sm mb-6 ${dk ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'}`}>
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </button>
      <div className="text-center mb-12">
        <h1 className={`text-3xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Pricing Plans</h1>
        <p className={`mt-2 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Choose the plan that best fits your hiring needs</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <div key={i} className={`rounded-2xl border-2 p-6 relative ${plan.popular ? 'border-indigo-500 shadow-xl shadow-indigo-100' : dk ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-medium rounded-full">Most Popular</div>
            )}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${dk ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
              <plan.icon className="w-6 h-6 text-indigo-600" />
            </div>
            <h3 className={`text-xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
            <div className="mt-2 mb-1">
              <span className={`text-3xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
              <span className={dk ? 'text-gray-400' : 'text-gray-500'}>{plan.period}</span>
            </div>
            <p className={`text-sm mb-6 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{plan.desc}</p>
            <ul className="space-y-3 mb-6">
              {plan.features.map((f, fi) => (
                <li key={fi} className={`flex items-center gap-2 text-sm ${dk ? 'text-gray-300' : 'text-gray-600'}`}>
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-2.5 rounded-xl font-medium text-sm ${plan.popular ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700' : dk ? 'border border-gray-700 text-gray-300 hover:bg-gray-800' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}>{plan.cta}</button>
          </div>
        ))}
      </div>
    </div>
  );
}
