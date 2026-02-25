import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Search, MapPin, Clock, DollarSign, Briefcase, FileText, CheckCircle, XCircle, Filter, ArrowLeft, Send, BookOpen, User, Mail, Phone, GraduationCap, Sparkles, Eye } from 'lucide-react';
export { StudentMessagesPage } from './StudentMessagesPage';

const formatDate = (d: string) => {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} days ago`;
};

const formatDeadline = (d: string) => {
  const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
  if (diff < 0) return 'Expired';
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return `${diff} days left`;
};

export function StudentDashboard() {
  const { currentUser, jobs, navigate, getApplicationsForStudent, theme } = useApp();
  const dk = theme === 'dark';
  // Hooks must be called at the top, before any early returns
  if (!currentUser) return null;

  const myApps = getApplicationsForStudent(currentUser.id);
  const activeJobs = jobs.filter(j => j.status === 'active');
  const recentJobs = activeJobs.slice(0, 4);

  const stats = [
    { label: 'Available Jobs', value: activeJobs.length, icon: Briefcase, bg: dk ? 'bg-indigo-900/30' : 'bg-indigo-50' },
    { label: 'Applications Sent', value: myApps.length, icon: Send, bg: dk ? 'bg-purple-900/30' : 'bg-purple-50' },
    { label: 'Shortlisted', value: myApps.filter(a => a.status === 'shortlisted').length, icon: CheckCircle, bg: dk ? 'bg-emerald-900/30' : 'bg-emerald-50' },
    { label: 'Under Review', value: myApps.filter(a => a.status === 'pending' || a.status === 'reviewed').length, icon: Eye, bg: dk ? 'bg-amber-900/30' : 'bg-amber-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Welcome back, {currentUser.name.split(' ')[0]}! 👋</h1>
        <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Here's what's happening with your job search</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className={`rounded-2xl border p-5 ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${dk ? 'text-gray-300' : 'text-gray-700'}`} />
              </div>
            </div>
            <div className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>{s.value}</div>
            <div className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{s.label}</div>
          </div>
        ))}
      </div>

      {(!currentUser.skills || currentUser.skills.length === 0 || !currentUser.education) && (
        <div className={`rounded-2xl p-6 mb-8 border ${dk ? 'bg-amber-900/20 border-amber-800/30' : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-100'}`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${dk ? 'bg-amber-900/40' : 'bg-amber-100'}`}>
              <Sparkles className={`w-5 h-5 ${dk ? 'text-amber-400' : 'text-amber-600'}`} />
            </div>
            <div>
              <h3 className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>Complete Your Profile</h3>
              <p className={`text-sm mt-1 ${dk ? 'text-gray-400' : 'text-gray-600'}`}>Add your skills and education to increase your chances of getting hired.</p>
              <button onClick={() => navigate('student-profile')} className="mt-3 px-4 py-2 bg-amber-500 text-white text-sm rounded-lg font-medium hover:bg-amber-600">
                Update Profile
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-lg font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>Recommended Jobs</h2>
          <button onClick={() => navigate('browse-jobs')} className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {recentJobs.map(job => (
            <div
              key={job.id}
              onClick={() => navigate('job-detail', job.id)}
              className={`rounded-xl border p-5 hover:shadow-md transition-all cursor-pointer ${dk ? 'bg-gray-900 border-gray-800 hover:border-indigo-800' : 'bg-white border-gray-100 hover:border-indigo-100'}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${dk ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
                  {job.companyLogo || '🏢'}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className={`font-semibold truncate ${dk ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                  <p className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{job.companyName}</p>
                  <div className={`flex flex-wrap gap-3 mt-2 text-xs ${dk ? 'text-gray-500' : 'text-gray-500'}`}>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(job.postedDate)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {myApps.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`text-lg font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>Recent Applications</h2>
            <button onClick={() => navigate('applied-jobs')} className="text-sm text-indigo-600 font-medium hover:text-indigo-700">View All</button>
          </div>
          <div className={`rounded-xl border overflow-hidden ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            {myApps.slice(0, 5).map(app => {
              const job = jobs.find(j => j.id === app.jobId);
              return (
                <div key={app.id} className={`flex items-center justify-between p-4 border-b last:border-0 ${dk ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-50 hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg ${dk ? 'bg-gray-800' : 'bg-indigo-50'}`}>
                      {job?.companyLogo || '🏢'}
                    </div>
                    <div>
                      <div className={`font-medium text-sm ${dk ? 'text-white' : 'text-gray-900'}`}>{job?.title || 'Unknown Job'}</div>
                      <div className={`text-xs ${dk ? 'text-gray-500' : 'text-gray-500'}`}>{job?.companyName} • Applied {formatDate(app.appliedDate)}</div>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${app.status === 'pending' ? (dk ? 'bg-yellow-900/40 text-yellow-400' : 'bg-yellow-50 text-yellow-700') :
                      app.status === 'reviewed' ? (dk ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-700') :
                        app.status === 'shortlisted' ? (dk ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700') :
                          app.status === 'accepted' ? (dk ? 'bg-emerald-900/40 text-emerald-400' : 'bg-emerald-50 text-emerald-700') :
                            (dk ? 'bg-red-900/40 text-red-400' : 'bg-red-50 text-red-700')
                    }`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function
  BrowseJobs() {
  const { jobs, navigate, searchQuery, setSearchQuery, filterType, setFilterType, currentUser, hasApplied, theme, location } = useApp();
  const dk = theme === 'dark';
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const activeJobs = jobs.filter(j => j.status === 'active');

  const filtered = activeJobs.filter(j => {
    const matchSearch = !searchQuery || j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchType = !filterType || j.type === filterType;
    const matchLocation = !location || j.location.toLowerCase().includes(location.toLowerCase());
    return matchSearch && matchType && matchLocation;
  });

  const handleSearch = () => setSearchQuery(localSearch);
  const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Browse Jobs</h1>
        <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{filtered.length} opportunities available</p>
      </div>

      <div className={`rounded-2xl border p-4 mb-6 ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className={`flex-1 flex items-center gap-2 px-3 border rounded-xl ${dk ? 'border-gray-700' : 'border-gray-200'}`}>
            <Search className={`w-5 h-5 ${dk ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search jobs, companies, categories..."
              className={`w-full py-2.5 outline-none text-sm ${dk ? 'bg-transparent text-gray-100 placeholder-gray-500' : ''}`}
            />
          </div>
          <button onClick={handleSearch} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
            Search
          </button>
        </div>
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <Filter className={`w-4 h-4 ${dk ? 'text-gray-500' : 'text-gray-400'}`} />
          <button
            onClick={() => setFilterType('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${!filterType ? (dk ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700') : (dk ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100')}`}
          >
            All
          </button>
          {jobTypes.map(t => (
            <button
              key={t}
              onClick={() => setFilterType(filterType === t ? '' : t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${filterType === t ? (dk ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-100 text-indigo-700') : (dk ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-50 text-gray-600 hover:bg-gray-100')}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <Search className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`text-lg font-medium mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>No jobs found</h3>
          <p className={dk ? 'text-gray-400' : 'text-gray-500'}>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(job => {
            const applied = hasApplied(job.id);
            const isEmployer = currentUser?.role === 'employer';
            return (
              <div
                key={job.id}
                className={`rounded-xl border p-5 hover:shadow-md transition-all cursor-pointer ${dk ? 'bg-gray-900 border-gray-800 hover:border-indigo-800' : 'bg-white border-gray-100 hover:border-indigo-100'}`}
                onClick={() => navigate('job-detail', job.id)}
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${dk ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
                      {job.companyLogo || '🏢'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                      <p className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{job.companyName}</p>
                      <div className={`flex flex-wrap gap-3 mt-2 text-xs ${dk ? 'text-gray-500' : 'text-gray-500'}`}>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(job.postedDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.type === 'Full-time' ? (dk ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700') :
                        job.type === 'Part-time' ? (dk ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-700') :
                          job.type === 'Internship' ? (dk ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-50 text-amber-700') :
                            job.type === 'Remote' ? (dk ? 'bg-purple-900/40 text-purple-400' : 'bg-purple-50 text-purple-700') :
                              (dk ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-700')
                      }`}>
                      {job.type}
                    </span>
                    {applied && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${dk ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}`}>Applied ✓</span>
                    )}
                    {isEmployer && (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${dk ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>Employer View</span>
                    )}
                    <span className={`text-xs ${dk ? 'text-gray-500' : 'text-gray-400'}`}>{formatDeadline(job.deadline)}</span>
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

export function JobDetail() {
  const { selectedJobId, getJobById, navigate, currentUser, applyForJob, hasApplied, theme } = useApp();
  const dk = theme === 'dark';
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [applied, setApplied] = useState(false);

  const job = selectedJobId ? getJobById(selectedJobId) : undefined;
  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className={`text-xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Job not found</h2>
        <button onClick={() => navigate('browse-jobs')} className="mt-4 text-indigo-600 hover:text-indigo-700">Back to Jobs</button>
      </div>
    );
  }

  const alreadyApplied = hasApplied(job.id);
  const isEmployer = currentUser?.role === 'employer';
  const isAdmin = currentUser?.role === 'admin';
  const isOwnJob = currentUser?.id === job.employerId;

  const handleApply = () => {
    if (!currentUser) { navigate('login'); return; }
    // Allow both students and admins to apply
    if (currentUser.role !== 'student' && currentUser.role !== 'admin') return;
    const success = applyForJob(job.id, coverLetter);
    if (success) {
      setApplied(true);
      setShowApplyForm(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <button onClick={() => navigate('browse-jobs')} className={`flex items-center gap-1 text-sm mb-6 ${dk ? 'text-gray-400 hover:text-indigo-400' : 'text-gray-500 hover:text-indigo-600'}`}>
        <ArrowLeft className="w-4 h-4" /> Back to Jobs
      </button>

      <div className={`rounded-2xl border overflow-hidden ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className={`p-6 sm:p-8 border-b ${dk ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 ${dk ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
              {job.companyLogo || '🏢'}
            </div>
            <div className="flex-1">
              <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>{job.title}</h1>
              <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{job.companyName}</p>
              <div className="flex flex-wrap gap-3 mt-3">
                <span className={`flex items-center gap-1 text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}><MapPin className="w-4 h-4" /> {job.location}</span>
                <span className={`flex items-center gap-1 text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}><DollarSign className="w-4 h-4" /> {job.salary}</span>
                <span className={`flex items-center gap-1 text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}><Clock className="w-4 h-4" /> Posted {formatDate(job.postedDate)}</span>
                <span className={`flex items-center gap-1 text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}><Briefcase className="w-4 h-4" /> {job.type}</span>
              </div>
              <div className="flex gap-2 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.type === 'Full-time' ? (dk ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700') :
                    job.type === 'Internship' ? (dk ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-50 text-amber-700') :
                      (dk ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-700')
                  }`}>
                  {job.type}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${dk ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>{job.category}</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${dk ? 'bg-orange-900/40 text-orange-400' : 'bg-orange-50 text-orange-600'}`}>{formatDeadline(job.deadline)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="prose prose-gray max-w-none">
            <h3 className={`text-lg font-semibold mb-3 ${dk ? 'text-white' : 'text-gray-900'}`}>Job Description</h3>
            <div className={`whitespace-pre-line mb-6 ${dk ? 'text-gray-300' : 'text-gray-600'}`}>{job.description}</div>

            <h3 className={`text-lg font-semibold mb-3 ${dk ? 'text-white' : 'text-gray-900'}`}>Requirements</h3>
            <ul className="space-y-2 mb-6">
              {job.requirements.map((req, i) => (
                <li key={i} className={`flex items-start gap-2 ${dk ? 'text-gray-300' : 'text-gray-600'}`}>
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>

            <div className={`flex items-center gap-2 text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
              <FileText className="w-4 h-4" />
              {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
            </div>
          </div>

          <div className={`mt-8 pt-6 border-t ${dk ? 'border-gray-800' : 'border-gray-100'}`}>
            {!currentUser ? (
              <div className={`rounded-xl p-6 text-center ${dk ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
                <p className={`mb-3 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Sign in to apply for this job</p>
                <button onClick={() => navigate('login')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
                  Sign In to Apply
                </button>
              </div>
            ) : isEmployer ? (
              <div className={`rounded-xl p-6 text-center ${dk ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className={dk ? 'text-gray-400' : 'text-gray-500'}>
                  {isOwnJob ? "This is your job posting. You can manage it from your dashboard." : "As an employer, you cannot apply for jobs. You can view this posting only."}
                </p>
                {isOwnJob && (
                  <button onClick={() => navigate('manage-jobs')} className="mt-3 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
                    Manage My Jobs
                  </button>
                )}
              </div>
            ) : (isAdmin && (alreadyApplied || applied)) ? (
              <div className={`rounded-xl p-6 text-center ${dk ? 'bg-green-900/20' : 'bg-green-50'}`}>
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className={`font-medium ${dk ? 'text-green-400' : 'text-green-700'}`}>Application submitted successfully</p>
                <p className={`text-sm mt-1 ${dk ? 'text-green-500' : 'text-green-600'}`}>The employer will review your application</p>
              </div>
            ) : alreadyApplied || applied ? (
              <div className={`rounded-xl p-6 text-center ${dk ? 'bg-green-900/20' : 'bg-green-50'}`}>
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className={`font-medium ${dk ? 'text-green-400' : 'text-green-700'}`}>You've already applied for this position</p>
                <p className={`text-sm mt-1 ${dk ? 'text-green-500' : 'text-green-600'}`}>Track your application status in "My Applications"</p>
              </div>
            ) : showApplyForm ? (
              <div className="space-y-4">
                <h3 className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>Apply for {job.title}</h3>
                {isAdmin && (
                  <div className={`rounded-lg p-3 mb-2 ${dk ? 'bg-blue-900/20 border border-blue-800' : 'bg-blue-50 border border-blue-100'}`}>
                    <p className={`text-sm ${dk ? 'text-blue-300' : 'text-blue-700'}`}>
                      As an admin, your application will be sent to the employer for review.
                    </p>
                  </div>
                )}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Cover Letter</label>
                  <textarea
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                    rows={5}
                    placeholder="Tell the employer why you're a great fit for this role..."
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none ${dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'}`}
                  />
                </div>
                <div className="flex gap-3">
                  <button onClick={handleApply} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
                    Submit Application
                  </button>
                  <button onClick={() => setShowApplyForm(false)} className={`px-6 py-2.5 border rounded-xl text-sm font-medium ${dk ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowApplyForm(true)}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 shadow-lg shadow-indigo-200"
              >
                Apply Now
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AppliedJobs() {
  const { currentUser, jobs, navigate, getApplicationsForStudent, theme } = useApp();
  const dk = theme === 'dark';
  if (!currentUser) return null;
  const myApps = getApplicationsForStudent(currentUser.id);

  const statusColors: Record<string, string> = {
    pending: dk ? 'bg-yellow-900/40 text-yellow-400 border-yellow-800' : 'bg-yellow-50 text-yellow-700 border-yellow-200',
    reviewed: dk ? 'bg-blue-900/40 text-blue-400 border-blue-800' : 'bg-blue-50 text-blue-700 border-blue-200',
    shortlisted: dk ? 'bg-green-900/40 text-green-400 border-green-800' : 'bg-green-50 text-green-700 border-green-200',
    accepted: dk ? 'bg-emerald-900/40 text-emerald-400 border-emerald-800' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
    rejected: dk ? 'bg-red-900/40 text-red-400 border-red-800' : 'bg-red-50 text-red-700 border-red-200',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className={`text-2xl font-bold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>My Applications</h1>
      <p className={`mb-6 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Track the status of your job applications</p>

      {myApps.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <FileText className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`text-lg font-medium mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>No applications yet</h3>
          <p className={`mb-4 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Start applying to jobs to see them here</p>
          <button onClick={() => navigate('browse-jobs')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
            Browse Jobs
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {myApps.map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            return (
              <div key={app.id} className={`rounded-xl border p-5 hover:shadow-sm transition ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${dk ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
                      {job?.companyLogo || '🏢'}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>{job?.title || 'Unknown Job'}</h3>
                      <p className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{job?.companyName}</p>
                      <p className={`text-xs mt-1 ${dk ? 'text-gray-500' : 'text-gray-400'}`}>Applied {formatDate(app.appliedDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${statusColors[app.status] || ''}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    {job && (
                      <button
                        onClick={() => navigate('job-detail', job.id)}
                        className="px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg"
                      >
                        View Job
                      </button>
                    )}
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

export function StudentProfile() {
  const { currentUser, updateUser, theme } = useApp();
  const dk = theme === 'dark';
  if (!currentUser) return null;

  const [name, setName] = useState(currentUser.name);
  const [email] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [education, setEducation] = useState(currentUser.education || '');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>(currentUser.skills || []);
  const [saved, setSaved] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter(sk => sk !== s));

  const handleSave = () => {
    updateUser({ ...currentUser, name, phone, education, bio, skills });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = `w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${dk ? 'bg-gray-800 border-gray-700 text-gray-100' : 'border-gray-200'}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className={`text-2xl font-bold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>My Profile</h1>
      <p className={`mb-6 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Manage your personal information</p>

      <div className={`rounded-2xl border p-6 sm:p-8 space-y-6 ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-3xl font-bold">
            {name.charAt(0)}
          </div>
          <div>
            <h3 className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>{name}</h3>
            <p className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{email}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className={`flex items-center gap-1 text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}><User className="w-4 h-4" /> Full Name</label>
            <input value={name} onChange={e => setName(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className={`flex items-center gap-1 text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}><Mail className="w-4 h-4" /> Email</label>
            <input value={email} disabled className={`w-full px-4 py-2.5 border rounded-xl ${dk ? 'bg-gray-800 border-gray-700 text-gray-500' : 'bg-gray-50 border-gray-200 text-gray-500'}`} />
          </div>
          <div>
            <label className={`flex items-center gap-1 text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}><Phone className="w-4 h-4" /> Phone</label>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1-555-0000" className={inputCls} />
          </div>
          <div>
            <label className={`flex items-center gap-1 text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}><GraduationCap className="w-4 h-4" /> Education</label>
            <input value={education} onChange={e => setEducation(e.target.value)} placeholder="BS Computer Science" className={inputCls} />
          </div>
        </div>

        <div>
          <label className={`flex items-center gap-1 text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}><BookOpen className="w-4 h-4" /> Bio</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} placeholder="Tell employers about yourself..." className={`${inputCls} resize-none`} />
        </div>

        <div>
          <label className={`text-sm font-medium mb-2 block ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill"
              className={`flex-1 ${inputCls}`}
            />
            <button onClick={addSkill} className="px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">Add</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map(s => (
              <span key={s} className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${dk ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-50 text-indigo-700'}`}>
                {s}
                <button onClick={() => removeSkill(s)} className="hover:text-red-500">
                  <XCircle className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700">
            Save Changes
          </button>
          {saved && <span className="text-sm text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Saved!</span>}
        </div>
      </div>
    </div>
  );
}
