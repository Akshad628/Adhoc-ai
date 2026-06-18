import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white px-6 font-sans relative overflow-hidden">
      {/* Dynamic Background Blurs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent-primary/10 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-accent-secondary/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="text-center z-10 max-w-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl mx-auto flex items-center justify-center mb-8 shadow-2xl"
        >
          <AlertCircle size={40} className="text-accent-primary animate-pulse" />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-7xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent tracking-tighter mb-4"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-bold mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-gray-400 text-sm mb-8"
        >
          The resource you are looking for has been moved, deleted, or does not exist in this sector.
        </motion.p>

        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-accent-primary to-orange-600 hover:to-orange-500 text-white font-medium py-3 px-8 rounded-full shadow-[0_0_20px_rgba(255,122,24,0.2)] transition-all"
        >
          <ArrowLeft size={16} />
          <span>Back to Landing</span>
        </motion.button>
      </div>
    </div>
  );
}
