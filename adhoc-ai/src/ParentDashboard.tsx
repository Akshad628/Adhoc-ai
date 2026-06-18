import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, AlertCircle, Download
} from 'lucide-react';
import { SkeletonCard, SkeletonTable } from './components/Skeleton';

export default function ParentDashboard() {
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'home';
  const [isViewLoading, setIsViewLoading] = useState(false);

  useEffect(() => {
    setIsViewLoading(true);
    const timer = setTimeout(() => setIsViewLoading(false), 300);
    return () => clearTimeout(timer);
  }, [activeView]);

  // Fee Invoices Local State
  const [invoices, setInvoices] = useState([
    { id: '1', term: 'Semester 5 Tuition Fee', amount: '85,000', status: 'PAID', due: '2026-06-05', reference: 'GCET-TXN-12903' },
    { id: '2', term: 'Library & Labs Annual Fee', amount: '15,000', status: 'PAID', due: '2026-06-05', reference: 'GCET-TXN-12904' },
    { id: '3', term: 'Semester 5 Examination Fee', amount: '2,500', status: 'UNPAID', due: '2026-07-20', reference: 'Pending' },
  ]);

  const handlePayFee = (invoiceId: string) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId 
        ? { ...inv, status: 'PAID', reference: 'GCET-TXN-' + Math.floor(Math.random() * 50000 + 10000) } 
        : inv
    ));
    alert('Payment successful! Invoice receipt sent to your email.');
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
              <h2 className="text-3xl font-bold tracking-tight">Guardianship Dashboard</h2>
              <p className="text-gray-400 mt-1">Review academic summary and fee logs for your ward, <span className="text-white font-semibold">Akshad Mishra</span>.</p>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium">Child Attendance</h3>
                <p className="text-3xl font-bold mt-2 text-white">82%</p>
                <p className="text-xs text-green-400 font-semibold mt-1">Status: Safe & Present</p>
              </div>
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium">Current Grade Average</h3>
                <p className="text-3xl font-bold mt-2 text-white">8.4 CGPA</p>
                <p className="text-xs text-gray-500 mt-1">Semester 4 Final result</p>
              </div>
              <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg">
                <h3 className="text-gray-400 text-sm font-medium">Outstanding Fees</h3>
                <p className="text-3xl font-bold mt-2 text-white">₹2,500</p>
                <p className="text-xs text-yellow-400 font-semibold mt-1">Exam fees due soon</p>
              </div>
            </div>

            {/* Advisory / Institutional notices */}
            <h3 className="text-xl font-bold mb-4">Advisory Board Notes</h3>
            <div className="bg-panel border border-white/5 rounded-3xl p-6 hover:border-white/10 transition-colors shadow-lg space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-surface border border-white/5 rounded-2xl">
                <div className="p-2 bg-accent-primary/10 text-accent-primary rounded-lg shrink-0 mt-0.5 animate-pulse">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Attendance Threshold Evaluator</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Akshad's B.Tech Computer Graphics attendance is currently at 72%, which is below the mandatory 75% requirement. Please advise your ward to attend upcoming sessions to prevent exam eligibility block.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-surface border border-white/5 rounded-2xl">
                <div className="p-2 bg-green-500/10 text-green-400 rounded-lg shrink-0 mt-0.5">
                  <CheckCircle size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Placement Selection Notification</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    We are pleased to inform you that Akshad has successfully registered for campus recruitment drives with Microsoft and Accenture starting July 2026.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: GRADES */}
        {activeView === 'grades' && (
          <motion.div
            key="grades"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Akshad's Academic Record</h2>
              <p className="text-gray-400 mt-1">Grades breakdown for current and previous semesters.</p>
            </div>

            <div className="bg-panel border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="p-4 pl-6">Course Code</th>
                      <th className="p-4">Subject Title</th>
                      <th className="p-4">Semester</th>
                      <th className="p-4">Grade Point</th>
                      <th className="p-4 text-right pr-6">Status Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    <GradeRow code="CS301" name="Computer Networks" term="Sem 5 (Ongoing)" grade="A" status="PASSING" />
                    <GradeRow code="CS302" name="Database Management Systems" term="Sem 5 (Ongoing)" grade="A+" status="PASSING" />
                    <GradeRow code="CS303" name="Computer Graphics" term="Sem 5 (Ongoing)" grade="B" status="MARGINAL" warning />
                    <GradeRow code="CS201" name="Data Structures & Algorithms" term="Sem 4 (Completed)" grade="O (Outstanding)" status="PASSED" />
                    <GradeRow code="CS202" name="Discrete Mathematics" term="Sem 4 (Completed)" grade="A" status="PASSED" />
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW: FEES */}
        {activeView === 'fees' && (
          <motion.div
            key="fees"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">Fees Ledger & Invoices</h2>
              <p className="text-gray-400 mt-1">Settle outstanding fee payments and download transactional receipts.</p>
            </div>

            <div className="bg-panel border border-white/5 rounded-3xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-black/20 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                      <th className="p-4 pl-6">Invoice details</th>
                      <th className="p-4">Due Date</th>
                      <th className="p-4">Total Due</th>
                      <th className="p-4">Payment Reference</th>
                      <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm">
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 pl-6">
                          <p className="font-semibold text-white">{inv.term}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full inline-block mt-1 ${
                            inv.status === 'PAID' 
                              ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                              : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                          }`}>
                            {inv.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">{inv.due}</td>
                        <td className="p-4 text-white font-medium">₹{inv.amount}</td>
                        <td className="p-4 text-gray-400 font-mono">{inv.reference}</td>
                        <td className="p-4 text-right pr-6">
                          {inv.status === 'UNPAID' ? (
                            <button
                              type="button"
                              onClick={() => handlePayFee(inv.id)}
                              className="bg-accent-primary hover:bg-orange-500 text-white font-bold text-xs py-1.5 px-4 rounded-lg shadow-md transition-all"
                            >
                              Settle Invoice
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => alert('Downloading official receipt PDF from GCET S3 instance...')}
                              className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors inline-flex items-center space-x-1"
                            >
                              <Download size={14} />
                            </button>
                          )}
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

/* Helper Components */
function GradeRow({ code, name, term, grade, status, warning = false }: {
  code: string, name: string, term: string, grade: string, status: string, warning?: boolean
}) {
  return (
    <tr className="hover:bg-white/5 transition-colors">
      <td className="p-4 pl-6 text-gray-400 font-mono text-xs">{code}</td>
      <td className="p-4 font-semibold text-white">{name}</td>
      <td className="p-4 text-gray-400">{term}</td>
      <td className="p-4 font-bold text-accent-secondary">{grade}</td>
      <td className="p-4 text-right pr-6">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
          warning 
            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
            : 'bg-green-500/10 text-green-400 border border-green-500/20'
        }`}>
          {status}
        </span>
      </td>
    </tr>
  );
}