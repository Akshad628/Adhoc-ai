import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Bot, BookOpen, Briefcase, Settings, Bell, Search, Mic, Sparkles, Clock, FileText, CheckCircle, Send, X, Activity } from 'lucide-react';

export default function Dashboard() {
    const [activeView, setActiveView] = useState<'home' | 'havoc'>('home');
    const [isVoiceActive, setIsVoiceActive] = useState(false);

    return (
        <div className="min-h-screen flex bg-background text-white font-sans overflow-hidden">

            {/* SIDEBAR NAVIGATION */}
            <nav className="w-[280px] bg-surface border-r border-white/5 fixed h-full flex flex-col z-20">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                        ADhoc.ai
                    </h1>
                </div>

                <div className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
                    <NavItem icon={<Home size={20} />} label="Dashboard" active={activeView === 'home'} onClick={() => setActiveView('home')} />
                    <NavItem icon={<Bot size={20} />} label="AI Havoc" active={activeView === 'havoc'} onClick={() => setActiveView('havoc')} />
                    <NavItem icon={<BookOpen size={20} />} label="Courses & Academics" />
                    <NavItem icon={<FileText size={20} />} label="Documents" />
                    <NavItem icon={<Briefcase size={20} />} label="Placements" />
                </div>

                <div className="p-4 border-t border-white/5">
                    <NavItem icon={<Settings size={20} />} label="Settings" />
                </div>
            </nav>

            {/* MAIN WORKSPACE */}
            <div className="ml-[280px] flex-1 flex flex-col relative h-screen">

                {/* TOP NAVIGATION BAR */}
                <header className="h-[72px] shrink-0 sticky top-0 z-10 bg-glass backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8">
                    <div className="flex items-center bg-white/5 rounded-full px-4 py-2 w-96 border border-white/10 transition-colors focus-within:border-accent-primary/50">
                        <Search size={18} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search courses, documents, or hit Ctrl+K..."
                            className="bg-transparent border-none outline-none text-sm ml-3 w-full text-white placeholder-gray-500"
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <button className="text-gray-400 hover:text-white transition-colors relative">
                            <Bell size={20} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-accent-primary rounded-full shadow-[0_0_10px_rgba(255,122,24,0.8)]"></span>
                        </button>
                        <div className="flex items-center space-x-3 cursor-pointer">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-medium">Akshad Mishra</p>
                                <p className="text-xs text-gray-400">B.Tech CSE - 3rd Year</p>
                            </div>
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-primary to-orange-800 border border-white/10 flex items-center justify-center font-bold">
                                AM
                            </div>
                        </div>
                    </div>
                </header>

                {/* DYNAMIC CONTENT AREA */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    <AnimatePresence mode="wait">

                        {/* VIEW: HOME DASHBOARD */}
                        {activeView === 'home' && (
                            <motion.div
                                key="home"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="pb-24"
                            >
                                {/* Welcome Banner */}
                                <div className="mb-8">
                                    <h2 className="text-3xl font-semibold tracking-tight">Good Afternoon, Akshad.</h2>
                                    <p className="text-gray-400 mt-1">Here is what you need to focus on today.</p>
                                </div>

                                {/* AI Daily Summary */}
                                <div className="bg-gradient-to-r from-accent-primary/10 to-transparent border border-accent-primary/20 rounded-2xl p-6 mb-8 flex items-start space-x-4 backdrop-blur-sm">
                                    <div className="p-3 bg-accent-primary/20 rounded-xl">
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Attendance Widget */}
                                    <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors">
                                        <h3 className="text-gray-400 font-medium mb-6">Overall Attendance</h3>
                                        <div className="flex items-center justify-center">
                                            <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-white/5">
                                                <div className="absolute inset-0 rounded-full border-8 border-accent-primary" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 80%)' }}></div>
                                                <span className="text-3xl font-bold">82%</span>
                                            </div>
                                        </div>
                                        <p className="text-center text-sm text-green-400 mt-6">Above 75% threshold</p>
                                    </div>

                                    {/* Assignments Widget */}
                                    <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors md:col-span-2">
                                        <div className="flex justify-between items-center mb-6">
                                            <h3 className="text-gray-400 font-medium">Pending Tasks</h3>
                                            <a href="#" className="text-sm text-accent-primary hover:underline">View All</a>
                                        </div>
                                        <div className="space-y-4">
                                            <TaskCard title="Implement Three.js Scene" course="Computer Graphics" time="Due Tomorrow, 11:59 PM" urgent />
                                            <TaskCard title="Chapter 4 Reading Quiz" course="Database Management" time="Due Friday, 10:00 AM" />
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
                                className="h-full flex flex-col max-w-4xl mx-auto"
                            >
                                <div className="flex-1 overflow-y-auto space-y-6 pb-32">
                                    <div className="flex items-center justify-center pt-8 pb-12">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full mx-auto mb-4 flex items-center justify-center shadow-[0_0_30px_rgba(255,122,24,0.4)]">
                                                <Bot size={32} className="text-white" />
                                            </div>
                                            <h2 className="text-2xl font-bold">AI Havoc</h2>
                                            <p className="text-gray-400 mt-2">Your personal institutional intelligence layer.</p>
                                        </div>
                                    </div>

                                    {/* Sample Chat Bubbles */}
                                    <div className="flex items-start space-x-4">
                                        <div className="w-8 h-8 rounded-full bg-accent-primary/20 flex items-center justify-center shrink-0">
                                            <Bot size={16} className="text-accent-primary" />
                                        </div>
                                        <div className="bg-panel border border-white/5 p-4 rounded-2xl rounded-tl-sm text-sm text-gray-200 shadow-lg">
                                            Hello Akshad. I am AI Havoc. I noticed you have a Computer Networks assignment due soon. Would you like me to pull up your recent lecture notes or help you review the core concepts?
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-4 flex-row-reverse space-x-reverse">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                            <span className="text-xs font-bold">AM</span>
                                        </div>
                                        <div className="bg-accent-primary p-4 rounded-2xl rounded-tr-sm text-sm text-white shadow-lg">
                                            Yes please, summarize the OSI model layers for me.
                                        </div>
                                    </div>
                                </div>

                                {/* Chat Input Bar */}
                                <div className="absolute bottom-8 left-0 w-full px-8 flex justify-center">
                                    <div className="w-full max-w-4xl bg-panel border border-white/10 rounded-full p-2 flex items-center shadow-2xl backdrop-blur-xl">
                                        <input
                                            type="text"
                                            placeholder="Ask AI Havoc anything about your courses, fees, or placements..."
                                            className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-white placeholder-gray-500"
                                        />
                                        <button className="w-10 h-10 bg-accent-primary rounded-full flex items-center justify-center hover:scale-105 transition-transform shrink-0">
                                            <Send size={16} className="text-white" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

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
                                {/* Glowing Background effect */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-primary/20 blur-[80px] rounded-full"></div>

                                <h3 className="text-xl font-medium mb-1 z-10">AI Havoc Voice</h3>
                                <p className="text-accent-primary text-sm font-medium mb-12 z-10 flex items-center space-x-2">
                                    <span className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"></span>
                                    <span>Listening...</span>
                                </p>

                                {/* Simulated Audio Visualizer */}
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

                                {/* Live Transcript Display */}
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
        </div>
    );
}

/* Helper Components */
function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-accent-primary/10 text-accent-primary' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
        >
            {icon}
            <span className="font-medium text-sm">{label}</span>
        </button>
    );
}

function TaskCard({ title, course, time, urgent = false }: { title: string, course: string, time: string, urgent?: boolean }) {
    return (
        <div className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-white/5 hover:bg-white/5 transition-colors group">
            <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg ${urgent ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-400'}`}>
                    {urgent ? <Clock size={20} /> : <CheckCircle size={20} />}
                </div>
                <div>
                    <h4 className="font-medium text-white group-hover:text-accent-primary transition-colors">{title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{course}</p>
                </div>
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${urgent ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/5 text-gray-400 border border-white/5'}`}>
                {time}
            </span>
        </div>
    );
}