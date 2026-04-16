import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  MapPin,
  Wifi,
  Headphones,
  Camera,
  Sparkles,
  Shield,
  Brain,
  BarChart3,
  AlertCircle,
} from 'lucide-react';

export default function Home() {
  const [isSOSActive, setIsSOSActive] = useState(false);

  // Container animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 10,
      },
    },
  };

  const pulseVariants = {
    initial: { scale: 1, opacity: 0.8 },
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.8, 0.5, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
  };

  const sosButtonVariants = {
    inactive: { scale: 1 },
    active: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        type: 'spring',
      },
    },
  };

  const features = [
    {
      icon: Phone,
      label: 'One-Tap SOS',
      color: 'from-red-500 to-red-600',
    },
    {
      icon: Wifi,
      label: 'Offline Mode',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Headphones,
      label: 'Vehicle Services',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Sparkles,
      label: 'AI-Powered',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div 
      className="min-h-screen"
      style={{
        background: 'linear-gradient(135deg, hsl(220 20% 4%) 0%, hsl(220 25% 8%) 30%, hsl(15 70% 20%) 100%)',
      }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          style={{ background: 'hsl(0 85% 55%)' }}
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute -bottom-20 left-10 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          style={{ background: 'hsl(145 65% 42%)' }}
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* AI Badge */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 px-4 py-2 rounded-full border mb-8"
          style={{
            borderColor: 'hsl(0 85% 55% / 0.5)',
            backgroundColor: 'hsl(0 85% 55% / 0.1)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          <span className="text-sm font-medium flex items-center gap-1" style={{ color: 'hsl(0 85% 55%)' }}>
            <Shield className="w-4 h-4" />
            AI-Powered Emergency Response
          </span>
        </motion.div>

        {/* Main Title */}
        <motion.h1 variants={itemVariants} className="text-center mb-6">
          <span className="block text-5xl sm:text-6xl lg:text-7xl font-bold text-white">
            Road
            <span className="text-red-500">SoS</span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-center text-gray-400 text-lg sm:text-xl max-w-2xl mb-12"
        >
          Intelligent accident detection, instant severity analysis, and real-time
          connection to emergency services. Every second counts.
        </motion.p>

        {/* Feature Pills */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-16"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={feature.label}
                whileHover={{
                  scale: 1.05,
                  boxShadow: 'var(--shadow-glow-red)',
                }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full border transition-all`}
                style={{
                  borderColor: 'hsl(0 85% 55% / 0.3)',
                  backgroundColor: 'hsl(220 13% 10% / 0.8)',
                  backdropFilter: 'blur(8px)',
                  boxShadow: 'var(--shadow-card)',
                }}
              >
                <Icon className="w-5 h-5" style={{ color: 'hsl(0 85% 55%)' }} />
                <span className="text-gray-300 text-sm sm:text-base font-medium">
                  {feature.label}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* SOS Button */}
        <motion.div
          variants={itemVariants}
          className="mb-8 relative"
        >
          {/* Pulse ring effect */}
          <motion.div
            className="absolute inset-0 rounded-full bg-red-500"
            variants={pulseVariants}
            initial="initial"
            animate="animate"
          />

          {/* Main SOS Button */}
          <motion.button
            onClick={() => setIsSOSActive(!isSOSActive)}
            className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full shadow-2xl flex flex-col items-center justify-center gap-1 focus:outline-none text-white"
            style={{
              background: 'var(--gradient-emergency)',
              boxShadow: 'var(--shadow-card)',
            }}
            variants={sosButtonVariants}
            animate={isSOSActive ? 'active' : 'inactive'}
            whileHover={{
              boxShadow: 'var(--shadow-glow-red)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Phone className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
            <span className="text-white font-bold text-xl sm:text-2xl">SOS</span>
          </motion.button>
        </motion.div>

        {/* Voice SOS */}
        <motion.div variants={itemVariants} className="mb-12 text-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center hover:border-red-500">
              <Headphones className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium">Voice SOS</span>
          </motion.button>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: 'var(--shadow-glow-red)',
            }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-6 sm:px-10 py-3 sm:py-4 rounded-2xl text-white font-bold transition-shadow"
            style={{
              background: 'var(--gradient-emergency)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <Camera className="w-5 h-5" />
            Detect Accident
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: 'var(--shadow-glow-green)',
            }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center gap-2 px-6 sm:px-10 py-3 sm:py-4 rounded-2xl border-2 text-white font-bold transition-colors"
            style={{
              borderColor: 'hsl(145 65% 42%)',
              background: 'transparent',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <MapPin className="w-5 h-5" />
            Find Help Nearby
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
      </motion.div>

      {/* Features Section */}
      <motion.div
        className="relative z-10 w-full px-4 sm:px-6 lg:px-8 py-20"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-20">
            {/* AI Detection Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: 'var(--shadow-glow-red)' }}
              className="p-6 sm:p-8 rounded-2xl border"
              style={{
                borderColor: 'hsl(0 85% 55% / 0.3)',
                backgroundColor: 'hsl(220 13% 10% / 0.6)',
                backdropFilter: 'blur(8px)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="mb-4 w-14 h-14 rounded-lg flex items-center justify-center" style={{ background: 'hsl(0 85% 55% / 0.2)' }}>
                <Brain className="w-7 h-7" style={{ color: 'hsl(0 85% 55%)' }} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">AI Detection</h3>
              <p className="text-gray-400 text-sm sm:text-base">Upload images, set speed & vehicle type to detect accidents with AI severity prediction</p>
            </motion.div>

            {/* Emergency Locator Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: 'var(--shadow-glow-red)' }}
              className="p-6 sm:p-8 rounded-2xl border"
              style={{
                borderColor: 'hsl(0 85% 55% / 0.3)',
                backgroundColor: 'hsl(220 13% 10% / 0.6)',
                backdropFilter: 'blur(8px)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="mb-4 w-14 h-14 rounded-lg flex items-center justify-center" style={{ background: 'hsl(0 85% 55% / 0.2)' }}>
                <MapPin className="w-7 h-7" style={{ color: 'hsl(0 85% 55%)' }} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Emergency Locator</h3>
              <p className="text-gray-400 text-sm sm:text-base">Find hospitals, ambulances, police, towing & repair services nearby</p>
            </motion.div>

            {/* Global Support Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: 'var(--shadow-glow-red)' }}
              className="p-6 sm:p-8 rounded-2xl border"
              style={{
                borderColor: 'hsl(0 85% 55% / 0.3)',
                backgroundColor: 'hsl(220 13% 10% / 0.6)',
                backdropFilter: 'blur(8px)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="mb-4 w-14 h-14 rounded-lg flex items-center justify-center" style={{ background: 'hsl(0 85% 55% / 0.2)' }}>
                <Wifi className="w-7 h-7" style={{ color: 'hsl(0 85% 55%)' }} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Global Support</h3>
              <p className="text-gray-400 text-sm sm:text-base">Auto-detect country with local emergency numbers for 12+ countries</p>
            </motion.div>

            {/* AI Dashboard Card */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: 'var(--shadow-glow-red)' }}
              className="p-6 sm:p-8 rounded-2xl border"
              style={{
                borderColor: 'hsl(0 85% 55% / 0.3)',
                backgroundColor: 'hsl(220 13% 10% / 0.6)',
                backdropFilter: 'blur(8px)',
                boxShadow: 'var(--shadow-card)',
              }}
            >
              <div className="mb-4 w-14 h-14 rounded-lg flex items-center justify-center" style={{ background: 'hsl(0 85% 55% / 0.2)' }}>
                <BarChart3 className="w-7 h-7" style={{ color: 'hsl(0 85% 55%)' }} />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">AI Dashboard</h3>
              <p className="text-gray-400 text-sm sm:text-base">Monitor incidents, severity distribution & real-time analytics</p>
            </motion.div>
          </div>

          {/* Demo Mode Section */}
          <motion.div
            variants={itemVariants}
            className="p-6 sm:p-8 rounded-2xl border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6"
            style={{
              borderColor: 'hsl(45 95% 55% / 0.3)',
              backgroundColor: 'hsl(45 85% 20% / 0.2)',
              backdropFilter: 'blur(8px)',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 mt-1" style={{ color: 'hsl(45 95% 55%)' }} />
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Demo Mode Available</h3>
                <p className="text-gray-400 text-sm sm:text-base">Try pre-built scenarios — highway pile-up, city fender bender, bike accident & more</p>
              </div>
            </div>
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 20px hsl(45 95% 55% / 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-gray-900 whitespace-nowrap transition-all flex-shrink-0"
              style={{
                background: 'hsl(45 95% 55%)',
              }}
            >
              Simulate Accident
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
