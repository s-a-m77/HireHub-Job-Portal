import { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { SuccessMessage } from '@/components/SuccessMessage';
import {
  Plus, Edit, Trash2, Eye, Search, Calendar, User, Users, FileText, Image as ImageIcon,
  AlertCircle, CheckCircle, Info, ExternalLink, X, Upload, FileText as FileIcon,
  Clock, Target, EyeOff, Eye as EyeIcon
} from 'lucide-react';

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

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const validateImage = (file: File) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (!allowedTypes.includes(file.type)) {
    return 'Only JPG and PNG images are allowed';
  }
  
  if (file.size > maxSize) {
    return 'Image size must be under 2MB';
  }

  return null;
};

export function AnnouncementsPage() {
  const { announcements, theme, createAnnouncement, updateAnnouncement, deleteAnnouncement } = useApp();
  const dk = theme === 'dark';
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [audienceFilter, setAudienceFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const filtered = announcements.filter(a => {
    const matchSearch = !search || 
      a.title.toLowerCase().includes(search.toLowerCase()) || 
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || a.type === typeFilter;
    const matchAudience = !audienceFilter || a.targetAudience === audienceFilter;
    return matchSearch && matchType && matchAudience;
  });

  const handleCreateAnnouncement = (data: any) => {
    createAnnouncement({
      title: data.title,
      type: data.type,
      description: data.description,
      expiryDate: data.expiryDate || undefined,
      targetAudience: data.targetAudience,
      image: data.image,
      attachment: data.attachment
    });
    setShowSuccessMessage(true);
    setSuccessMessage('Announcement created successfully!');
  };

  const handleEditAnnouncement = (data: any) => {
    updateAnnouncement({
      id: data.id,
      title: data.title,
      type: data.type,
      description: data.description,
      expiryDate: data.expiryDate || undefined,
      targetAudience: data.targetAudience,
      image: data.image,
      attachment: data.attachment,
      postedDate: data.postedDate,
      postedBy: data.postedBy
    });
    setShowSuccessMessage(true);
    setSuccessMessage('Announcement updated successfully!');
  };

  const handleDeleteAnnouncement = (id: string) => {
    deleteAnnouncement(id);
    setShowSuccessMessage(true);
    setSuccessMessage('Announcement deleted successfully!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Announcements</h1>
          <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
            {announcements.length} total announcements
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          Create Announcement
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className={`flex-1 flex items-center gap-2 px-4 border rounded-xl ${dk ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
          <Search className={`w-5 h-5 ${dk ? 'text-gray-500' : 'text-gray-400'}`} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search announcements..."
            className={`w-full py-2.5 outline-none text-sm ${dk ? 'bg-transparent text-gray-100 placeholder-gray-500' : ''}`}
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className={`px-4 py-2.5 border rounded-xl text-sm outline-none ${dk ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-200'}`}
        >
          <option value="">All Types</option>
          <option value="urgent">Urgent</option>
          <option value="normal">Normal</option>
          <option value="other">Other</option>
        </select>
        <select
          value={audienceFilter}
          onChange={e => setAudienceFilter(e.target.value)}
          className={`px-4 py-2.5 border rounded-xl text-sm outline-none ${dk ? 'bg-gray-900 border-gray-700 text-gray-100' : 'bg-white border-gray-200'}`}
        >
          <option value="">All Audiences</option>
          <option value="students">Students</option>
          <option value="employers">Employers</option>
          <option value="all">All</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className={`text-center py-16 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
          <AlertCircle className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
          <p className={dk ? 'text-gray-400' : 'text-gray-500'}>No announcements found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map(announcement => (
            <div
              key={announcement.id}
              className={`rounded-xl border p-6 ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} ${isExpired(announcement.expiryDate) ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-lg font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>
                      {announcement.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      announcement.type === 'urgent' ? (dk ? 'bg-red-900/40 text-red-400' : 'bg-red-50 text-red-700') :
                      announcement.type === 'normal' ? (dk ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-700') :
                      (dk ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700')
                    }`}>
                      {announcement.type.toUpperCase()}
                    </span>
                    {announcement.expiryDate && isExpired(announcement.expiryDate) && (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${dk ? 'bg-yellow-900/40 text-yellow-400' : 'bg-yellow-50 text-yellow-700'}`}>
                        EXPIRED
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mb-3 ${dk ? 'text-gray-300' : 'text-gray-600'}`}>
                    {announcement.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(announcement.postedDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {announcement.postedBy}
                    </div>
                    {announcement.targetAudience && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {announcement.targetAudience}
                      </div>
                    )}
                    {announcement.expiryDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {announcement.image && (
                    <button
                      onClick={() => window.open(announcement.image, '_blank')}
                      className={`p-2 rounded-lg ${dk ? 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30' : 'text-gray-500 hover:text-indigo-500 hover:bg-indigo-50'}`}
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedAnnouncement(announcement);
                      setShowEditModal(true);
                    }}
                    className={`p-2 rounded-lg ${dk ? 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30' : 'text-gray-500 hover:text-indigo-500 hover:bg-indigo-50'}`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  {confirmDelete === announcement.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDeleteAnnouncement(announcement.id)}
                        className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Yes
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className={`px-2 py-1 text-xs rounded ${dk ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDelete(announcement.id)}
                      className={`p-2 rounded-lg ${dk ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <CreateAnnouncementModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAnnouncement}
        />
      )}

      {/* Edit Announcement Modal */}
      {showEditModal && selectedAnnouncement && (
        <EditAnnouncementModal
          announcement={selectedAnnouncement}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditAnnouncement}
        />
      )}

      {/* Success Message */}
      <SuccessMessage
        message={successMessage}
        isVisible={showSuccessMessage}
        onClose={() => setShowSuccessMessage(false)}
      />
    </div>
  );
}

function CreateAnnouncementModal({ onClose, onSubmit }: {
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const { theme, currentUser } = useApp();
  const dk = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [formData, setFormData] = useState({
    title: '',
    type: 'normal' as 'urgent' | 'normal' | 'other',
    description: '',
    expiryDate: '',
    targetAudience: 'all' as 'students' | 'employers' | 'all',
    image: '',
    attachment: '',
    imageFile: null as File | null,
    attachmentFile: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageError, setImageError] = useState<string>('');
  const [attachmentError, setAttachmentError] = useState<string>('');

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !modalRef.current) return;
    
    const x = e.clientX - dragOffset.x;
    const y = e.clientY - dragOffset.y;
    
    // Keep modal within viewport bounds
    const maxX = window.innerWidth - modalRef.current.offsetWidth;
    const maxY = window.innerHeight - modalRef.current.offsetHeight;
    
    const clampedX = Math.max(0, Math.min(x, maxX));
    const clampedY = Math.max(0, Math.min(y, maxY));
    
    modalRef.current.style.left = `${clampedX}px`;
    modalRef.current.style.top = `${clampedY}px`;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add event listeners for drag functionality
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateImage(file);
      if (error) {
        setImageError(error);
        return;
      }
      
      setImageError('');
      setFormData({ ...formData, imageFile: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation for attachments
      const allowedTypes = ['application/pdf', 'text/plain', 'application/msword'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setAttachmentError('Only PDF, TXT, and DOC files are allowed');
        return;
      }
      
      if (file.size > maxSize) {
        setAttachmentError('Attachment size must be under 5MB');
        return;
      }

      setAttachmentError('');
      setFormData({ ...formData, attachmentFile: file });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for submission
    const submissionData = {
      ...formData,
      postedDate: new Date().toISOString(),
      postedBy: currentUser?.name || 'Admin',
      image: imagePreview || formData.image,
      attachment: formData.attachment
    };

    onSubmit(submissionData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl border max-w-2xl w-full ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className={`p-6 border-b flex items-center justify-between ${dk ? 'border-gray-800' : 'border-gray-100'}`}>
          <h2 className={`text-xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Create Announcement</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${dk ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={100}
              placeholder="Enter announcement title (6-12 words)"
              className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'}`}
            />
            <p className={`text-xs mt-1 ${dk ? 'text-gray-500' : 'text-gray-500'}`}>
              {formData.title.length}/100 characters
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              required
              className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${dk ? 'bg-gray-800 border-gray-700 text-gray-100' : 'border-gray-200'}`}
            >
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
              Description *
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={6}
                placeholder="Enter announcement content..."
                className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'} pr-10`}
              />
              <div className={`absolute right-2 bottom-2 text-xs ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                {formData.description.length}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${dk ? 'bg-gray-800 border-gray-700 text-gray-100' : 'border-gray-200'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                Target Audience
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${dk ? 'bg-gray-800 border-gray-700 text-gray-100' : 'border-gray-200'}`}
              >
                <option value="all">All</option>
                <option value="students">Students</option>
                <option value="employers">Employers</option>
              </select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
              Image Upload (Optional)
            </label>
            <div className={`border-2 border-dashed rounded-xl p-4 text-center ${dk ? 'border-gray-700 hover:border-indigo-500' : 'border-gray-300 hover:border-indigo-400'}`}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
                  <p className={`text-xs ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                    Image preview - 16:9 aspect ratio recommended
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData({ ...formData, imageFile: null });
                    }}
                    className={`text-red-500 hover:text-red-700 text-sm`}
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center gap-2 mx-auto px-4 py-2 border rounded-lg ${dk ? 'border-gray-600 text-gray-300 hover:border-indigo-500 hover:text-indigo-400' : 'border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                >
                  <Upload className="w-4 h-4" />
                  Choose Image (Max 2MB)
                </button>
              )}
              {imageError && (
                <p className="text-red-500 text-xs mt-1">{imageError}</p>
              )}
            </div>
          </div>

          {/* Attachment Upload Section */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
              Attachment (Optional)
            </label>
            <div className={`border-2 border-dashed rounded-xl p-4 text-center ${dk ? 'border-gray-700 hover:border-indigo-500' : 'border-gray-300 hover:border-indigo-400'}`}>
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleAttachmentChange}
                className="hidden"
                id="attachment-input"
              />
              {formData.attachmentFile ? (
                <div className="space-y-2">
                  <div className={`flex items-center justify-between p-2 rounded-lg ${dk ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                      <FileIcon className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{formData.attachmentFile.name}</span>
                      <span className={`text-xs ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatFileSize(formData.attachmentFile.size)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attachmentFile: null })}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <p className={`text-xs ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                    PDF, TXT, or DOC files only (Max 5MB)
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => document.getElementById('attachment-input')?.click()}
                  className={`flex items-center gap-2 mx-auto px-4 py-2 border rounded-lg ${dk ? 'border-gray-600 text-gray-300 hover:border-indigo-500 hover:text-indigo-400' : 'border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                >
                  <FileIcon className="w-4 h-4" />
                  Choose Attachment
                </button>
              )}
              {attachmentError && (
                <p className="text-red-500 text-xs mt-1">{attachmentError}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
            >
              Create Announcement
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2.5 border rounded-xl text-sm font-medium ${dk ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function EditAnnouncementModal({ announcement, onClose, onSubmit }: {
  announcement: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
}) {
  const { theme } = useApp();
  const dk = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: announcement.title,
    type: announcement.type,
    description: announcement.description,
    expiryDate: announcement.expiryDate || '',
    targetAudience: announcement.targetAudience || 'all',
    image: announcement.image || '',
    attachment: announcement.attachment || '',
    imageFile: null as File | null,
    attachmentFile: null as File | null
  });
  const [imagePreview, setImagePreview] = useState<string>(announcement.image || '');
  const [imageError, setImageError] = useState<string>('');
  const [attachmentError, setAttachmentError] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const error = validateImage(file);
      if (error) {
        setImageError(error);
        return;
      }
      
      setImageError('');
      setFormData({ ...formData, imageFile: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic validation for attachments
      const allowedTypes = ['application/pdf', 'text/plain', 'application/msword'];
      const maxSize = 5 * 1024 * 1024; // 5MB

      if (!allowedTypes.includes(file.type)) {
        setAttachmentError('Only PDF, TXT, and DOC files are allowed');
        return;
      }
      
      if (file.size > maxSize) {
        setAttachmentError('Attachment size must be under 5MB');
        return;
      }

      setAttachmentError('');
      setFormData({ ...formData, attachmentFile: file });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for submission
    const submissionData = {
      ...announcement,
      ...formData,
      image: imagePreview || formData.image,
      attachment: formData.attachment
    };

    onSubmit(submissionData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-2xl border max-w-2xl w-full ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
        <div className={`p-6 border-b flex items-center justify-between ${dk ? 'border-gray-800' : 'border-gray-100'}`}>
          <h2 className={`text-xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Edit Announcement</h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg ${dk ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div>
            <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              maxLength={100}
              placeholder="Enter announcement title (6-12 words)"
              className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'}`}
            />
            <p className={`text-xs mt-1 ${dk ? 'text-gray-500' : 'text-gray-500'}`}>
              {formData.title.length}/100 characters
            </p>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
              Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              required
              className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${dk ? 'bg-gray-800 border-gray-700 text-gray-100' : 'border-gray-200'}`}
            >
              <option value="urgent">Urgent</option>
              <option value="normal">Normal</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
              Description *
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={6}
                placeholder="Enter announcement content..."
                className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'} pr-10`}
              />
              <div className={`absolute right-2 bottom-2 text-xs ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                {formData.description.length}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${dk ? 'bg-gray-800 border-gray-700 text-gray-100' : 'border-gray-200'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                Target Audience
              </label>
              <select
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value as any })}
                className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${dk ? 'bg-gray-800 border-gray-700 text-gray-100' : 'border-gray-200'}`}
              >
                <option value="all">All</option>
                <option value="students">Students</option>
                <option value="employers">Employers</option>
              </select>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
              Image Upload (Optional)
            </label>
            <div className={`border-2 border-dashed rounded-xl p-4 text-center ${dk ? 'border-gray-700 hover:border-indigo-500' : 'border-gray-300 hover:border-indigo-400'}`}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview ? (
                <div className="space-y-2">
                  <img src={imagePreview} alt="Preview" className="max-h-32 mx-auto rounded-lg" />
                  <p className={`text-xs ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                    Image preview - 16:9 aspect ratio recommended
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData({ ...formData, imageFile: null });
                    }}
                    className={`text-red-500 hover:text-red-700 text-sm`}
                  >
                    Remove Image
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex items-center gap-2 mx-auto px-4 py-2 border rounded-lg ${dk ? 'border-gray-600 text-gray-300 hover:border-indigo-500 hover:text-indigo-400' : 'border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                >
                  <Upload className="w-4 h-4" />
                  Choose Image (Max 2MB)
                </button>
              )}
              {imageError && (
                <p className="text-red-500 text-xs mt-1">{imageError}</p>
              )}
            </div>
          </div>

          {/* Attachment Upload Section */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
              Attachment (Optional)
            </label>
            <div className={`border-2 border-dashed rounded-xl p-4 text-center ${dk ? 'border-gray-700 hover:border-indigo-500' : 'border-gray-300 hover:border-indigo-400'}`}>
              <input
                type="file"
                accept=".pdf,.txt,.doc,.docx"
                onChange={handleAttachmentChange}
                className="hidden"
                id="attachment-input"
              />
              {formData.attachmentFile ? (
                <div className="space-y-2">
                  <div className={`flex items-center justify-between p-2 rounded-lg ${dk ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <div className="flex items-center gap-2">
                      <FileIcon className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{formData.attachmentFile.name}</span>
                      <span className={`text-xs ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatFileSize(formData.attachmentFile.size)}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, attachmentFile: null })}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <p className={`text-xs ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                    PDF, TXT, or DOC files only (Max 5MB)
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => document.getElementById('attachment-input')?.click()}
                  className={`flex items-center gap-2 mx-auto px-4 py-2 border rounded-lg ${dk ? 'border-gray-600 text-gray-300 hover:border-indigo-500 hover:text-indigo-400' : 'border-gray-300 text-gray-600 hover:border-indigo-400 hover:text-indigo-600'}`}
                >
                  <FileIcon className="w-4 h-4" />
                  Choose Attachment
                </button>
              )}
              {attachmentError && (
                <p className="text-red-500 text-xs mt-1">{attachmentError}</p>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700"
            >
              Update Announcement
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`px-6 py-2.5 border rounded-xl text-sm font-medium ${dk ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
