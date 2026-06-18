import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Activity, Sparkles, ShieldCheck, Database, 
  Cpu, ArrowUpRight, Search, Plus, Save, RotateCcw
} from 'lucide-react';
import { SkeletonCard, SkeletonTable } from './components/Skeleton';

export default function AdminDashboard() {
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'home';
  const [isViewLoading, setIsViewLoading] = useState(false);

  useEffect(() => {
    setIsViewLoading(true);
    const timer = setTimeout(() => setIsViewLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeView]);

  // Prompts Editor Local State
  const [selectedAgent, setSelectedAgent] = useState<'ADMISSION' | 'STUDENT' | 'FACULTY' | 'counsellor' | 'PLACEMENT'>('ADMISSION');
  const [systemPrompt, setSystemPrompt] = useState(
    `You are a demure, extremely helpful, and friendly admission counsellor for Geethanjali College of Engineering and Technology (GCET). Your job is to assist prospective students, answer inquiries regarding fee structures, course eligibility, and branches. Under no circumstances should you talk about other colleges; politely redirect the user back to GCET courses.`
  );
  const [promptVersion, setPromptVersion] = useState(1);
  const [temperature, setTemperature] = useState(0.7);

  // User Manager Local State
  const [users, setUsers] = useState([
    { id: '1', name: 'Akshad Mishra', email: 'akshad@gcet.edu', role: 'Student', status: 'ACTIVE' },
    { id: '2', name: 'Dr. Sarah Connor', email: 's.connor@gcet.edu', role: 'Faculty', status: 'ACTIVE' },
    { id: '3', name: 'Alice Green', email: 'alice.g@gmail.com', role: 'Counsellor', status: 'PENDING' },
    { id: '4', name: 'Robert Jenkins', email: 'r.jenkins@gmail.com', role: 'Parent', status: 'ACTIVE' },
    { id: '5', name: 'John Doe', email: 'john@work.com', role: 'Placement', status: 'SUSPENDED' },
  ]);

  const handleSavePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    setPromptVersion(prev => prev + 1);
    alert(`System prompt for ${selectedAgent} updated successfully to Version ${promptVersion + 1}!`);
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
  };

  return (
    <div className="pb-24">
      {isViewLoading ? (
        <div className="space-y-6">
          {activeView === 'home' ? (
            <>
              <div className="h-8 bg-white/5 rounded w-1/3 mb-8 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-32 bg-panel border border-white/5 rounded-3xl animate-pulse"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SkeletonCard rows={2} />
                <div className="lg:col-span-2">
                  <SkeletonCard rows={3} />
                </div>
              </div>
            </>
          ) : (
            <SkeletonTable rows={5} />
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
              <h2 className="text-3xl font-bold tracking-tight">System Telemetry Overview</h2>
              <p className="text-gray-400 mt-1">Real-time health indicators and system operations log.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard title="Active Connections" value="1,284" change="+12% today" icon={<Users size={20} />} trend="up" />
              <MetricCard title="AI Conversations" value="8,492" change="+3.2k this week" icon={<Sparkles size={20} />} trend="up" />
              <MetricCard title="LLM Tokens / Min" value="412,850" change="Normal Load" icon={<Cpu size={20} />} trend="neutral" />
              <MetricCard title="API Gateway Latency" value="48ms" change="-4ms improvement" icon={<Activity size={20} />} trend="down" />
            </div>

            {/* Platform status logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Database / Vector status */}
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg flex flex-col justify-between">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-gray-400 font-medium">Vector Store Status</h3>
                  <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full font-semibold">Healthy</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">GCET Brochure Embeddings:</span>
                    <span className="text-white font-medium">1,240 Chunks</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Database Vector Engine:</span>
                    <span className="text-white font-medium">pgvector 1.6</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Index Type:</span>
                    <span className="text-white font-medium">HNSW (Cosine)</span>
                  </div>
                </div>
                <div className="border-t border-white/5 pt-4 mt-6">
                  <button className="text-xs text-accent-primary hover:underline flex items-center space-x-1">
                    <span>Run pgvector vacuum analysis</span>
                    <ArrowUpRight size={12} />
                  </button>
                </div>
              </div>

              {/* API Security Log */}
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-gray-400 font-medium">Security Gateways</h3>
                  <span className="text-xs bg-accent-secondary/15 text-accent-secondary border border-accent-secondary/20 px-2.5 py-1 rounded-full font-semibold">Active</span>
                </div>
                <div className="space-y-4">
                  <SecurityRule label="Counsellor Pipelines Isolation" details="Row Level Security (RLS) restricts leads payload to counsellor roles" active />
                  <SecurityRule label="Student Leads Block middleware" details="Strict Node authentication middleware rejects API calls from Student tokens" active />
                  <SecurityRule label="Groq Key Protection" details="API keys loaded exclusively from backend process env vars; hidden from client builds" active />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: AI PROMPT SETTINGS */}
        {activeView === 'prompts' && (
          <motion.div
            key="prompts"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">AI Prompt Management</h2>
              <p className="text-gray-400 mt-1">Edit default system templates, temperature, and persona constraints.</p>
            </div>

            <form onSubmit={handleSavePrompt} className="bg-panel border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Agent Role</label>
                  <select 
                    value={selectedAgent} 
                    onChange={(e: any) => setSelectedAgent(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-primary/50"
                  >
                    <option value="ADMISSION" className="bg-surface">Admission Counsellor</option>
                    <option value="STUDENT" className="bg-surface">Student Academic Guide</option>
                    <option value="FACULTY" className="bg-surface">Faculty Helper</option>
                    <option value="PLACEMENT" className="bg-surface">ATS Pre-screener</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Version</label>
                  <div className="bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-gray-300 font-medium">
                    v{promptVersion} &rarr; v{promptVersion + 1} (Draft)
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Temperature ({temperature})</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="1.2" 
                    step="0.1" 
                    value={temperature} 
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    className="w-full mt-4 accent-accent-primary" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">System Instructions Prompt</label>
                <textarea 
                  rows={8}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-sm font-mono text-gray-200 focus:outline-none focus:border-accent-primary/50 focus:ring-1 focus:ring-accent-primary/50 leading-relaxed"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <button 
                  type="button" 
                  onClick={() => setSystemPrompt(`You are a demure, extremely helpful, and friendly admission counsellor for Geethanjali College of Engineering and Technology (GCET).`)}
                  className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <RotateCcw size={16} />
                  <span>Reset default template</span>
                </button>

                <button 
                  type="submit"
                  className="bg-accent-primary hover:bg-orange-500 text-white font-medium py-3 px-8 rounded-xl flex items-center space-x-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all text-sm"
                >
                  <Save size={16} />
                  <span>Publish Prompt Version</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* VIEW: USER ACCOUNTS */}
        {activeView === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Institutional Accounts</h2>
                <p className="text-gray-400 mt-1">Review active, pending, and suspended user profiles.</p>
              </div>
              
              <div className="flex space-x-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64 bg-white/5 rounded-xl border border-white/10 px-3 py-2 flex items-center">
                  <Search size={16} className="text-gray-400 mr-2" />
                  <input type="text" placeholder="Search profiles..." className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-500" />
                </div>
                <button className="bg-accent-primary hover:bg-orange-500 text-white p-2.5 rounded-xl transition-all shadow-md">
                  <Plus size={20} />
                </button>
              </div>
            </div>

            <div className="bg-panel border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="p-4 pl-6">Full Name</th>
                      <th className="p-4">Email</th>
                      <th className="p-4">Role Profile</th>
                      <th className="p-4">Access Status</th>
                      <th className="p-4 text-right pr-6">Manage Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {users.map((item) => (
                      <tr key={item.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6 font-semibold text-white">{item.name}</td>
                        <td className="p-4 text-gray-400">{item.email}</td>
                        <td className="p-4 text-gray-300 font-medium">{item.role}</td>
                        <td className="p-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                            item.status === 'ACTIVE' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : item.status === 'PENDING'
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6 space-x-1">
                          <select 
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                            className="bg-black/40 border border-white/10 text-xs rounded-lg py-1 px-2 text-white focus:outline-none focus:border-accent-primary"
                          >
                            <option value="ACTIVE" className="bg-surface">ACTIVATE</option>
                            <option value="PENDING" className="bg-surface">PENDING</option>
                            <option value="SUSPENDED" className="bg-surface">SUSPEND</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: SYSTEM AUDIT LOGS */}
        {activeView === 'audits' && (
          <motion.div
            key="audits"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Security Audit Trail</h2>
              <p className="text-gray-400 mt-1">Immutable trace records of high-privilege operations.</p>
            </div>

            <div className="bg-panel border border-white/5 rounded-3xl p-6 shadow-xl space-y-6">
              <AuditItem user="Dr. Sarah Connor" role="Faculty" action="Marked attendance for Subject DBMS (CS302)" time="10 mins ago" ip="192.168.1.104" />
              <AuditItem user="Akshad Mishra" role="Student" action="Uploaded resume 'Akshad_Mishra_Resume.pdf'" time="1 hour ago" ip="192.168.1.112" />
              <AuditItem user="Admin" role="Administrator" action="Modified AI System Prompt version to v4 (Draft)" time="2 hours ago" ip="10.0.0.1" alert />
              <AuditItem user="Alice Green" role="Counsellor" action="Added Lead 'Alice Green' (Computer Science interest)" time="1 day ago" ip="192.168.1.109" />
              <AuditItem user="System Gateway" role="System Core" action="Triggered attendance drop alert (Student ID: #a823)" time="2 days ago" ip="127.0.0.1" alert />
            </div>
          </motion.div>
        )}

      </AnimatePresence>
      )}
    </div>
  );
}

/* Helper Cards Components */
function MetricCard({ title, value, change, icon, trend }: { 
  title: string, value: string, change: string, icon: React.ReactNode, trend: 'up' | 'down' | 'neutral' 
}) {
  return (
    <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg flex flex-col justify-between">
      <div className="flex justify-between items-start">
        <span className="text-sm font-medium text-gray-400">{title}</span>
        <div className="p-2.5 bg-white/5 rounded-xl text-gray-300">
          {icon}
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
        <p className={`text-xs font-semibold mt-1.5 ${
          trend === 'up' ? 'text-green-400' : trend === 'down' ? 'text-red-400' : 'text-gray-400'
        }`}>
          {change}
        </p>
      </div>
    </div>
  );
}

function SecurityRule({ label, details, active = false }: { label: string, details: string, active?: boolean }) {
  const activeBorder = active ? 'border-green-500/20' : 'border-white/5';
  return (
    <div className={`flex items-start space-x-4 p-4 bg-surface rounded-2xl border ${activeBorder}`}>
      <div className="p-2 bg-green-500/10 text-green-400 rounded-lg shrink-0 mt-0.5">
        <ShieldCheck size={18} />
      </div>
      <div>
        <h4 className="font-bold text-white text-sm">{label}</h4>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{details}</p>
      </div>
    </div>
  );
}

function AuditItem({ user, role, action, time, ip, alert = false }: {
  user: string, role: string, action: string, time: string, ip: string, alert?: boolean
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-surface border border-white/5 rounded-2xl gap-3">
      <div className="flex items-start space-x-3">
        <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
          alert ? 'bg-orange-500/15 text-accent-primary' : 'bg-white/5 text-gray-400'
        }`}>
          <Database size={16} />
        </div>
        <div>
          <p className="text-sm text-gray-200">
            <span className="font-bold text-white">{user}</span> ({role}) &mdash; <span className="text-gray-300">{action}</span>
          </p>
          <span className="text-xs text-gray-500 block mt-1">IP Node Address: {ip}</span>
        </div>
      </div>
      
      <span className="text-xs font-semibold text-gray-400 shrink-0">{time}</span>
    </div>
  );
}