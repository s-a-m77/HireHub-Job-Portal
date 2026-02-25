import { useEffect, useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AdminMessage, StudentMessage } from '@/types';
import { Mail, Check, X, Send, ArrowLeft, Trash2 } from 'lucide-react';

export function EmployerMessagesPage() {
  const {
    currentUser,
    getAdminMessagesForEmployer,
    getMessagesForEmployerFromStudent,
    markAdminMessageAsRead,
    acceptAdminMessage,
    rejectAdminMessage,
    replyToStudentMessage,
    markStudentMessageAsRead,
    deleteEmployerMessage,
    users,
    theme,
  } = useApp();
  const dk = theme === 'dark';

  const adminMessages = currentUser ? getAdminMessagesForEmployer(currentUser.id) : [];
  const studentMessages = currentUser ? getMessagesForEmployerFromStudent(currentUser.id) : [];
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Combine and sort messages by date
  const allMessages = [
    ...adminMessages.map(msg => ({ ...msg, type: 'admin' as const })),
    ...studentMessages.map(msg => ({ ...msg, type: 'student' as const }))
  ].sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime());

  useEffect(() => {
    if (currentUser) {
      adminMessages.forEach(message => {
        if (message.status === 'pending') {
          markAdminMessageAsRead(message.id);
        }
      });
      studentMessages.forEach(message => {
        if (message.status === 'sent') {
          markStudentMessageAsRead(message.id);
        }
      });
    }
  }, [currentUser, adminMessages, studentMessages, markAdminMessageAsRead, markStudentMessageAsRead]);

  const handleAccept = (id: string) => {
    acceptAdminMessage(id);
  };

  const handleReject = (id: string) => {
    rejectAdminMessage(id);
  };

  const handleReply = (messageId: string) => {
    if (replyText.trim()) {
      replyToStudentMessage(messageId, replyText);
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const getStudent = (studentId: string) => {
    return users.find(u => u.id === studentId);
  };

  return (
    <div className={`max-w-4xl mx-auto my-12 px-4 ${dk ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="flex items-center gap-4 mb-8">
        <Mail className={`w-10 h-10 ${dk ? 'text-indigo-400' : 'text-indigo-600'}`} />
        <div>
          <h1 className="text-4xl font-bold">Messages</h1>
          <p className={`${dk ? 'text-gray-400' : 'text-gray-500'}`}>
            Communications from the HireHub team and students.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {allMessages.length === 0 ? (
          <div
            className={`text-center py-16 px-6 rounded-2xl border-2 border-dashed ${
              dk ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Mail className={`w-12 h-12 mx-auto ${dk ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className="mt-4 text-xl font-semibold">No Messages Yet</h3>
            <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
              You have no messages at this time.
            </p>
          </div>
        ) : (
          allMessages.map((message) => {
            if (message.type === 'admin') {
              const adminMsg = message as AdminMessage;
              return (
                <div
                  key={adminMsg.id}
                  className={`p-6 rounded-2xl border ${
                    adminMsg.status === 'pending'
                      ? dk
                        ? 'bg-gray-800/50 border-red-500 shadow-lg shadow-red-500/20'
                        : 'bg-white border-red-500 shadow-lg shadow-red-500/10'
                      : dk
                      ? 'bg-gray-800/50 border-gray-700'
                      : 'bg-white border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-xs font-medium ${dk ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        From: HireHub Admin
                      </p>
                      <h2 className="text-xl font-semibold mt-1">{adminMsg.subject}</h2>
                      <p className={`text-sm mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                        Received on: {new Date(adminMsg.sentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${
                        adminMsg.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300'
                          : adminMsg.status === 'accepted'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300'
                          : adminMsg.status === 'rejected'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {adminMsg.status}
                    </span>
                  </div>
                  <p className={`mt-4 whitespace-pre-wrap ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                    {adminMsg.body}
                  </p>
                  {adminMsg.status !== 'accepted' && adminMsg.status !== 'rejected' && (
                    <div className="flex gap-4 mt-6 border-t pt-4">
                      <button
                        onClick={() => handleAccept(adminMsg.id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Check className="w-4 h-4" /> Accept
                      </button>
                      <button
                        onClick={() => handleReject(adminMsg.id)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <X className="w-4 h-4" /> Reject
                      </button>
                    </div>
                  )}
                </div>
              );
            } else {
              const studentMsg = message as StudentMessage;
              const student = getStudent(studentMsg.studentId);
              return (
                <div
                  key={studentMsg.id}
                  className={`p-6 rounded-2xl border ${
                    dk ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-xs font-medium ${dk ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        From: {student?.name || 'A Student'}
                      </p>
                      <h2 className="text-xl font-semibold mt-1">{studentMsg.subject}</h2>
                      <p className={`text-sm mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                        Received on: {new Date(studentMsg.sentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${
                        studentMsg.status === 'sent'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {studentMsg.status}
                    </span>
                  </div>
                  <p className={`mt-4 whitespace-pre-wrap ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                    {studentMsg.body}
                  </p>

                  {/* Replies */}
                  {studentMsg.replies && studentMsg.replies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {studentMsg.replies.map(reply => (
                        <div
                          key={reply.id}
                          className={`p-3 rounded-lg ${
                            reply.senderId === currentUser?.id
                              ? dk
                                ? 'bg-indigo-900/20'
                                : 'bg-indigo-50'
                              : dk
                              ? 'bg-gray-700/50'
                              : 'bg-gray-50'
                          }`}
                        >
                          <p className={`text-xs font-medium ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                            {reply.senderId === currentUser?.id ? 'Your reply' : `${student?.name || 'Student'} reply`}
                          </p>
                          <p className={`mt-1 text-sm ${dk ? 'text-gray-200' : 'text-gray-800'}`}>
                            {reply.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-3">
                    {replyingTo === studentMsg.id ? (
                      <div className="flex items-center gap-2 flex-grow">
                        <input
                          type="text"
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder="Type your reply..."
                          className={`flex-grow px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 ${
                            dk
                              ? 'bg-gray-800 border-gray-700'
                              : 'border-gray-300'
                          }`}
                        />
                        <button
                          onClick={() => handleReply(studentMsg.id)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(studentMsg.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg ${
                          dk
                            ? 'bg-gray-700 hover:bg-gray-600'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <ArrowLeft className="w-4 h-4" /> Reply
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this message?')) {
                          deleteEmployerMessage(studentMsg.id);
                        }
                      }}
                      className={`p-2 rounded-lg ${
                        dk
                          ? 'text-gray-500 hover:text-red-400 hover:bg-red-900/30'
                          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                      }`}
                      title="Delete message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            }
          })
        )}
      </div>
    </div>
  );
}
