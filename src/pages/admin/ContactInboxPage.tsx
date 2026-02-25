import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Reveal } from '@/components/Reveal';
import { Mail, Phone, Clock, Search, Trash2, Check, X, Send, User, Eye, EyeOff } from 'lucide-react';
import { getAll, updateOne, deleteOne } from '@/firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { ContactMessage } from '@/types';

const formatDate = (d: string) => {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return `${diff} days ago`;
};

export function ContactInboxPage() {
  const { 
    theme, 
    currentUser
  } = useApp();
  const dk = theme === 'dark';
  
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    const fetchMessages = async () => {
      const querySnapshot = await getAll('contactMessages');
      const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ContactMessage));
      setMessages(messagesData);
      setUnreadCount(messagesData.filter(msg => !msg.read).length);
    };
    fetchMessages();
  }, []);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<typeof messages[0] | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const filteredMessages = messages.filter(msg =>
    !searchQuery || 
    msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => (b.createdAt as any) - (a.createdAt as any));

  const handleMarkAsRead = async (messageId: string) => {
    await updateOne('contactMessages', messageId, { read: true });
    setMessages(messages.map(msg => msg.id === messageId ? { ...msg, read: true } : msg));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage({ ...selectedMessage, read: true });
    }
    setUnreadCount(unreadCount - 1);
  };

  const handleReply = async () => {
    if (selectedMessage && replyText.trim()) {
      await updateOne('contactMessages', selectedMessage.id, { 
        reply: replyText, 
        repliedDate: serverTimestamp(),
        read: true,
      });
      setShowReplyForm(false);
      setReplyText('');
      setMessages(messages.map(msg => msg.id === selectedMessage.id ? { ...msg, reply: replyText, repliedDate: new Date().toISOString(), read: true } : msg));
      setSelectedMessage({ ...selectedMessage, reply: replyText, repliedDate: new Date().toISOString() });
    }
  };

  const handleDelete = async (messageId: string) => {
    await deleteOne('contactMessages', messageId);
    setMessages(messages.filter(msg => msg.id !== messageId));
    if (selectedMessage?.id === messageId) {
      setSelectedMessage(null);
    }
    setConfirmDelete(null);
  };

  return (
    <div className={`min-h-screen ${dk ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Contact Messages</h1>
              <p className={dk ? 'text-gray-400' : 'text-gray-500'}>
                {messages.length} total message{messages.length !== 1 ? 's' : ''}
                {unreadCount > 0 && (
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${dk ? 'bg-red-900/40 text-red-400' : 'bg-red-50 text-red-700'}`}>
                    {unreadCount} unread
                  </span>
                )}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <Reveal delay={100}>
            <div className={`rounded-xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              {/* Search */}
              <div className="p-4 border-b border-gray-700/50">
                <div className={`flex items-center gap-2 px-3 border rounded-lg ${dk ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                  <Search className={`w-4 h-4 ${dk ? 'text-gray-500' : 'text-gray-400'}`} />
                  <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search messages..."
                    className={`w-full py-2 bg-transparent outline-none text-sm ${dk ? 'text-gray-100 placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'}`}
                  />
                </div>
              </div>

              {/* Messages List */}
              <div className="divide-y divide-gray-700/50 max-h-[600px] overflow-y-auto">
                {filteredMessages.length === 0 ? (
                  <div className={`p-8 text-center text-sm ${dk ? 'text-gray-500' : 'text-gray-500'}`}>
                    No messages found
                  </div>
                ) : (
                  filteredMessages.map(message => (
                    <button
                      key={message.id}
                      onClick={() => {
                        setSelectedMessage(message);
                        if (!message.read) {
                          handleMarkAsRead(message.id);
                        }
                      }}
                      className={`w-full text-left p-4 hover:bg-gray-800/50 transition-colors ${
                        selectedMessage?.id === message.id ? (dk ? 'bg-indigo-900/30' : 'bg-indigo-50') : ''
                      } ${!message.read ? (dk ? 'bg-blue-900/20' : 'bg-blue-50') : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                          dk ? 'bg-gray-800 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {message.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <span className={`font-medium text-sm truncate ${dk ? 'text-white' : 'text-gray-900'}`}>
                              {message.name}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${dk ? 'bg-purple-900/40 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                              Contact Form
                            </span>
                            {!message.read && (
                              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${dk ? 'bg-blue-400' : 'bg-blue-600'}`} />
                            )}
                          </div>
                          <p className={`text-xs truncate ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                            {message.email}
                          </p>
                          <p className={`text-sm truncate mt-1 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                            {message.subject}
                          </p>
                          <p className={`text-xs mt-1 ${dk ? 'text-gray-500' : 'text-gray-400'}`}>
                            {formatDate((message.createdAt as any).toDate())}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </Reveal>

          {/* Message Detail */}
          <Reveal delay={200}>
            <div className={`lg:col-span-2 rounded-xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              {selectedMessage ? (
                <div className="h-full flex flex-col">
                  {/* Message Header */}
                  <div className={`p-6 border-b ${dk ? 'border-gray-800' : 'border-gray-100'}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium ${
                          dk ? 'bg-gray-800 text-indigo-400' : 'bg-indigo-100 text-indigo-600'
                        }`}>
                          {selectedMessage.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className={`font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>
                            {selectedMessage.name}
                          </h3>
                          <div className={`flex flex-wrap items-center gap-3 mt-1 text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" />
                              {selectedMessage.email}
                            </span>
                          </div>
                          <p className={`text-xs mt-2 ${dk ? 'text-gray-500' : 'text-gray-400'}`}>
                            {new Date((selectedMessage.createdAt as any).toDate()).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!selectedMessage.read ? (
                          <button
                            onClick={() => handleMarkAsRead(selectedMessage.id)}
                            className={`p-2 rounded-lg ${dk ? 'text-gray-400 hover:text-indigo-400 hover:bg-indigo-900/30' : 'text-gray-500 hover:text-indigo-500 hover:bg-indigo-50'}`}
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className={`px-2 py-1 rounded-full text-xs ${dk ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700'}`}>
                            Read
                          </span>
                        )}
                        {confirmDelete === selectedMessage.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(selectedMessage.id)}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className={`p-1.5 rounded-lg ${dk ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(selectedMessage.id)}
                            className={`p-2 rounded-lg ${dk ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/30' : 'text-gray-500 hover:text-red-500 hover:bg-red-50'}`}
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className={`mt-4 px-4 py-3 rounded-lg ${dk ? 'bg-gray-800' : 'bg-gray-50'}`}>
                      <p className={`text-sm font-medium ${dk ? 'text-gray-300' : 'text-gray-600'}`}>
                        Subject: <span className={dk ? 'text-white' : 'text-gray-900'}>{selectedMessage.subject}</span>
                      </p>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className={`prose prose-sm max-w-none ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                      <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                    </div>

                    {/* Reply Section */}
                    {selectedMessage.reply && (
                      <div className={`mt-6 p-4 rounded-lg border ${dk ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Send className={`w-4 h-4 ${dk ? 'text-green-400' : 'text-green-600'}`} />
                          <span className={`text-sm font-medium ${dk ? 'text-green-400' : 'text-green-700'}`}>
                            Your Reply
                          </span>
                          {selectedMessage.repliedDate && (
                            <span className={`text-xs ${dk ? 'text-gray-500' : 'text-gray-400'}`}>
                              ({new Date(selectedMessage.repliedDate).toLocaleString()})
                            </span>
                          )}
                        </div>
                        <p className={`text-sm whitespace-pre-wrap ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                          {selectedMessage.reply}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Reply Form */}
                  {showReplyForm ? (
                    <div className={`p-6 border-t ${dk ? 'border-gray-800' : 'border-gray-100'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className={`font-medium ${dk ? 'text-white' : 'text-gray-900'}`}>Send Reply</h4>
                        <button
                          onClick={() => {
                            setShowReplyForm(false);
                            setReplyText('');
                          }}
                          className={`p-1.5 rounded-lg ${dk ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <textarea
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder="Type your reply..."
                        rows={4}
                        className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                          dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'
                        }`}
                      />
                      <div className="flex justify-end gap-2 mt-3">
                        <button
                          onClick={() => {
                            setShowReplyForm(false);
                            setReplyText('');
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            dk ? 'border border-gray-700 text-gray-300 hover:bg-gray-800' : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleReply}
                          disabled={!replyText.trim()}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Send Reply
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-6 border-t ${dk ? 'border-gray-800' : 'border-gray-100'}`}>
                      <button
                        onClick={() => setShowReplyForm(true)}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Reply to {selectedMessage.name}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <Mail className={`w-16 h-16 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
                    <p className={dk ? 'text-gray-400' : 'text-gray-500'}>Select a message to view</p>
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
