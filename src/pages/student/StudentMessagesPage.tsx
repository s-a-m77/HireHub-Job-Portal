import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { StudentMessage } from '@/types';
import { Mail, Send, ArrowLeft, Trash2 } from 'lucide-react';

export function StudentMessagesPage() {
  const {
    currentUser,
    getMessagesForStudent,
    markStudentMessageAsRead,
    replyToStudentMessage,
    deleteStudentMessage,
    users,
    theme,
  } = useApp();
  const dk = theme === 'dark';

  const messages = currentUser ? getMessagesForStudent(currentUser.id) : [];
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    if (currentUser) {
      messages.forEach(message => {
        if (message.status === 'sent') {
          markStudentMessageAsRead(message.id);
        }
      });
    }
  }, [currentUser, messages, markStudentMessageAsRead]);

  const handleReply = (messageId: string) => {
    if (replyText.trim()) {
      replyToStudentMessage(messageId, replyText);
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const getEmployer = (employerId: string) => {
    return users.find(u => u.id === employerId);
  };

  return (
    <div className={`max-w-4xl mx-auto my-12 px-4 ${dk ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="flex items-center gap-4 mb-8">
        <Mail className={`w-10 h-10 ${dk ? 'text-indigo-400' : 'text-indigo-600'}`} />
        <div>
          <h1 className="text-4xl font-bold">My Messages</h1>
          <p className={`${dk ? 'text-gray-400' : 'text-gray-500'}`}>
            Communications from employers.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {messages.length === 0 ? (
          <div
            className={`text-center py-16 px-6 rounded-2xl border-2 border-dashed ${
              dk ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'
            }`}
          >
            <Mail className={`w-12 h-12 mx-auto ${dk ? 'text-gray-500' : 'text-gray-400'}`} />
            <h3 className="mt-4 text-xl font-semibold">No Messages Yet</h3>
            <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
              You have no messages from employers at this time.
            </p>
          </div>
        ) : (
          messages
            .sort((a, b) => new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime())
            .map((message: StudentMessage) => {
              const employer = getEmployer(message.employerId);
              return (
                <div
                  key={message.id}
                  className={`p-6 rounded-2xl border ${
                    dk ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200 shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`text-sm font-medium ${dk ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        From: {employer?.companyName || 'A Company'}
                      </p>
                      <h2 className="text-xl font-semibold mt-1">{message.subject}</h2>
                      <p className={`text-sm mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                        Received on: {new Date(message.sentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 text-sm font-medium rounded-full capitalize ${
                        message.status === 'sent'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {message.status}
                    </span>
                  </div>
                  <p className={`mt-4 whitespace-pre-wrap ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                    {message.body}
                  </p>

                  {/* Replies */}
                  {message.replies && message.replies.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {message.replies.map(reply => (
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
                            {reply.senderId === currentUser?.id ? 'Your reply' : `${employer?.companyName || 'Employer'} reply`}
                          </p>
                          <p className={`mt-1 text-sm ${dk ? 'text-gray-200' : 'text-gray-800'}`}>
                            {reply.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 flex items-center gap-3">
                    {replyingTo === message.id ? (
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
                          onClick={() => handleReply(message.id)}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setReplyingTo(message.id)}
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
                          deleteStudentMessage(message.id);
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
            })
        )}
      </div>
    </div>
  );
}
