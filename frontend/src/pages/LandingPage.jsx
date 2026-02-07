import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Briefcase,
  ArrowRight,
  Box,
  Activity,
  ShieldCheck,
  Sun,
  Moon,
  ChevronRight,
  Database,
  BarChart3
} from 'lucide-react';

const LandingPage = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();

  const handleNavigation = (path, role) => {
    navigate(path, { state: { role } });
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white transition-colors duration-300 overflow-x-hidden relative">

      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[70vh] h-[70vh] rounded-full bg-indigo-500/20 dark:bg-indigo-600/10 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[60vh] h-[60vh] rounded-full bg-cyan-400/20 dark:bg-cyan-500/10 blur-[100px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[80vh] h-[80vh] rounded-full bg-blue-500/10 dark:bg-blue-600/5 blur-[100px]" />
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-indigo-600 to-cyan-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <Box className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
              StockMaster
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-amber-400" />
            ) : (
              <Moon className="w-5 h-5 text-slate-600" />
            )}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto mb-20"
          >


            <motion.h1
              variants={fadeIn}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight"
            >
              Inventory Management <br className="hidden md:block" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 dark:from-indigo-400 dark:via-cyan-400 dark:to-blue-400">
                Reimagined
              </span>
            </motion.h1>

            <motion.p
              variants={fadeIn}
              className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Experience seamless control over your supply chain.
              Real-time tracking, intelligent analytics, and distinct portals for staff and management.
            </motion.p>
          </motion.div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-32">
            {/* Staff Card */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl p-1 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-slate-50/50 dark:bg-slate-900/50 rounded-[22px] p-8 h-full flex flex-col">
                <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-bold mb-3">Staff Portal</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow">
                  Operational dashboard for inventory tracking, stock adjustments, and shipments.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => handleNavigation('/login', 'Staff')}
                    className="w-full py-3.5 px-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-semibold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 group/btn"
                  >
                    Staff Login
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleNavigation('/register', 'Staff')}
                    className="w-full py-3.5 px-6 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Manager Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="group relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-3xl p-1 border border-slate-200 dark:border-slate-700 hover:border-cyan-500/30 dark:hover:border-cyan-400/30 transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/10 dark:hover:shadow-cyan-900/20"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative bg-slate-50/50 dark:bg-slate-900/50 rounded-[22px] p-8 h-full flex flex-col">
                <div className="w-14 h-14 bg-cyan-100 dark:bg-cyan-900/50 rounded-2xl flex items-center justify-center mb-6 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-bold mb-3">Manager Portal</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow">
                  Administrative suite for reporting, user management, and high-level analytics.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={() => handleNavigation('/login', 'Manager')}
                    className="w-full py-3.5 px-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group/btn"
                  >
                    Manager Login
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => handleNavigation('/register', 'Manager')}
                    className="w-full py-3.5 px-6 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Register Organization
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-3 gap-8 px-4"
          >
            {[
              {
                icon: <Activity className="w-6 h-6 text-emerald-500" />,
                title: "Real-time Tracking",
                desc: "Monitor stock levels instantly across multiple locations with zero latency updates."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
                title: "Role-Based Security",
                desc: "Granular permission controls ensure data integrity between staff and management tiers."
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-orange-500" />,
                title: "Deep Analytics",
                desc: "Generate comprehensive reports on inventory turnover, valuation, and forecasting."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Box className="w-5 h-5 text-slate-400" />
            <span className="font-semibold text-slate-600 dark:text-slate-400">StockMaster</span>
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-500">
            © 2026 StockMaster Inc. All rights reserved.
          </div>

        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
