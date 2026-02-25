import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Reveal } from '@/components/Reveal';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export function ContactPage() {
  const { theme, sendContactMessage, navigate } = useApp();
  const dk = theme === 'dark';
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network delay
    setTimeout(() => {
      sendContactMessage(
        formData.name,
        formData.email,
        formData.subject,
        formData.message
      );
      setSubmitted(true);
      setLoading(false);
    }, 500);
  };

  if (submitted) {
    return (
      <div className={`min-h-screen ${dk ? 'bg-gray-950' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <Reveal>
            <div className={`max-w-md mx-auto text-center rounded-2xl border p-8 ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>Message Sent!</h2>
              <p className={`mb-6 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                Thank you for contacting us. We'll get back to you within 24-48 hours.
              </p>
              <button
                onClick={() => navigate('home')}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700"
              >
                Back to Home
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${dk ? 'bg-gray-950' : 'bg-gray-50'} flex flex-col`}>
      {/* Hero Section */}
      <section className={`relative overflow-hidden ${dk ? 'bg-gradient-to-br from-[#0a0f1a] via-[#0f172a] to-[#0a0f1a]' : 'bg-white'}`}>
        <div className="relative w-full px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className={dk ? 'text-gray-100' : 'text-gray-900'}>Get in </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Touch</span>
            </h1>
            <p className={`text-lg ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section className="flex-1 flex items-center justify-center py-14">
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl w-full px-4 sm:px-6">
          {/* Contact Information Side Column - Same size as form */}
          <Reveal delay={100}>
            <div className={`rounded-2xl border p-6 ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${dk ? 'text-white' : 'text-gray-900'}`}>Contact Info</h2>
              
              <div className="space-y-6">
                <div className={`bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-lg border ${dk ? 'border-indigo-800/50' : 'border-indigo-200/50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-lg font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>Visit Us</h3>
                  </div>
                  <p className={`text-sm ${dk ? 'text-gray-300' : 'text-gray-600'}`}>
                    Haramaya University<br />
                    Building 2, Office No. 5
                  </p>
                </div>
                
                <div className={`bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-lg border ${dk ? 'border-indigo-800/50' : 'border-indigo-200/50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-lg font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>Email Us</h3>
                  </div>
                  <p className={`text-sm ${dk ? 'text-gray-300' : 'text-gray-600'}`}>
                    hirehub@gmail.com
                  </p>
                </div>
                
                <div className={`bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4 rounded-lg border ${dk ? 'border-indigo-800/50' : 'border-indigo-200/50'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-white" />
                    </div>
                    <h3 className={`text-lg font-semibold ${dk ? 'text-white' : 'text-gray-900'}`}>Call Us</h3>
                  </div>
                  <p className={`text-sm ${dk ? 'text-gray-300' : 'text-gray-600'}`}>
                    +2519333333
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Contact Form - Same size as contact info */}
          <Reveal delay={200}>
            <div className={`rounded-2xl border p-6 ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${dk ? 'text-white' : 'text-gray-900'}`}>Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Your name"
                      className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${
                        dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="your@email.com"
                      className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${
                        dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    placeholder="Subject of your message"
                    className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 ${
                      dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${dk ? 'text-gray-300' : 'text-gray-700'}`}>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell us more about your inquiry..."
                    className={`w-full px-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none ${
                      dk ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500' : 'border-gray-200'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
