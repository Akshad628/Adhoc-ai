import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, Sparkles, Phone, Mail, ArrowRight, Check
} from 'lucide-react';
import { SkeletonCard, SkeletonTable } from './components/Skeleton';

export default function CounsellorDashboard() {
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'home';
  const [isViewLoading, setIsViewLoading] = useState(false);

  useEffect(() => {
    setIsViewLoading(true);
    const timer = setTimeout(() => setIsViewLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeView]);

  // Leads Local State (Kanban cards)
  const [leads, setLeads] = useState([
    { id: '1', name: 'Alice Green', course: 'Computer Science', status: 'new', aiScore: 92, phone: '+1234999222', email: 'alice.g@gmail.com' },
    { id: '2', name: 'David Smith', course: 'Electronics & Communication', status: 'new', aiScore: 78, phone: '+1234777333', email: 'david.s@gmail.com' },
    { id: '3', name: 'Robert Jenkins', course: 'Mechanical Engineering', status: 'contacted', aiScore: 65, phone: '+1234555888', email: 'r.jenkins@gmail.com' },
    { id: '4', name: 'Emma Watson', course: 'Computer Science', status: 'scheduled', aiScore: 95, phone: '+1234444555', email: 'emma@gmail.com' },
    { id: '5', name: 'Jack Sparrow', course: 'Civil Engineering', status: 'admitted', aiScore: 84, phone: '+1234222111', email: 'jack@gmail.com' },
  ]);

  // Enquiries Search Local State
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadCourse, setNewLeadCourse] = useState('Computer Science');

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadEmail) return;

    const newLead = {
      id: Math.random().toString(),
      name: newLeadName,
      course: newLeadCourse,
      status: 'new',
      aiScore: Math.floor(Math.random() * 40) + 60, // random 60-100 score
      phone: '+91 98765 43210',
      email: newLeadEmail,
    };

    setLeads(prev => [...prev, newLead]);
    setNewLeadName('');
    setNewLeadEmail('');
    alert(`Lead "${newLead.name}" added successfully!`);
  };

  const moveLeadStatus = (leadId: string, nextStatus: 'new' | 'contacted' | 'scheduled' | 'admitted') => {
    setLeads(prev => prev.map(lead => lead.id === leadId ? { ...lead, status: nextStatus } : lead));
  };

  const columns = [
    { key: 'new', title: 'New Enquiries', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { key: 'contacted', title: 'Contacted', bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
    { key: 'scheduled', title: 'Interview Scheduled', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    { key: 'admitted', title: 'Admitted', bg: 'bg-green-500/10 text-green-400 border-green-500/20' },
  ];

  return (
    <div className="pb-24">
      {isViewLoading ? (
        <div className="space-y-6">
          {activeView === 'home' ? (
            <>
              <div className="h-8 bg-white/5 rounded w-1/3 mb-8 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 bg-panel border border-white/5 rounded-3xl animate-pulse"></div>
                ))}
              </div>
              <SkeletonCard rows={2} />
            </>
          ) : activeView === 'leads' ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <div className="h-10 bg-white/5 border border-white/10 rounded-xl animate-pulse"></div>
                  <SkeletonCard rows={2} />
                </div>
              ))}
            </div>
          ) : (
            <SkeletonTable rows={4} />
          )}
        </div>
      ) : (
        <AnimatePresence mode="wait">
        
        {/* VIEW: HOME OVERVIEW */}
        {activeView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Admissions Dashboard Overview</h2>
              <p className="text-gray-400 mt-1">Review active pipeline status and recent admissions leads.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium">New Enquiries</h3>
                <p className="text-3xl font-bold mt-2 text-white">
                  {leads.filter(l => l.status === 'new').length}
                </p>
                <p className="text-xs text-blue-400 font-semibold mt-1">Pending review</p>
              </div>
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium">Hot Leads</h3>
                <p className="text-3xl font-bold mt-2 text-white">
                  {leads.filter(l => l.status === 'contacted' || l.status === 'scheduled').length}
                </p>
                <p className="text-xs text-purple-400 font-semibold mt-1">Contacted/Scheduled</p>
              </div>
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium">Calls Logged</h3>
                <p className="text-3xl font-bold mt-2 text-white">84</p>
                <p className="text-xs text-gray-500 mt-1">This semester</p>
              </div>
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium">Admitted</h3>
                <p className="text-3xl font-bold mt-2 text-white">
                  {leads.filter(l => l.status === 'admitted').length}
                </p>
                <p className="text-xs text-green-400 font-semibold mt-1">Enrollment complete</p>
              </div>
            </div>

            {/* Add lead fast-entry form */}
            <h3 className="text-xl font-bold mb-4">Fast Lead Entry</h3>
            <form onSubmit={handleCreateLead} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-panel border border-white/5 p-6 rounded-3xl shadow-lg mb-8">
              <input 
                type="text" 
                placeholder="Student Name"
                value={newLeadName}
                onChange={(e) => setNewLeadName(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-accent-primary"
                required
              />
              <input 
                type="email" 
                placeholder="Email Address"
                value={newLeadEmail}
                onChange={(e) => setNewLeadEmail(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-accent-primary"
                required
              />
              <select 
                value={newLeadCourse}
                onChange={(e) => setNewLeadCourse(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-accent-primary"
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Civil Engineering">Civil Engineering</option>
              </select>
              <button 
                type="submit"
                className="bg-accent-primary hover:bg-orange-500 text-white font-semibold rounded-xl text-sm py-2.5 shadow-md shadow-orange-500/10 transition-all"
              >
                Create Lead Profile
              </button>
            </form>
          </motion.div>
        )}

        {/* VIEW: LEADS KANBAN BOARD */}
        {activeView === 'leads' && (
          <motion.div
            key="leads"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">CRM Admission Pipeline</h2>
              <p className="text-gray-400 mt-1">Review student leads and update their admission pipeline stages.</p>
            </div>

            {/* Kanban Columns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
              {columns.map((col) => {
                const columnLeads = leads.filter(lead => lead.status === col.key);
                return (
                  <div key={col.key} className="bg-panel border border-white/5 rounded-3xl p-4 flex flex-col min-h-[450px]">
                    <div className={`flex justify-between items-center px-3 py-1.5 rounded-xl border mb-4 text-xs font-semibold ${col.bg}`}>
                      <span>{col.title}</span>
                      <span className="bg-white/10 px-2 py-0.5 rounded-md text-white">{columnLeads.length}</span>
                    </div>

                    <div className="flex-1 space-y-4 overflow-y-auto max-h-[500px] pr-1 custom-scrollbar">
                      {columnLeads.map((lead) => (
                        <div key={lead.id} className="bg-surface border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors shadow-md relative group">
                          {/* AI Score Badge */}
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-semibold text-white truncate max-w-[120px]">{lead.course}</span>
                            <span className="flex items-center space-x-1 text-[11px] font-bold text-accent-primary bg-accent-primary/10 border border-accent-primary/15 px-2 py-0.5 rounded-full shrink-0">
                              <Sparkles size={10} />
                              <span>AI: {lead.aiScore}%</span>
                            </span>
                          </div>

                          <h4 className="font-bold text-white text-base">{lead.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">{lead.email}</p>
                          <p className="text-xs text-gray-500">{lead.phone}</p>

                          {/* Fast Action Buttons */}
                          <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-3">
                            <div className="flex space-x-1">
                              <a href={`tel:${lead.phone}`} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Phone size={14} />
                              </a>
                              <a href={`mailto:${lead.email}`} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors">
                                <Mail size={14} />
                              </a>
                            </div>

                            {/* Move stage trigger */}
                            <div className="flex space-x-1">
                              {col.key === 'new' && (
                                <button onClick={() => moveLeadStatus(lead.id, 'contacted')} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] px-2 py-1 rounded transition-colors flex items-center space-x-1">
                                  <span>Call</span>
                                  <ArrowRight size={10} />
                                </button>
                              )}
                              {col.key === 'contacted' && (
                                <button onClick={() => moveLeadStatus(lead.id, 'scheduled')} className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] px-2 py-1 rounded transition-colors flex items-center space-x-1">
                                  <span>Schedule</span>
                                  <ArrowRight size={10} />
                                </button>
                              )}
                              {col.key === 'scheduled' && (
                                <button onClick={() => moveLeadStatus(lead.id, 'admitted')} className="bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 text-green-400 text-[10px] px-2 py-1 rounded transition-colors flex items-center space-x-1 font-bold">
                                  <Check size={10} />
                                  <span>Admit</span>
                                </button>
                              )}
                              {col.key === 'admitted' && (
                                <span className="text-[10px] text-green-400 font-bold px-1 py-1 flex items-center space-x-1 select-none">
                                  <Check size={12} />
                                  <span>Completed</span>
                                </span>
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
          </motion.div>
        )}

        {/* VIEW: CHAT LOGS HISTORY */}
        {activeView === 'chat-logs' && (
          <motion.div
            key="chat-logs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Admissions AI Chat Logs</h2>
              <p className="text-gray-400 mt-1">Review live chat queries addressed by the GCET Admission Agent.</p>
            </div>

            <div className="bg-panel border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
              <ChatItem user="Prospective Student: Alice" query="What are the CSE branch cut-off ranks for GCET?" reply="The GCET B.Tech Computer Science and Engineering cutoff rank is generally between 12,000 and 18,500 in EAMCET. Let me know if you would like info on other branches." time="12 mins ago" />
              <ChatItem user="Parent: Robert Jenkins" query="Can I pay fees in installments?" reply="Yes, GCET allows fee installment allocations with prior administrative approval. Let me pull up the guidelines." time="2 hours ago" />
              <ChatItem user="Student: John Doe" query="What branches are available at GCET?" reply="GCET offers B.Tech programs in CSE, ECE, EEE, Mechanical, Civil, CSE (AI&ML), and CSE (Data Science). Which one interests you?" time="1 day ago" />
            </div>
          </motion.div>
        )}

      </AnimatePresence>
      )}
    </div>
  );
}

/* Helper Cards Components */
function ChatItem({ user, query, reply, time }: {
  user: string, query: string, reply: string, time: string
}) {
  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-colors shadow-md relative">
      <div className="flex justify-between items-center mb-3">
        <h4 className="font-bold text-white text-base">{user}</h4>
        <span className="text-xs font-semibold text-gray-500">{time}</span>
      </div>

      <div className="space-y-3 mt-3 text-sm">
        <div className="bg-black/20 p-3 rounded-xl border border-white/5">
          <p className="text-gray-400 font-medium text-xs uppercase tracking-wider mb-1">User Query</p>
          <p className="text-gray-200">"{query}"</p>
        </div>
        <div className="bg-accent-primary/5 p-3 rounded-xl border border-accent-primary/10">
          <p className="text-accent-primary font-bold text-xs uppercase tracking-wider mb-1 flex items-center space-x-1">
            <Bot size={12} />
            <span>AI Admission Agent</span>
          </p>
          <p className="text-gray-200 leading-relaxed">"{reply}"</p>
        </div>
      </div>
    </div>
  );
}