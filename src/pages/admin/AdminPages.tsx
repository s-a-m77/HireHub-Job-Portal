import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Users, Briefcase, Building2, Shield, Trash2, Eye, Search,
  MapPin, Clock, AlertTriangle, FileText, Mail, MessageSquare, Send, Reply, XCircle, CheckCircle
} from 'lucide-react';

const formatDate = (d: string) => {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff}d ago`;
};

export function AdminDashboard() {
  const { users, jobs, applications, navigate, getStudents, getEmployers, theme } = useApp();
  const dk = theme === 'dark';
  const students = getStudents();
  const employers = getEmployers();
  const activeJobs = jobs.filter(j => j.status === 'active');

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, bg: dk ? 'bg-indigo-900/30' : 'bg-indigo-50', color: dk ? 'text-indigo-400' : 'text-indigo-600', sub: `${students.length} students, ${employers.length} employers` },
    { label: 'Total Jobs', value: jobs.length, icon: Briefcase, bg: dk ? 'bg-green-900/30' : 'bg-green-50', color: dk ? 'text-green-400' : 'text-green-600', sub: `${activeJobs.length} active` },
    { label: 'Applications', value: applications.length, icon: FileText, bg: dk ? 'bg-purple-900/30' : 'bg-purple-50', color: dk ? 'text-purple-400' : 'text-purple-600', sub: `${applications.filter(a => a.status === 'pending').length} pending` },
    { label: 'Companies', value: employers.length, icon: Building2, bg: dk ? 'bg-amber-900/30' : 'bg-amber-50', color: dk ? 'text-amber-400' : 'text-amber-600', sub: 'Registered employers' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Admin Dashboard</h1>
          <p className={dk ? 'text-gray-400' : 'text-gray-500'}>Manage the entire platform</p>
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
            <div className={`text-xs mt-1 ${dk ? 'text-gray-500' : 'text-gray-400'}`}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <button onClick={() => navigate('manage-students')} className={`rounded-xl border p-6 text-left hover:shadow-md transition group ${dk ? 'bg-gray-900 border-gray-800 hover:border-indigo-800' : 'bg-white border-gray-100 hover:border-indigo-100'}`}>
          <Users className="w-7 h-7 text-indigo-500 mb-3" />
          <h3 className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>Manage Students</h3>
          <p className={`text-sm mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{students.length} registered students</p>
        </button>
        <button onClick={() => navigate('manage-employers')} className={`rounded-xl border p-6 text-left hover:shadow-md transition group ${dk ? 'bg-gray-900 border-gray-800 hover:border-indigo-800' : 'bg-white border-gray-100 hover:border-indigo-100'}`}>
          <Building2 className="w-7 h-7 text-purple-500 mb-3" />
          <h3 className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>Manage Employers</h3>
          <p className={`text-sm mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{employers.length} registered companies</p>
        </button>
        <button onClick={() => navigate('manage-all-jobs')} className={`rounded-xl border p-6 text-left hover:shadow-md transition group ${dk ? 'bg-gray-900 border-gray-800 hover:border-indigo-800' : 'bg-white border-gray-100 hover:border-indigo-100'}`}>
          <Briefcase className="w-7 h-7 text-green-500 mb-3" />
          <h3 className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>Manage Jobs</h3>
          <p className={`text-sm mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{jobs.length} total job listings</p>
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <h2 className={`text-lg font-semibold mb-3 ${dk ? 'text-white' : 'text-gray-900'}`}>Recent Users</h2>
          <div className={`rounded-xl border overflow-hidden ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            {users.filter(u => u.role !== 'admin').slice(-5).reverse().map(user => (
              <div key={user.id} className={`flex items-center justify-between p-4 border-b last:border-0 ${dk ? 'border-gray-800' : 'border-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${dk ? 'text-white' : 'text-gray-900'}`}>{user.name}</div>
                    <div className={`text-xs ${dk ? 'text-gray-500' : 'text-gray-500'}`}>{user.email}</div>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.role === 'student' ? (dk ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-700') : (dk ? 'bg-purple-900/40 text-purple-400' : 'bg-purple-50 text-purple-700')
                  }`}>{user.role}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className={`text-lg font-semibold mb-3 ${dk ? 'text-white' : 'text-gray-900'}`}>Recent Applications</h2>
          <div className={`rounded-xl border overflow-hidden ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            {applications.length === 0 ? (
              <div className={`p-8 text-center text-sm ${dk ? 'text-gray-500' : 'text-gray-500'}`}>No applications yet</div>
            ) : (
              applications.slice(-5).reverse().map(app => {
                const job = jobs.find(j => j.id === app.jobId);
                return (
                  <div key={app.id} className={`flex items-center justify-between p-4 border-b last:border-0 ${dk ? 'border-gray-800' : 'border-gray-50'}`}>
                    <div>
                      <div className={`text-sm font-medium ${dk ? 'text-white' : 'text-gray-900'}`}>{app.studentName}</div>
                      <div className={`text-xs ${dk ? 'text-gray-500' : 'text-gray-500'}`}>Applied to {job?.title || 'Unknown'} • {formatDate(app.appliedDate)}</div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${app.status === 'pending' ? (dk ? 'bg-yellow-900/40 text-yellow-400' : 'bg-yellow-50 text-yellow-700') :
                      app.status === 'accepted' ? (dk ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700') :
                        app.status === 'rejected' ? (dk ? 'bg-red-900/40 text-red-400' : 'bg-red-50 text-red-700') :
                          (dk ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-700')
                      }`}>{app.status}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ManageStudents() {
  const { getStudents, deleteUser, getApplicationsForStudent, theme } = useApp();
  const dk = theme === 'dark';
  const students = getStudents();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filtered = students.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Manage Students</h1>
          <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{students.length} registered students</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className={`flex-1 flex items-center gap-2 px-4 border rounded-xl ${dk ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <Search className={`w-5 h-5 ${dk ? 'text-gray-500' : 'text-gray-400'}`} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className={`w-full py-2.5 outline-none text-sm ${dk ? 'bg-transparent text-gray-100 placeholder-gray-500' : ''}`} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <Users className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={dk ? 'text-gray-400' : 'text-gray-500'}>No students found</p>
        </div>
      ) : (
        <div className={`rounded-xl border overflow-hidden ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${dk ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Student</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Education</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Skills</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Applications</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Joined</th>
                  <th className={`text-right px-4 py-3 text-xs font-medium uppercase ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(student => {
                  const apps = getApplicationsForStudent(student.id);
                  return (
                    <tr key={student.id} className={`border-b last:border-0 ${dk ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-50 hover:bg-gray-50'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                            {student.name.charAt(0)}
                          </div>
                          <div>
                            <div className={`text-sm font-medium ${dk ? 'text-white' : 'text-gray-900'}`}>{student.name}</div>
                            <div className={`text-xs ${dk ? 'text-gray-500' : 'text-gray-500'}`}>{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${dk ? 'text-gray-400' : 'text-gray-600'}`}>{student.education || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {student.skills?.slice(0, 3).map(s => (
                            <span key={s} className={`px-2 py-0.5 rounded text-xs ${dk ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>{s}</span>
                          )) || '-'}
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm ${dk ? 'text-gray-400' : 'text-gray-600'}`}>{apps.length}</td>
                      <td className={`px-4 py-3 text-sm ${dk ? 'text-gray-500' : 'text-gray-500'}`}>{formatDate(student.createdAt)}</td>
                      <td className="px-4 py-3 text-right">
                        {confirmDelete === student.id ? (
                          <div className="flex items-center gap-1 justify-end">
                            <button onClick={() => { deleteUser(student.id); setConfirmDelete(null); }} className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700">Confirm</button>
                            <button onClick={() => setConfirmDelete(null)} className={`px-2 py-1 text-xs rounded ${dk ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(student.id)} className={`p-1.5 rounded-lg ${dk ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function ManageEmployers() {
  const { getEmployers, deleteUser, getJobsForEmployer, sendAdminMessage, approveEmployer, rejectEmployer, theme } = useApp();
  const dk = theme === 'dark';
  const employers = getEmployers();
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedEmployer, setSelectedEmployer] = useState<any>(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const filtered = employers.filter(e =>
    !search || e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.email.toLowerCase().includes(search.toLowerCase()) ||
    e.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSendMessageClick = (employer: any) => {
    setSelectedEmployer(employer);
    setShowMessageModal(true);
    setMessageSent(false);
    setMessageSubject('');
    setMessageBody('');
  };

  const handleSendMessage = () => {
    if (selectedEmployer && messageSubject && messageBody) {
      sendAdminMessage(selectedEmployer.id, messageSubject, messageBody);
      setMessageSent(true);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Manage Employers</h1>
          <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{employers.length} registered companies</p>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <div className={`flex-1 flex items-center gap-2 px-4 border rounded-xl ${dk ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <Search className={`w-5 h-5 ${dk ? 'text-gray-500' : 'text-gray-400'}`} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employers..." className={`w-full py-2.5 outline-none text-sm ${dk ? 'bg-transparent text-gray-100 placeholder-gray-500' : ''}`} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <Building2 className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={dk ? 'text-gray-400' : 'text-gray-500'}>No employers found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(emp => {
            const empJobs = getJobsForEmployer(emp.id);
            const activeJobs = empJobs.filter(j => j.status === 'active');
            return (
              <div key={emp.id} className={`rounded-xl border p-5 ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${dk ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
                      {emp.companyLogo || '🏢'}
                    </div>
                    <div className="min-w-0">
                      <h3 className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>{emp.companyName || emp.name}</h3>
                      <p className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{emp.email}</p>
                      <div className={`flex flex-wrap gap-3 mt-1 text-xs ${dk ? 'text-gray-500' : 'text-gray-500'}`}>
                        {emp.industry && <span>{emp.industry}</span>}
                        {emp.companyLocation && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {emp.companyLocation}</span>}
                        <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" /> {empJobs.length} jobs ({activeJobs.length} active)</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Joined {formatDate(emp.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSendMessageClick(emp)}
                      className={`p-2 rounded-lg ${dk ? 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30' : 'text-gray-500 hover:text-indigo-500 hover:bg-indigo-50'}`}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    {!emp.isApproved && (
                      <div className="flex gap-1">
                        <button
                          onClick={() => approveEmployer(emp.id)}
                          className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" /> Approve
                        </button>
                        <button
                          onClick={() => rejectEmployer(emp.id)}
                          className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-1"
                        >
                          <XCircle className="w-3 h-3" /> Reject
                        </button>
                      </div>
                    )}
                    {emp.isApproved && (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${dk ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700'}`}>
                        Approved
                      </span>
                    )}
                    {confirmDelete === emp.id ? (
                      <div className="flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <button onClick={() => { deleteUser(emp.id); setConfirmDelete(null); }} className="px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700">Delete All</button>
                        <button onClick={() => setConfirmDelete(null)} className={`px-3 py-1.5 text-xs rounded-lg ${dk ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmDelete(emp.id)} className={`p-1.5 rounded-lg ${dk ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showMessageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl border max-w-lg w-full ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className={`p-6 border-b flex items-center justify-between ${dk ? 'border-gray-800' : 'border-gray-100'}`}>
              <div>
                <h2 className={`text-xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Send Message</h2>
                <p className={`text-sm mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>To: {selectedEmployer?.companyName || selectedEmployer?.name}</p>
              </div>
              <button
                onClick={() => setShowMessageModal(false)}
                className={`p-2 rounded-lg ${dk ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              {messageSent ? (
                <div className="text-center py-8">
                  <Send className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className={`text-lg font-semibold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>Message Sent!</h3>
                  <p className={dk ? 'text-gray-400' : 'text-gray-500'}>Your message has been sent to {selectedEmployer?.companyName || selectedEmployer?.name}.</p>
                  <button
                    onClick={() => setShowMessageModal(false)}
                    className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
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
                      placeholder="Message subject"
                      className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Message *</label>
                    <textarea
                      value={messageBody}
                      onChange={(e) => setMessageBody(e.target.value)}
                      required
                      rows={5}
                      placeholder="Your message..."
                      className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'}`}
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

export function ManageAllJobs() {
  const { jobs, deleteJob, updateJob, navigate, users, theme } = useApp();
  const dk = theme === 'dark';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [employerFilter, setEmployerFilter] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const employers = users.filter(u => u.role === 'employer');
  const activeJobs = jobs.filter(j => j.status === 'active');
  const recentJobs = jobs.filter(j => {
    const daysSincePosted = Math.floor((Date.now() - new Date(j.postedDate).getTime()) / 86400000);
    return daysSincePosted <= 7;
  });

  const filtered = jobs.filter(j => {
    const matchSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) || j.companyName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || j.status === statusFilter;
    const matchEmployer = !employerFilter || j.employerId === employerFilter;
    return matchSearch && matchStatus && matchEmployer;
  });

  const toggleStatus = (job: typeof jobs[0]) => {
    updateJob({ ...job, status: job.status === 'active' ? 'closed' : 'active' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>All Job Listings</h1>
          <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
            {jobs.length} total jobs • {activeJobs.length} active • {recentJobs.length} posted this week
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className={`flex-1 flex items-center gap-2 px-4 border rounded-xl ${dk ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <Search className={`w-5 h-5 ${dk ? 'text-gray-500' : 'text-gray-400'}`} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs by title or company..." className={`w-full py-2.5 outline-none text-sm ${dk ? 'bg-transparent text-gray-100 placeholder-gray-500' : ''}`} />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={`px-4 py-2.5 border rounded-xl text-sm outline-none ${dk ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-200'}`}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="closed">Closed</option>
          <option value="draft">Draft</option>
        </select>
        <select value={employerFilter} onChange={e => setEmployerFilter(e.target.value)} className={`px-4 py-2.5 border rounded-xl text-sm outline-none ${dk ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-200'}`}>
          <option value="">All Employers</option>
          {employers.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.companyName || emp.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <Briefcase className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={dk ? 'text-gray-400' : 'text-gray-500'}>No jobs found</p>
        </div>
      ) : (
        <div className={`rounded-xl border overflow-hidden ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${dk ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Job</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Company</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Type</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Status</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Applicants</th>
                  <th className={`text-left px-4 py-3 text-xs font-medium uppercase ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Posted</th>
                  <th className={`text-right px-4 py-3 text-xs font-medium uppercase ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(job => (
                  <tr key={job.id} className={`border-b last:border-0 ${dk ? 'border-gray-800 hover:bg-gray-800/50' : 'border-gray-50 hover:bg-gray-50'}`}>
                    <td className="px-4 py-3">
                      <div className={`text-sm font-medium ${dk ? 'text-white' : 'text-gray-900'}`}>{job.title}</div>
                      <div className={`text-xs flex items-center gap-1 ${dk ? 'text-gray-500' : 'text-gray-500'}`}><MapPin className="w-3 h-3" /> {job.location}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{job.companyLogo || '🏢'}</span>
                        <span className={`text-sm ${dk ? 'text-gray-300' : 'text-gray-700'}`}>{job.companyName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${job.type === 'Full-time' ? (dk ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700') :
                        job.type === 'Internship' ? (dk ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-50 text-amber-700') :
                          (dk ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-700')
                        }`}>{job.type}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${job.status === 'active' ? (dk ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700') : (dk ? 'bg-red-900/40 text-red-400' : 'bg-red-50 text-red-700')
                        }`}>{job.status}</span>
                    </td>
                    <td className={`px-4 py-3 text-sm ${dk ? 'text-gray-400' : 'text-gray-600'}`}>{job.applicantCount}</td>
                    <td className={`px-4 py-3 text-sm ${dk ? 'text-gray-500' : 'text-gray-500'}`}>{formatDate(job.postedDate)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center gap-1 justify-end">
                        <button onClick={() => navigate('job-detail', job.id)} className={`p-1.5 rounded-lg ${dk ? 'text-gray-500 hover:text-indigo-400 hover:bg-indigo-900/30' : 'text-gray-400 hover:text-indigo-500 hover:bg-indigo-50'}`}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => toggleStatus(job)} className={`px-2 py-1 text-xs rounded-lg ${job.status === 'active' ? (dk ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50') : (dk ? 'text-green-400 hover:bg-green-900/30' : 'text-green-600 hover:bg-green-50')
                          }`}>{job.status === 'active' ? 'Close' : 'Open'}</button>
                        {confirmDelete === job.id ? (
                          <div className="flex items-center gap-1">
                            <button onClick={() => { deleteJob(job.id); setConfirmDelete(null); }} className="px-2 py-1 text-xs bg-red-600 text-white rounded">Yes</button>
                            <button onClick={() => setConfirmDelete(null)} className={`px-2 py-1 text-xs rounded ${dk ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>No</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(job.id)} className={`p-1.5 rounded-lg ${dk ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminMessages() {
  const { getMessagesForAdmin, markMessageAsRead, replyToMessage, theme } = useApp();
  const dk = theme === 'dark';
  const allMessages = getMessagesForAdmin();
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  // Group messages by company/employer
  const messagesByCompany = allMessages.reduce((acc, msg) => {
    const key = msg.companyName || msg.employerName;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(msg);
    return acc;
  }, {} as Record<string, typeof allMessages>);

  const companies = Object.keys(messagesByCompany).sort();
  const unreadCount = allMessages.filter(m => !m.read).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Messages from Employers</h1>
          <p className={dk ? 'text-gray-400' : 'text-gray-500'}>
            {allMessages.length} total message{allMessages.length !== 1 ? 's' : ''}
            {unreadCount > 0 && (
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${dk ? 'bg-red-900/40 text-red-400' : 'bg-red-50 text-red-700'}`}>
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
      </div>

      {companies.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <Mail className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`text-lg font-medium mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>No messages found</h3>
          <p className={dk ? 'text-gray-400' : 'text-gray-500'}>No employers have sent messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {companies.map(companyName => {
            const companyMessages = messagesByCompany[companyName].sort((a, b) =>
              new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime()
            );
            const firstMessage = companyMessages[0];
            const unreadMessages = companyMessages.filter(m => !m.read).length;

            return (
              <div key={companyName} className={`rounded-xl border overflow-hidden ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                <div className={`p-4 border-b ${dk ? 'border-gray-800 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${dk ? 'bg-gray-800' : 'bg-indigo-50'}`}>
                        {firstMessage.companyName?.charAt(0) || '🏢'}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>{companyName}</h3>
                        <p className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                          {firstMessage.employerName} • {firstMessage.employerEmail}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${dk ? 'text-white' : 'text-gray-900'}`}>
                        {companyMessages.length} message{companyMessages.length !== 1 ? 's' : ''}
                      </div>
                      {unreadMessages > 0 && (
                        <div className={`text-xs mt-1 px-2 py-0.5 rounded-full inline-block ${dk ? 'bg-red-900/40 text-red-400' : 'bg-red-50 text-red-700'}`}>
                          {unreadMessages} unread
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-800">
                  {companyMessages.map(message => (
                    <div
                      key={message.id}
                      className={`p-4 ${dk ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} ${!message.read ? (dk ? 'bg-blue-900/20' : 'bg-blue-50') : ''}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-medium ${dk ? 'text-white' : 'text-gray-900'}`}>{message.subject}</h4>
                            {!message.read && (
                              <span className={`w-2 h-2 rounded-full ${dk ? 'bg-blue-400' : 'bg-blue-600'}`}></span>
                            )}
                          </div>
                          <p className={`text-sm mt-2 whitespace-pre-wrap ${dk ? 'text-gray-300' : 'text-gray-600'}`}>
                            {message.body}
                          </p>
                          <p className={`text-xs mt-2 ${dk ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatDate(message.sentDate)}
                          </p>

                          {/* Show replies */}
                          {message.replies && message.replies.length > 0 && (
                            <div className="mt-4 space-y-3">
                              {message.replies.map(reply => (
                                <div key={reply.id} className={`pl-4 border-l-2 ${dk ? 'border-indigo-800 bg-indigo-900/10' : 'border-indigo-200 bg-indigo-50'} rounded-r-lg p-3`}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-medium ${dk ? 'text-indigo-400' : 'text-indigo-700'}`}>
                                      Admin Reply
                                    </span>
                                    <span className={`text-xs ${dk ? 'text-gray-500' : 'text-gray-400'}`}>
                                      {formatDate(reply.sentDate)}
                                    </span>
                                  </div>
                                  <p className={`text-sm whitespace-pre-wrap ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {reply.body}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply form */}
                          {replyingTo === message.id ? (
                            <div className="mt-4 space-y-2">
                              <textarea
                                value={replyText[message.id] || ''}
                                onChange={(e) => setReplyText({ ...replyText, [message.id]: e.target.value })}
                                placeholder="Type your reply..."
                                rows={3}
                                className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'}`}
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    if (replyText[message.id]?.trim()) {
                                      replyToMessage(message.id, replyText[message.id]);
                                      setReplyText({ ...replyText, [message.id]: '' });
                                      setReplyingTo(null);
                                    }
                                  }}
                                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-1"
                                >
                                  <Send className="w-3 h-3" /> Send Reply
                                </button>
                                <button
                                  onClick={() => {
                                    setReplyingTo(null);
                                    setReplyText({ ...replyText, [message.id]: '' });
                                  }}
                                  className={`px-4 py-1.5 border rounded-lg text-sm font-medium ${dk ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setReplyingTo(message.id);
                                if (!message.read) {
                                  markMessageAsRead(message.id);
                                }
                              }}
                              className="mt-3 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center gap-1"
                            >
                              <Reply className="w-3 h-3" /> Reply
                            </button>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          {!message.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markMessageAsRead(message.id);
                              }}
                              className={`px-3 py-1 text-xs rounded-lg ${dk ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export { ContactInboxPage } from './ContactInboxPage';
export { AnnouncementsPage } from './AnnouncementsPage';
