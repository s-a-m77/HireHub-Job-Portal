import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Calendar, Users, Eye, Clock, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react';

const formatDate = (d: string) => {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff}d ago`;
};

const isExpired = (expiryDate?: string) => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

export function PublicAnnouncementsPage() {
  const { announcements, currentUser, theme } = useApp();
  const dk = theme === 'dark';
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);

  // Filter announcements for current user
  const userAnnouncements = announcements.filter(a => {
    const now = new Date();
    // Filter expired announcements
    if (a.expiryDate && new Date(a.expiryDate) < now) {
      return false;
    }
    // Filter by target audience
    if (a.targetAudience && a.targetAudience !== 'all') {
      // Map UserRole to target audience strings
      const userAudience = currentUser?.role === 'student' ? 'students' : 
                          currentUser?.role === 'employer' ? 'employers' : null;
      if (userAudience && a.targetAudience !== userAudience) {
        return false;
      }
    }
    return true;
  }).sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());

  const urgentAnnouncements = userAnnouncements.filter(a => a.type === 'urgent');
  const normalAnnouncements = userAnnouncements.filter(a => a.type === 'normal');

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Announcements</h1>
          <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
            {userAnnouncements.length} announcement{userAnnouncements.length !== 1 ? 's' : ''} for {currentUser?.role || 'users'}
          </p>
        </div>
      </div>

      {urgentAnnouncements.length > 0 && (
        <div className="mb-8">
          <h2 className={`text-lg font-semibold mb-4 ${dk ? 'text-white' : 'text-gray-900'}`}>Urgent Announcements</h2>
          <div className="space-y-4">
            {urgentAnnouncements.map(announcement => (
              <div
                key={announcement.id}
                onClick={() => setSelectedAnnouncement(announcement)}
                className={`rounded-xl border p-6 cursor-pointer transition-all hover:shadow-lg ${
                  dk ? 'bg-gray-900 border-red-900/30 hover:border-red-900/50' : 'bg-white border-red-100 hover:border-red-200'
                } ${isExpired(announcement.expiryDate) ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-lg font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>
                        {announcement.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${dk ? 'bg-red-900/40 text-red-400' : 'bg-red-50 text-red-700'}`}>
                        URGENT
                      </span>
                      {announcement.expiryDate && isExpired(announcement.expiryDate) && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${dk ? 'bg-yellow-900/40 text-yellow-400' : 'bg-yellow-50 text-yellow-700'}`}>
                          EXPIRED
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mb-3 line-clamp-3 ${dk ? 'text-gray-300' : 'text-gray-600'}`}>
                      {announcement.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(announcement.postedDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {announcement.targetAudience || 'All'}
                      </div>
                      {announcement.expiryDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className={`w-4 h-4 ${dk ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {normalAnnouncements.length > 0 && (
        <div>
          <h2 className={`text-lg font-semibold mb-4 ${dk ? 'text-white' : 'text-gray-900'}`}>Recent Announcements</h2>
          <div className="space-y-4">
            {normalAnnouncements.map(announcement => (
              <div
                key={announcement.id}
                onClick={() => setSelectedAnnouncement(announcement)}
                className={`rounded-xl border p-6 cursor-pointer transition-all hover:shadow-lg ${
                  dk ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-100 hover:border-gray-200'
                } ${isExpired(announcement.expiryDate) ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-lg font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>
                        {announcement.title}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${dk ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-700'}`}>
                        NORMAL
                      </span>
                      {announcement.expiryDate && isExpired(announcement.expiryDate) && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${dk ? 'bg-yellow-900/40 text-yellow-400' : 'bg-yellow-50 text-yellow-700'}`}>
                          EXPIRED
                        </span>
                      )}
                    </div>
                    <p className={`text-sm mb-3 line-clamp-3 ${dk ? 'text-gray-300' : 'text-gray-600'}`}>
                      {announcement.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(announcement.postedDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {announcement.targetAudience || 'All'}
                      </div>
                      {announcement.expiryDate && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className={`w-4 h-4 ${dk ? 'text-gray-500' : 'text-gray-400'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userAnnouncements.length === 0 && (
        <div className={`text-center py-16 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
          <h3 className={`text-lg font-medium mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>No announcements</h3>
          <p className={dk ? 'text-gray-400' : 'text-gray-500'}>
            {currentUser?.role === 'student' 
              ? 'No announcements for students at this time.'
              : currentUser?.role === 'employer'
              ? 'No announcements for employers at this time.'
              : 'No announcements available.'}
          </p>
        </div>
      )}

      {/* Announcement Detail Modal */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`rounded-2xl border max-w-2xl w-full max-h-[90vh] overflow-y-auto ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className={`p-6 border-b flex items-center justify-between ${dk ? 'border-gray-800' : 'border-gray-100'}`}>
              <div>
                <h2 className={`text-xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>{selectedAnnouncement.title}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedAnnouncement.type === 'urgent' ? (dk ? 'bg-red-900/40 text-red-400' : 'bg-red-50 text-red-700') :
                    (dk ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-700')
                  }`}>
                    {selectedAnnouncement.type.toUpperCase()}
                  </span>
                  {selectedAnnouncement.targetAudience && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${dk ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                      {selectedAnnouncement.targetAudience}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className={`p-2 rounded-lg ${dk ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Posted: {new Date(selectedAnnouncement.postedDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  For: {selectedAnnouncement.targetAudience || 'All'}
                </div>
                {selectedAnnouncement.expiryDate && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Expires: {new Date(selectedAnnouncement.expiryDate).toLocaleDateString()}
                    {isExpired(selectedAnnouncement.expiryDate) && (
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${dk ? 'bg-yellow-900/40 text-yellow-400' : 'bg-yellow-50 text-yellow-700'}`}>
                        EXPIRED
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`prose max-w-none ${dk ? 'prose-invert' : ''}`}>
                <div className="whitespace-pre-wrap text-gray-600">
                  {selectedAnnouncement.description}
                </div>
              </div>

              {/* Image */}
              {selectedAnnouncement.image && (
                <div className="mt-6">
                  <h3 className={`text-sm font-medium mb-2 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Image</h3>
                  <img
                    src={selectedAnnouncement.image}
                    alt="Announcement"
                    className="w-full rounded-lg border"
                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                  />
                </div>
              )}

              {/* Attachment */}
              {selectedAnnouncement.attachment && (
                <div className="mt-6">
                  <h3 className={`text-sm font-medium mb-2 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>Attachment</h3>
                  <a
                    href={selectedAnnouncement.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <FileText className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">View Attachment</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
