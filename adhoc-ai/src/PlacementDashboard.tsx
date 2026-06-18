import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Plus, CheckCircle
} from 'lucide-react';
import { SkeletonCard, SkeletonTable } from './components/Skeleton';

export default function PlacementDashboard() {
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'home';
  const [isViewLoading, setIsViewLoading] = useState(false);

  useEffect(() => {
    setIsViewLoading(true);
    const timer = setTimeout(() => setIsViewLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeView]);

  // Drives Local State
  const [drives, setDrives] = useState([
    { id: '1', company: 'Microsoft', date: '2026-07-10', cgpaReq: 8.0, status: 'UPCOMING', deadline: '2026-07-01' },
    { id: '2', company: 'TCS', date: '2026-07-15', cgpaReq: 6.0, status: 'UPCOMING', deadline: '2026-07-05' },
    { id: '3', company: 'Google', date: '2026-08-02', cgpaReq: 8.5, status: 'UPCOMING', deadline: '2026-07-20' },
  ]);

  // Drive form state
  const [companyName, setCompanyName] = useState('');
  const [driveDate, setDriveDate] = useState('');
  const [eligibleCgpa, setEligibleCgpa] = useState('7.0');
  const [deadline, setDeadline] = useState('');

  // Resume screening state
  const [resumes, setResumes] = useState([
    { id: '1', name: 'Akshad Mishra', file: 'Akshad_Mishra_Resume.pdf', atsScore: 82, status: 'APPROVED' },
    { id: '2', name: 'Sarah Connor', file: 'Sarah_Connor_Resume.pdf', atsScore: 74, status: 'PENDING' },
    { id: '3', name: 'Alice Green', file: 'Alice_Green_CV.pdf', atsScore: 58, status: 'REJECTED' },
  ]);

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !driveDate || !deadline) return;

    const newDrive = {
      id: Math.random().toString(),
      company: companyName,
      date: driveDate,
      cgpaReq: parseFloat(eligibleCgpa),
      status: 'UPCOMING',
      deadline: deadline,
    };

    setDrives((prev) => [...prev, newDrive]);
    setCompanyName('');
    setDriveDate('');
    setDeadline('');
    alert(`Placement drive scheduled for ${newDrive.company} on ${newDrive.date}!`);
  };

  const handleResumeStatusChange = (id: string, newStatus: string) => {
    setResumes(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

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
              <h2 className="text-3xl font-bold tracking-tight">Campus Placement Management</h2>
              <p className="text-gray-400 mt-1">Review recruitment drives schedule and student readiness levels.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium">Recruitment Partners</h3>
                <p className="text-3xl font-bold mt-2 text-white">24</p>
                <p className="text-xs text-green-400 font-semibold mt-1">Active MNCs</p>
              </div>
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium">Scheduled Interviews</h3>
                <p className="text-3xl font-bold mt-2 text-white">42</p>
                <p className="text-xs text-purple-400 font-semibold mt-1">For Semester 5</p>
              </div>
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium">Avg Readiness Score</h3>
                <p className="text-3xl font-bold mt-2 text-white">85%</p>
                <p className="text-xs text-gray-500 mt-1">Based on mock drills</p>
              </div>
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium">Offers Released</h3>
                <p className="text-3xl font-bold mt-2 text-white">156</p>
                <p className="text-xs text-green-400 font-semibold mt-1">Total selections</p>
              </div>
            </div>

            {/* Recent drives visual brief */}
            <h3 className="text-xl font-bold mb-4">Preparation Dashboard</h3>
            <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-surface border border-white/5 rounded-2xl">
                <div className="p-2 bg-green-500/10 text-green-400 rounded-lg shrink-0 mt-0.5">
                  <CheckCircle size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">ATS Model Evaluator Healthy</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    The local LLaMA pre-screener model parsed 142 resumes this morning, assigning scores against mock job descriptions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: SCHEDULE DRIVES */}
        {activeView === 'drives' && (
          <motion.div
            key="drives"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Schedule Recruitment Drive</h2>
              <p className="text-gray-400 mt-1">Add new partner companies and drive details to the calendar.</p>
            </div>

            {/* Drive Creation Form */}
            <form onSubmit={handleCreateDrive} className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-panel border border-white/5 p-6 rounded-3xl shadow-lg mb-8">
              <input 
                type="text" 
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-accent-primary"
                required
              />
              <input 
                type="date"
                value={driveDate}
                onChange={(e) => setDriveDate(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-accent-primary"
                required
              />
              <input 
                type="number" 
                step="0.1"
                placeholder="Min CGPA Requirement"
                value={eligibleCgpa}
                onChange={(e) => setEligibleCgpa(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-accent-primary"
                required
              />
              <input 
                type="date"
                placeholder="Registration Deadline"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-accent-primary"
                required
              />
              <div className="md:col-span-4 flex justify-end">
                <button 
                  type="submit"
                  className="bg-accent-primary hover:bg-orange-500 text-white font-semibold rounded-xl text-sm py-2.5 px-8 shadow-md shadow-orange-500/10 transition-all flex items-center space-x-2"
                >
                  <Plus size={16} />
                  <span>Publish Placement Drive</span>
                </button>
              </div>
            </form>

            {/* Drive listing */}
            <div className="bg-panel border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="p-4 pl-6">Company Name</th>
                      <th className="p-4">Drive Date</th>
                      <th className="p-4">Eligible CGPA</th>
                      <th className="p-4">Deadline</th>
                      <th className="p-4 text-right pr-6">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {drives.map((d) => (
                      <tr key={d.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6 font-bold text-white">{d.company}</td>
                        <td className="p-4 text-gray-400">{d.date}</td>
                        <td className="p-4 text-accent-secondary font-medium">{d.cgpaReq}</td>
                        <td className="p-4 text-gray-400">{d.deadline}</td>
                        <td className="p-4 text-right pr-6">
                          <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-semibold">
                            {d.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: ATS RESUME REVIEWS */}
        {activeView === 'resumes' && (
          <motion.div
            key="resumes"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">ATS Resume Review</h2>
              <p className="text-gray-400 mt-1">Review student resumes pre-screened via our local LLaMA parsing framework.</p>
            </div>

            <div className="bg-panel border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="p-4 pl-6">Student</th>
                      <th className="p-4">Resume File</th>
                      <th className="p-4">LLaMA ATS Score</th>
                      <th className="p-4">Verification</th>
                      <th className="p-4 text-right pr-6">Verify Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {resumes.map((r) => (
                      <tr key={r.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6 font-semibold text-white">{r.name}</td>
                        <td className="p-4 text-gray-400 flex items-center space-x-1 mt-1.5 border-none">
                          <FileText size={16} className="text-accent-secondary" />
                          <span>{r.file}</span>
                        </td>
                        <td className="p-4 font-bold text-accent-primary">{r.atsScore}%</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            r.status === 'APPROVED' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                              : r.status === 'PENDING'
                              ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-6 space-x-1">
                          <select 
                            value={r.status}
                            onChange={(e) => handleResumeStatusChange(r.id, e.target.value)}
                            className="bg-black/40 border border-white/10 text-xs rounded-lg py-1 px-2 text-white focus:outline-none focus:border-accent-primary"
                          >
                            <option value="APPROVED" className="bg-surface">APPROVE</option>
                            <option value="PENDING" className="bg-surface">PENDING</option>
                            <option value="REJECTED" className="bg-surface">REJECT</option>
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

      </AnimatePresence>
      )}
    </div>
  );
}