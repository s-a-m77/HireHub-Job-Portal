import { useApp } from '@/context/AppContext';
import { Search, MapPin, Clock, DollarSign, Building2, Users, Briefcase, TrendingUp, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { RevealCard } from '@/components/RevealCard';

export function HomePage() {
  const { jobs, navigate, currentUser, setSearchQuery, setFilterType, setLocation, theme, getEmployers } = useApp();
  const [search, setSearch] = useState('');
  const [loc, setLoc] = useState('');
  const employers = getEmployers();
  const activeJobs = jobs.filter(j => j.status === 'active');
  const latestJobs = activeJobs.slice(0, 6);
  const dk = theme === 'dark';

  const handleSearch = () => {
    setSearchQuery(search);
    setLocation(loc);
    console.log("Searching for:", search, "in", loc);
    setFilterType('');
    navigate('browse-jobs');
  };

  const popularSearches = ['Software Engineer', 'Marketing Intern', 'Data Analyst', 'Product Design'];

  const formatDate = (d: string) => {
    const diff = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    return `${diff} days ago`;
  };

  return (
    <div className={`min-h-screen ${dk ? 'bg-gray-950' : 'bg-gray-50'}`}>
      {/* Hero Section */}
      <section className={`relative overflow-hidden ${dk ? 'bg-gradient-to-br from-[#0a0f1a] via-[#0f172a] to-[#0a0f1a]' : 'bg-white'}`}>
        
        <div className={`absolute inset-0 ${dk ? 'opacity-20' : 'opacity-10'}`}>
          {/* Decorative shapes */}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24 md:py-32 flex flex-col items-center">
          <Reveal delay={0}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-800/60 backdrop-blur-sm rounded-full text-blue-300 text-sm mb-6 border border-gray-700/60">
              <Briefcase className="w-4 h-4" /> 10,000+ opportunities waiting for you
            </div>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight max-w-4xl mx-auto">
               <span className={dk ? 'text-gray-100' : 'text-gray-900'}>Launch Your Career with</span>
               <br />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">Dream Internships & Jobs</span>
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto items-center">
              <strong className={`min-h-screen ${dk ? 'bg-gray-970' : 'bg-gray-50'}`}>Connect with top companies actively hiring university students.</strong> <br />
              <span className={`min-h-screen ${dk ? 'bg-gray-950' : 'bg-gray-50'}`}> Find internships and entry-level jobs tailored for your career path.</span> 
            </p>
          </Reveal>

          {/* Search Bar */}
          <Reveal delay={300} width="100%">
            <div className="bg-gray-500/40 backdrop-blur-sm rounded-2xl p-2.5 border border-purple-700/50 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-2xl shadow-black/30">
            <div className="flex-1 flex items-center gap-2 px-4">
              <Search className="w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="software engineer, marketing intern, data analyst, product design, etc.e"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className="w-full py-3 bg-transparent placeholder-gray-100 focus:outline-none text-gray-200"
              />
            </div>
            <div className='flex-1 flex items-center gap-2 px-4 border-l border-gray-700/50'>
              <MapPin className='w-5 h-5 text-gray-500' />
              <input
                type="text"
                placeholder="addis abeba,remote"
                value={loc}
                onChange={e => setLoc(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                className='w-full py-3 bg-transparent placeholder-gray-100 focus:outline-none text-gray-200'
              />
            </div>

            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white-200 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              <Search className="w-5 h-5 sm:hidden" />
              <span className='hidden sm:inline'>Search</span>
</button>
            </div>
          </Reveal>
          
          <Reveal delay={400} width="100%">
            <div className='mt-6 flex items-center justify-center gap-2 text-sm'>
                <span className='text-gray-400'>Popular:</span>
                {popularSearches.map(s => 
                  <button key={s} onClick={() => { setSearch(s); handleSearch(); }} className='px-3 py-1 bg-gray-500/60 rounded-full hover:bg-gray-700/80 transition-colors border border-gray-700/60'>{s}</button>
                )}
            </div>
          </Reveal>
        </div>
      </section>

{/* Latest Opportunities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <Reveal>
          <div className="flex items-center justify-between mb-2">
            <h2 className={`text-2xl md:text-3xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Latest Opportunities</h2>
            </div>
            <span className='items-center'>
            <button
              onClick={() => navigate('browse-jobs')}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button> 
            </span> 
          
          <p className={`mb-8 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Fresh jobs posted by top employers</p>
        </Reveal>
        

        {latestJobs.length === 0 ? (
          <div className={`text-center py-16 rounded-2xl border ${dk ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
            <Briefcase className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-lg font-medium mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>No jobs posted yet</h3>
            <p className={dk ? 'text-gray-400' : 'text-gray-500'}>Be the first employer to post a job opportunity!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {latestJobs.map(job => (
              <div
                key={job.id}
                className={`rounded-xl p-6 transition-all duration-300 ease-out cursor-pointer group transform hover:-translate-y-[5px] shadow-lg shadow-blue-500/20 ${dk ? 'bg-gray-900 border border-blue-500/20' : 'bg-white'}`}
                onClick={() => navigate('job-detail', job.id)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${dk ? 'bg-gray-800' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
                    {job.companyLogo || '🏢'}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-semibold group-hover:text-indigo-600 transition-colors truncate ${dk ? 'text-white' : 'text-gray-900'}`}>{job.title}</h3>
                    <p className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{job.companyName}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className={`flex items-center gap-2 text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                    <MapPin className={`w-4 h-4 ${dk ? 'text-gray-500' : 'text-gray-400'}`} /> {job.location}
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                    <DollarSign className={`w-4 h-4 ${dk ? 'text-gray-500' : 'text-gray-400'}`} /> {job.salary}
                  </div>
                  <div className={`flex items-center gap-2 text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>
                    <Clock className={`w-4 h-4 ${dk ? 'text-gray-500' : 'text-gray-400'}`} /> {formatDate(job.postedDate)}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.type === 'Full-time' ? (dk ? 'bg-green-900/40 text-green-400' : 'bg-green-50 text-green-700') :
                    job.type === 'Part-time' ? (dk ? 'bg-blue-900/40 text-blue-400' : 'bg-blue-50 text-blue-700') :
                    job.type === 'Internship' ? (dk ? 'bg-amber-900/40 text-amber-400' : 'bg-amber-50 text-amber-700') :
                    job.type === 'Remote' ? (dk ? 'bg-purple-900/40 text-purple-400' : 'bg-purple-50 text-purple-700') :
                    (dk ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-700')
                  }`}>
                    {job.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${dk ? 'bg-gray-800 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>{job.category}</span>
              
                
                
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="sm:hidden mt-6 text-center">
          <button onClick={() => navigate('browse-jobs')} className="text-indigo-600 font-medium text-sm flex items-center gap-1 mx-auto">
            View All Jobs <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Featured Companies */}
      <section className={`py-16 ${dk ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 ">
          <div className="text-center mb-10" >
            <h2 className={`text-2xl md:text-3xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>Featured Companies</h2>
            <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Companies actively hiring on HireHub</p>
          </div>
          {employers.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className={`w-12 h-12 mx-auto mb-4 ${dk ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className={dk ? 'text-gray-400' : 'text-gray-500'}>No companies registered yet</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 ">
              {employers.map((emp, index) => {
                const companyJobs = jobs.filter(j => j.employerId === emp.id && j.status === 'active');
                return (
                  <RevealCard key={emp.id} delay={index * 100}>
                    <div className={`rounded-4xl p-6 hover:shadow-md hover:-translate-y-1 hover:scale-105 transition-all border-2 text-center  ${dk ? 'bg-gray-800 border-gray-700' : 'bg-indigo-50 border-gray-100'}`}>
                      <div className={`w-16 h-16 rounded-2xl shadow-sm flex items-center justify-center text-3xl mx-auto mb-4 ${dk ? 'bg-gray-700' : 'bg-gray-300'}`}>
                        {emp.companyLogo || '🏢'}
                      </div>
                      <h3 className={`font-semibold mb-1 ${dk ? 'text-white' : 'text-gray-900'}`}>{emp.companyName || emp.name}</h3>
                      <p className={`text-sm mb-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{emp.industry || 'Technology'}</p>
                      <p className={`text-sm mb-3 ${dk ? 'text-gray-500' : 'text-gray-400'}`}>{emp.companyLocation || 'Remote'}</p>
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${dk ? 'bg-indigo-900/40 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        <Briefcase className="w-3 h-3" /> {companyJobs.length} open positions
                      </span>
                    </div>
                  </RevealCard>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className={`text-2xl md:text-3xl font-bold ${dk ? 'text-white' : 'text-gray-900'}`}>How It Works</h2>
          <p className={`mt-1 ${dk ? 'text-gray-400' : 'text-gray-500'}`}>Get started in 3 simple steps</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Users, title: 'Create Account', desc: 'Sign up as a student or employer in seconds. Fill in your profile details.' },
            { icon: Search, title: 'Discover Opportunities', desc: 'Browse jobs posted by real employers. Filter by type, location, and category.' },
            { icon: TrendingUp, title: 'Apply & Grow', desc: 'Apply to jobs with one click. Track your applications and land your dream role.' },
          ].map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-indigo-200">
                <step.icon className="w-7 h-7 text-white" />
              </div>
              <div className="text-sm font-medium text-indigo-600 mb-2">Step {i + 1}</div>
              <h3 className={`text-lg font-semibold mb-2 ${dk ? 'text-white' : 'text-gray-900'}`}>{step.title}</h3>
              <p className={`text-sm ${dk ? 'text-gray-400' : 'text-gray-500'}`}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      {!currentUser && (
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
            <p className="text-indigo-100 mb-8 max-w-xl mx-auto">Join HireHub today and connect with amazing opportunities. Whether you're a student looking for jobs or an employer looking for talent.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('register')}
                className="px-8 py-3 bg-white text-indigo-600 rounded-xl font-medium hover:bg-gray-50 shadow-lg"
              >
                Sign Up as Student
              </button>
              <button
                onClick={() => navigate('register')}
                className="px-8 py-3 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-400 border border-indigo-400"
              >
                Register as Employer
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className={`py-12 ${dk ? 'bg-gray-900 text-gray-400' : 'bg-gray-900 text-gray-400'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">HireHub</span>
              </div>
              <p className="text-sm">Connecting students with their dream careers since 2024.</p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">For Students</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('browse-jobs')} className="hover:text-white">Browse Jobs</button></li>
                <li><button onClick={() => navigate('browse-companies')} className="hover:text-white">Companies</button></li>
                <li><button className="hover:text-white">Career Resources</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">For Employers</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => navigate('register')} className="hover:text-white">Post a Job</button></li>
                <li><button className="hover:text-white">Find Talent</button></li>
                <li><button className="hover:text-white">Pricing</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white">About Us</button></li>
                <li><button className="hover:text-white">Contact</button></li>
                <li><button className="hover:text-white">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-sm text-center">
            © 2024 HireHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
