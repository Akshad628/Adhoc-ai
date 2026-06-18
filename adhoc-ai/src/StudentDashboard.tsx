import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Clock, CheckCircle, Bot, Send, Mic, X, Activity, 
  FileText, Briefcase, Award, Upload, Trash
} from 'lucide-react';
import { SkeletonCard, SkeletonCircular, SkeletonTable } from './components/Skeleton';

export default function StudentDashboard() {
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'home';
  const [isViewLoading, setIsViewLoading] = useState(false);

  useEffect(() => {
    setIsViewLoading(true);
    const timer = setTimeout(() => setIsViewLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeView]);

  // AI Chat Local States
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Hello Akshad. I am AI Havoc. I noticed you have a Computer Networks assignment due soon. Would you like me to pull up your recent lecture notes or help you review the core concepts?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  // Document Upload Local Mock State
  const [documents, setDocuments] = useState([
    { id: '1', title: 'GCET_Identity_Card.pdf', size: '1.2 MB', date: '2026-02-10' },
    { id: '2', title: 'Semester_4_Transcript.pdf', size: '2.4 MB', date: '2026-05-18' },
    { id: '3', title: 'Fees_Receipt_Sem5.pdf', size: '840 KB', date: '2026-06-01' },
  ]);

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    // Simulated quick reply
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        { sender: 'ai', text: `Thanks for asking. Regarding "${userMsg}", I am searching our GCET database... In a real setup, I will query the Groq LLM and pgvector RAG context to stream a precise answer.` }
      ]);
    }, 1000);
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc = {
      id: Math.random().toString(),
      title: 'Uploaded_Document_' + Math.floor(Math.random() * 100) + '.pdf',
      size: '1.5 MB',
      date: new Date().toISOString().split('T')[0],
    };
    setDocuments((prev) => [...prev, newDoc]);
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter(doc => doc.id !== id));
  };

  return (
    <div className="pb-24">
      {isViewLoading ? (
        <div className="space-y-6">
          {activeView === 'home' ? (
            <>
              <div className="h-8 bg-white/5 rounded w-1/3 mb-8 animate-pulse"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <SkeletonCircular />
                <div className="lg:col-span-2">
                  <SkeletonCard rows={2} />
                </div>
              </div>
            </>
          ) : activeView === 'documents' || activeView === 'placements' || activeView === 'courses' ? (
            <SkeletonTable rows={4} />
          ) : (
            <SkeletonCard rows={3} />
          )}
        </div>
      ) : (
        <AnimatePresence mode="wait">
        
        {/* VIEW: HOME DASHBOARD */}
        {activeView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* Welcome Banner */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Good Afternoon, Akshad.</h2>
              <p className="text-gray-400 mt-1">Here is what you need to focus on today.</p>
            </div>

            {/* AI Daily Summary */}
            <div className="bg-gradient-to-r from-accent-primary/10 to-transparent border border-accent-primary/20 rounded-2xl p-6 mb-8 flex items-start space-x-4 backdrop-blur-sm">
              <div className="p-3 bg-accent-primary/20 rounded-xl shrink-0">
                <Sparkles className="text-accent-primary" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-accent-primary mb-1">AI Daily Brief</h3>
                <p className="text-gray-300 leading-relaxed text-sm">
                  You have one assignment due tomorrow for <span className="text-white font-medium">Computer Networks</span>. Your attendance is currently at <span className="text-white font-medium">82%</span>, and two companies have opened applications that match your frontend development profile.
                </p>
              </div>
            </div>

            {/* Widgets Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Attendance Widget */}
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors flex flex-col justify-between">
                <h3 className="text-gray-400 font-medium mb-6">Overall Attendance</h3>
                <div className="flex items-center justify-center py-4">
                  <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-white/5">
                    <div className="absolute inset-0 rounded-full border-8 border-accent-primary" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 80%)' }}></div>
                    <span className="text-3xl font-bold">82%</span>
                  </div>
                </div>
                <p className="text-center text-sm text-green-400 mt-6 font-medium">Above 75% threshold</p>
              </div>

              {/* Assignments Widget */}
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-gray-400 font-medium">Pending Tasks</h3>
                  <span className="text-xs bg-accent-primary/20 text-accent-primary px-3 py-1 rounded-full font-semibold">3 Pending</span>
                </div>
                <div className="space-y-4">
                  <TaskCard title="Implement Three.js Scene" course="Computer Graphics" time="Due Tomorrow, 11:59 PM" urgent />
                  <TaskCard title="Chapter 4 Reading Quiz" course="Database Management" time="Due Friday, 10:00 AM" />
                  <TaskCard title="Submit Resume for ATS Pre-scan" course="Placement Prep" time="Due in 3 days" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: AI HAVOC CHAT */}
        {activeView === 'havoc' && (
          <motion.div
            key="havoc"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="flex flex-col max-w-4xl mx-auto h-[calc(100vh-160px)] relative"
          >
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-6 pb-24 pr-2 custom-scrollbar">
              <div className="text-center pt-4 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full mx-auto mb-4 flex items-center justify-center shadow-[0_0_30px_rgba(255,122,24,0.4)]">
                  <Bot size={32} className="text-white" />
                </div>
                <h2 className="text-2xl font-bold">AI Havoc Portal</h2>
                <p className="text-gray-400 mt-1 text-sm">Your personal institutional intelligence layer.</p>
              </div>

              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex items-start space-x-4 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'ai' ? 'bg-accent-primary/20 text-accent-primary' : 'bg-white/10 text-white'}`}>
                    {msg.sender === 'ai' ? <Bot size={16} /> : <span className="text-xs font-bold">AM</span>}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm shadow-lg max-w-[80%] ${
                    msg.sender === 'ai' 
                      ? 'bg-panel border border-white/5 rounded-tl-sm text-gray-200' 
                      : 'bg-accent-primary text-white rounded-tr-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChatMessage} className="absolute bottom-0 left-0 right-0 py-4 bg-background">
              <div className="bg-panel border border-white/10 rounded-full p-2 flex items-center shadow-2xl backdrop-blur-xl">
                <input
                  type="text"
                  placeholder="Ask AI Havoc anything about your courses, fees, or placements..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-white placeholder-gray-500"
                />
                <button 
                  type="button" 
                  onClick={() => setIsVoiceActive(true)}
                  className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors mr-1 shrink-0"
                >
                  <Mic size={18} />
                </button>
                <button type="submit" className="w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform shrink-0">
                  <Send size={16} className="text-white" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* VIEW: COURSES & ACADEMICS */}
        {activeView === 'courses' && (
          <motion.div
            key="courses"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Enrolled Courses</h2>
              <p className="text-gray-400 mt-1">Here are your active academic programs for Semester 5.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CourseCard title="Computer Networks" code="CS301" credits={4} faculty="Dr. Sarah Connor" progress={85} attendance={88} />
              <CourseCard title="Database Management Systems" code="CS302" credits={4} faculty="Dr. Sarah Connor" progress={78} attendance={80} />
              <CourseCard title="Computer Graphics" code="CS303" credits={3} faculty="Dr. Marcus Aurelius" progress={60} attendance={72} lowAttendance />
              <CourseCard title="Software Engineering" code="CS304" credits={3} faculty="Dr. Alan Turing" progress={92} attendance={90} />
            </div>
          </motion.div>
        )}

        {/* VIEW: DOCUMENTS HUB */}
        {activeView === 'documents' && (
          <motion.div
            key="documents"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Academic Documents</h2>
                <p className="text-gray-400 mt-1">Upload and manage identity proofs, marks sheets, and fees invoices.</p>
              </div>
              <button 
                onClick={handleFileUpload}
                className="bg-accent-primary hover:bg-orange-500 text-white font-medium py-2.5 px-6 rounded-xl flex items-center space-x-2 shadow-lg hover:shadow-orange-500/20 transition-all text-sm shrink-0"
              >
                <Upload size={16} />
                <span>Upload Document</span>
              </button>
            </div>

            <div className="bg-panel border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="p-4 pl-6">Document Title</th>
                      <th className="p-4">Upload Date</th>
                      <th className="p-4">File Size</th>
                      <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6 font-medium text-white flex items-center space-x-3">
                          <FileText size={18} className="text-accent-secondary" />
                          <span>{doc.title}</span>
                        </td>
                        <td className="p-4 text-gray-400">{doc.date}</td>
                        <td className="p-4 text-gray-400">{doc.size}</td>
                        <td className="p-4 text-right pr-6">
                          <button 
                            onClick={() => deleteDocument(doc.id)}
                            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: PLACEMENTS PORTAL */}
        {activeView === 'placements' && (
          <motion.div
            key="placements"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Placement Drives & Prep</h2>
              <p className="text-gray-400 mt-1">Review active drives and placement eligibility scores.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-panel border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-lg">
                <div>
                  <h4 className="text-gray-400 text-sm font-medium">ATS Resume Score</h4>
                  <p className="text-3xl font-bold mt-2">78.5%</p>
                </div>
                <div className="p-4 bg-green-500/15 text-green-400 rounded-2xl">
                  <Award size={24} />
                </div>
              </div>
              <div className="bg-panel border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-lg">
                <div>
                  <h4 className="text-gray-400 text-sm font-medium">Training Readiness</h4>
                  <p className="text-3xl font-bold mt-2">Ready</p>
                </div>
                <div className="p-4 bg-blue-500/15 text-blue-400 rounded-2xl">
                  <CheckCircle size={24} />
                </div>
              </div>
              <div className="bg-panel border border-white/5 rounded-3xl p-6 flex items-center justify-between shadow-lg">
                <div>
                  <h4 className="text-gray-400 text-sm font-medium">Applied Companies</h4>
                  <p className="text-3xl font-bold mt-2">4</p>
                </div>
                <div className="p-4 bg-purple-500/15 text-purple-400 rounded-2xl">
                  <Briefcase size={24} />
                </div>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-4">Upcoming Drives</h3>
            <div className="space-y-4">
              <DriveItem company="Microsoft" role="Software Engineer Intern" date="July 10, 2026" cgpaReq={8.0} status="Registered" />
              <DriveItem company="Accenture" role="Associate Application Developer" date="July 18, 2026" cgpaReq={6.5} status="Open for Registration" canRegister />
              <DriveItem company="Google" role="Developer Relations Intern" date="Aug 02, 2026" cgpaReq={8.5} status="Ineligible" ineligible />
            </div>
          </motion.div>
        )}

      </AnimatePresence>
      )}

      {/* FLOATING VOICE ASSISTANT BUTTON */}
      <button
        onClick={() => setIsVoiceActive(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-accent-primary rounded-full shadow-[0_0_30px_rgba(255,122,24,0.3)] flex items-center justify-center hover:scale-110 transition-transform z-20"
      >
        <Mic size={24} className="text-white" />
      </button>

      {/* VOICE ASSISTANT OVERLAY MODAL */}
      <AnimatePresence>
        {isVoiceActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xl"
          >
            <button
              onClick={() => setIsVoiceActive(false)}
              className="absolute top-8 right-8 text-gray-400 hover:text-white transition-colors bg-white/5 p-3 rounded-full"
            >
              <X size={24} />
            </button>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-md bg-panel border border-white/10 rounded-3xl p-8 flex flex-col items-center relative overflow-hidden shadow-[0_0_100px_rgba(255,122,24,0.15)]"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-primary/20 blur-[80px] rounded-full"></div>

              <h3 className="text-xl font-medium mb-1 z-10">AI Havoc Voice</h3>
              <p className="text-accent-primary text-sm font-medium mb-12 z-10 flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
                <span>Listening...</span>
              </p>

              <div className="relative z-10 w-32 h-32 flex items-center justify-center mb-12">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full border-2 border-accent-primary/50"
                ></motion.div>
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.2, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                  className="absolute inset-4 rounded-full border-2 border-accent-secondary/50"
                ></motion.div>
                <div className="w-16 h-16 bg-gradient-to-br from-accent-primary to-orange-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,122,24,0.5)]">
                  <Activity size={24} className="text-white" />
                </div>
              </div>

              <div className="z-10 w-full bg-black/20 rounded-2xl p-4 border border-white/5 text-center min-h-[100px] flex items-center justify-center">
                <p className="text-gray-300 text-lg leading-relaxed font-light italic">
                  "Hey Havoc, can you tell me what my current attendance is for Computer Graphics?"
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* Helper Cards Components */
function TaskCard({ title, course, time, urgent = false }: { title: string, course: string, time: string, urgent?: boolean }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 hover:bg-white/10 transition-all group">
      <div className="flex items-center space-x-4">
        <div className={`p-2 rounded-lg shrink-0 ${urgent ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-white/5 text-gray-400'}`}>
          {urgent ? <Clock size={20} /> : <CheckCircle size={20} />}
        </div>
        <div>
          <h4 className="font-medium text-white group-hover:text-accent-primary transition-colors text-sm md:text-base">{title}</h4>
          <p className="text-xs text-gray-500 mt-1">{course}</p>
        </div>
      </div>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full shrink-0 ${urgent ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/5 text-gray-400 border border-white/5'}`}>
        {time}
      </span>
    </div>
  );
}

function CourseCard({ title, code, credits, faculty, progress, attendance, lowAttendance = false }: { 
  title: string, code: string, credits: number, faculty: string, progress: number, attendance: number, lowAttendance?: boolean 
}) {
  return (
    <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className="text-xs font-semibold bg-white/5 text-gray-400 px-2.5 py-1 rounded-md border border-white/5 uppercase">{code}</span>
            <h3 className="text-xl font-bold mt-2 text-white">{title}</h3>
          </div>
          <span className="text-xs font-medium text-accent-secondary bg-accent-secondary/10 px-2 py-0.5 rounded border border-accent-secondary/15">{credits} Credits</span>
        </div>
        <p className="text-sm text-gray-400 mb-6">Instructor: {faculty}</p>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Syllabus Completed</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div className="h-full bg-accent-secondary rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Subject Attendance</span>
            <span className={lowAttendance ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>{attendance}%</span>
          </div>
          <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${lowAttendance ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${attendance}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DriveItem({ company, role, date, cgpaReq, status, canRegister = false, ineligible = false }: {
  company: string, role: string, date: string, cgpaReq: number, status: string, canRegister?: boolean, ineligible?: boolean
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl bg-panel border border-white/5 hover:border-white/10 transition-all gap-4 shadow-md">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-white/5 rounded-xl text-gray-400 shrink-0 font-bold text-sm">
          {company.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h4 className="font-bold text-white text-base">{company}</h4>
          <p className="text-sm text-gray-400 mt-0.5">{role}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
            <span>Drive Date: {date}</span>
            <span>Min. CGPA: {cgpaReq}</span>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-end">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          ineligible 
            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
            : canRegister 
            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
            : 'bg-green-500/10 text-green-400 border border-green-500/20'
        }`}>
          {status}
        </span>
        
        {canRegister && (
          <button className="bg-accent-primary hover:bg-orange-500 text-white font-medium py-1.5 px-4 rounded-lg text-xs shadow-md transition-all">
            Apply Now
          </button>
        )}
      </div>
    </div>
  );
}