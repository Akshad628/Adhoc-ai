import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Users, Save
} from 'lucide-react';
import { SkeletonCard, SkeletonTable } from './components/Skeleton';

export default function FacultyDashboard() {
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'home';
  const [isViewLoading, setIsViewLoading] = useState(false);

  useEffect(() => {
    setIsViewLoading(true);
    const timer = setTimeout(() => setIsViewLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeView]);

  // Attendance Module Local State
  const [selectedSubject, setSelectedSubject] = useState('DBMS');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [studentsAttendance, setStudentsAttendance] = useState([
    { id: '1', name: 'Akshad Mishra', roll: 'CS034', status: 'PRESENT' },
    { id: '2', name: 'Sarah Connor', roll: 'CS012', status: 'PRESENT' },
    { id: '3', name: 'Alice Green', roll: 'CS055', status: 'ABSENT' },
    { id: '4', name: 'Robert Jenkins', roll: 'CS089', status: 'PRESENT' },
    { id: '5', name: 'John Doe', roll: 'CS090', status: 'ABSENT' },
  ]);

  // Marks Manager Local State
  const [gradesData, setGradesData] = useState([
    { id: '1', name: 'Akshad Mishra', roll: 'CS034', quiz1: 18, mid: 45, assignment: 9 },
    { id: '2', name: 'Sarah Connor', roll: 'CS012', quiz1: 19, mid: 48, assignment: 10 },
    { id: '3', name: 'Alice Green', roll: 'CS055', quiz1: 15, mid: 32, assignment: 7 },
    { id: '4', name: 'Robert Jenkins', roll: 'CS089', quiz1: 17, mid: 42, assignment: 8 },
    { id: '5', name: 'John Doe', roll: 'CS090', quiz1: 14, mid: 30, assignment: 8 },
  ]);

  const toggleAttendance = (studentId: string) => {
    setStudentsAttendance(prev => prev.map(s => 
      s.id === studentId 
        ? { ...s, status: s.status === 'PRESENT' ? 'ABSENT' : 'PRESENT' } 
        : s
    ));
  };

  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const presents = studentsAttendance.filter(s => s.status === 'PRESENT').length;
    alert(`Attendance marked successfully for ${selectedSubject} on ${selectedDate}.\nPresent: ${presents}/${studentsAttendance.length}`);
  };

  const handleGradeChange = (studentId: string, field: 'quiz1' | 'mid' | 'assignment', value: number) => {
    setGradesData(prev => prev.map(g => 
      g.id === studentId 
        ? { ...g, [field]: value } 
        : g
    ));
  };

  const handleGradesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Grades published successfully to student portals!');
  };

  return (
    <div className="pb-24">
      {isViewLoading ? (
        <div className="space-y-6">
          {activeView === 'home' ? (
            <>
              <div className="h-8 bg-white/5 rounded w-1/3 mb-8 animate-pulse"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-32 bg-panel border border-white/5 rounded-3xl animate-pulse"></div>
                ))}
              </div>
              <SkeletonCard rows={3} />
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
              <h2 className="text-3xl font-bold tracking-tight">Good Morning, Dr. Sarah Connor.</h2>
              <p className="text-gray-400 mt-1">Here are your classes and grading tasks for today.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium">Active Courses</h3>
                <p className="text-3xl font-bold mt-2 text-white">3</p>
                <p className="text-xs text-gray-500 mt-1">B.Tech CSE - Semester 5</p>
              </div>
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium">Pending Grading</h3>
                <p className="text-3xl font-bold mt-2 text-white">32 Tasks</p>
                <p className="text-xs text-orange-400 font-semibold mt-1">Due soon: CS302 Lab Reports</p>
              </div>
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium">Avg. Attendance</h3>
                <p className="text-3xl font-bold mt-2 text-white">88%</p>
                <p className="text-xs text-green-400 font-semibold mt-1">Above GCET threshold</p>
              </div>
            </div>

            {/* Schedule section */}
            <h3 className="text-xl font-bold mb-4">Today's Class Schedule</h3>
            <div className="space-y-4">
              <ScheduleItem time="09:30 AM - 10:30 AM" subject="Database Management Systems (CS302)" room="LH-201" strength={64} />
              <ScheduleItem time="11:30 AM - 01:00 PM" subject="Computer Networks Lab (CS301)" room="NetLab-3" strength={32} />
              <ScheduleItem time="02:30 PM - 03:30 PM" subject="Computer Graphics (CS303)" room="LH-202" strength={58} />
            </div>
          </motion.div>
        )}

        {/* VIEW: MARK ATTENDANCE */}
        {activeView === 'attendance' && (
          <motion.div
            key="attendance"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Mark Student Attendance</h2>
              <p className="text-gray-400 mt-1">Select class, date, and toggle students presence logs.</p>
            </div>

            <form onSubmit={handleAttendanceSubmit} className="space-y-6">
              {/* Select subject and date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-panel p-6 border border-white/5 rounded-3xl shadow-md">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Select Course</label>
                  <select 
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-accent-primary"
                  >
                    <option value="DBMS" className="bg-surface">DBMS - CS302</option>
                    <option value="NETWORKS" className="bg-surface">Computer Networks - CS301</option>
                    <option value="GRAPHICS" className="bg-surface">Computer Graphics - CS303</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Session Date</label>
                  <input 
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-accent-primary" 
                  />
                </div>
              </div>

              {/* Students attendance sheet table */}
              <div className="bg-panel border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-black/20 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="p-4 pl-6">Roll Number</th>
                        <th className="p-4">Student Name</th>
                        <th className="p-4">Attendance Log Status</th>
                        <th className="p-4 text-right pr-6">Quick Toggle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {studentsAttendance.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 pl-6 text-gray-400 font-mono">{item.roll}</td>
                          <td className="p-4 font-semibold text-white">{item.name}</td>
                          <td className="p-4">
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                              item.status === 'PRESENT' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="p-4 text-right pr-6">
                            <button
                              type="button"
                              onClick={() => toggleAttendance(item.id)}
                              className={`py-1.5 px-4 rounded-lg text-xs font-bold transition-all ${
                                item.status === 'PRESENT'
                                  ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20'
                                  : 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20'
                              }`}
                            >
                              {item.status === 'PRESENT' ? 'Mark Absent' : 'Mark Present'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Submit attendance */}
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-accent-primary hover:bg-orange-500 text-white font-medium py-3 px-8 rounded-xl flex items-center space-x-2 shadow-lg shadow-orange-500/15 hover:shadow-orange-500/20 transition-all text-sm"
                >
                  <Save size={16} />
                  <span>Submit Attendance Log</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* VIEW: MARKS MANAGER */}
        {activeView === 'marks' && (
          <motion.div
            key="marks"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Grades & Marks Manager</h2>
              <p className="text-gray-400 mt-1">Manage assessment marks for Quiz-1, Midterms, and Assignments.</p>
            </div>

            <form onSubmit={handleGradesSubmit} className="space-y-6">
              <div className="bg-panel border border-white/5 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5 bg-black/20 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                        <th className="p-4 pl-6">Roll</th>
                        <th className="p-4">Student Name</th>
                        <th className="p-4">Quiz-1 (20)</th>
                        <th className="p-4">Midterm (50)</th>
                        <th className="p-4">Assignment (10)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-sm">
                      {gradesData.map((item) => (
                        <tr key={item.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 pl-6 text-gray-400 font-mono">{item.roll}</td>
                          <td className="p-4 font-semibold text-white">{item.name}</td>
                          <td className="p-4">
                            <input 
                              type="number" 
                              max={20}
                              value={item.quiz1}
                              onChange={(e) => handleGradeChange(item.id, 'quiz1', parseInt(e.target.value) || 0)}
                              className="w-16 bg-black/40 border border-white/10 rounded-lg p-1.5 text-center text-white focus:outline-none focus:border-accent-primary" 
                            />
                          </td>
                          <td className="p-4">
                            <input 
                              type="number" 
                              max={50}
                              value={item.mid}
                              onChange={(e) => handleGradeChange(item.id, 'mid', parseInt(e.target.value) || 0)}
                              className="w-20 bg-black/40 border border-white/10 rounded-lg p-1.5 text-center text-white focus:outline-none focus:border-accent-primary" 
                            />
                          </td>
                          <td className="p-4">
                            <input 
                              type="number" 
                              max={10}
                              value={item.assignment}
                              onChange={(e) => handleGradeChange(item.id, 'assignment', parseInt(e.target.value) || 0)}
                              className="w-16 bg-black/40 border border-white/10 rounded-lg p-1.5 text-center text-white focus:outline-none focus:border-accent-primary" 
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Submit Grades */}
              <div className="flex justify-end">
                <button 
                  type="submit"
                  className="bg-accent-primary hover:bg-orange-500 text-white font-medium py-3 px-8 rounded-xl flex items-center space-x-2 shadow-lg shadow-orange-500/15 hover:shadow-orange-500/20 transition-all text-sm"
                >
                  <Save size={16} />
                  <span>Publish Grades & Marks</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}

      </AnimatePresence>
      )}
    </div>
  );
}

/* Helper Components */
function ScheduleItem({ time, subject, room, strength }: {
  time: string, subject: string, room: string, strength: number
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-2xl bg-panel border border-white/5 hover:border-white/10 transition-colors gap-4">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-white/5 text-gray-400 rounded-xl shrink-0 mt-0.5">
          <Clock size={20} />
        </div>
        <div>
          <h4 className="font-bold text-white text-base">{subject}</h4>
          <p className="text-sm text-gray-400 mt-0.5">Location: <span className="text-white font-medium">{room}</span></p>
          <div className="flex items-center space-x-2 mt-2 text-xs text-gray-500">
            <Users size={12} />
            <span>Class Strength: {strength} Students</span>
          </div>
        </div>
      </div>
      
      <span className="text-sm font-semibold text-accent-secondary bg-accent-secondary/10 px-3.5 py-1.5 rounded-full border border-accent-secondary/15">
        {time}
      </span>
    </div>
  );
}