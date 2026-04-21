import { motion } from 'framer-motion';
import {
  Heart,
  AlertCircle,
  MapPin,
  Zap,
  Smartphone,
  Brain,
  Activity,
  Ambulance,
  Navigation,
  BarChart3,
  Code2,
  Database,
  Server,
  Sparkles,
  Palette,
  Package,
  AlertTriangle,
} from 'lucide-react';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  const featureCards = [
    {
      icon: Brain,
      title: 'AI-Powered Detection',
      description: 'Advanced machine learning algorithms detect accidents in real-time using vehicle sensors and camera feeds.',
      color: 'hsl(195 100% 50%)',
    },
    {
      icon: MapPin,
      title: 'Real-Time Localization',
      description: 'Precise GPS tracking and location-sharing to dispatch emergency services to the exact accident location.',
      color: 'hsl(145 65% 42%)',
    },
    {
      icon: Ambulance,
      title: 'Emergency Dispatch',
      description: 'Instant connection with nearby ambulances, hospitals, and emergency services for rapid response.',
      color: 'hsl(0 85% 55%)',
    },
    {
      icon: Smartphone,
      title: 'Multi-Platform Access',
      description: 'Seamless experience across web, mobile, and connected vehicle systems for maximum accessibility.',
      color: 'hsl(45 95% 55%)',
    },
    {
      icon: Activity,
      title: 'Health Monitoring',
      description: 'Real-time vital sign monitoring and health status tracking for emergency responders.',
      color: 'hsl(280 85% 65%)',
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Comprehensive analytics and incidents tracking for emergency response optimization.',
      color: 'hsl(195 100% 50%)',
    },
  ];

  const techStack = [
    { name: 'React.js', icon: Code2 },
    { name: 'Node.js', icon: Server },
    { name: 'MongoDB', icon: Database },
    { name: 'Vite', icon: Zap },
    { name: 'Express.js', icon: Package },
    { name: 'Framer Motion', icon: Sparkles },
    { name: 'Tailwind CSS', icon: Palette },
    { name: 'Lucide Icons', icon: Heart },
  ];

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-4"
      style={{
        background: 'linear-gradient(135deg, hsl(220 20% 4%) 0%, hsl(220 25% 8%) 30%, hsl(15 70% 20%) 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <motion.div
              initial={{ rotate: -20, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'hsl(0 85% 55% / 0.2)' }}
            >
              <AlertTriangle className="w-8 h-8" style={{ color: 'hsl(0 85% 55%)' }} />
            </motion.div>
            <h1 className="text-5xl font-bold text-white">RoadSOS</h1>
          </div>
          <p className="text-lg text-gray-300 mb-4 max-w-2xl mx-auto">
            AI-Powered Emergency Response System for Rapid Accident Detection & Assistance
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20 p-8 rounded-2xl text-center max-w-4xl mx-auto"
          style={{
            backgroundColor: 'hsl(220 13% 10% / 0.6)',
            backdropFilter: 'blur(8px)',
            borderColor: 'hsl(0 0% 100% / 0.1)',
            borderWidth: '1px',
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart style={{ color: 'hsl(0 85% 55%)', width: 28, height: 28 }} />
            <h2 className="text-2xl font-bold text-white">Our Mission</h2>
          </div>
          <p className="text-gray-300 text-lg">
            To save lives by providing instant accident detection and emergency response coordination, reducing response times and improving outcomes for road accident victims through AI-powered technology and seamless emergency service integration.
          </p>
        </motion.div>

        {/* Key Features */}
        <div className="mb-20">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white mb-12 text-center"
          >
            <span className="flex items-center justify-center gap-3">
              <Zap style={{ color: 'hsl(45 95% 55%)' }} />
              Core Features
            </span>
          </motion.h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featureCards.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="p-6 rounded-2xl"
                  style={{
                    backgroundColor: 'hsl(220 13% 10% / 0.6)',
                    backdropFilter: 'blur(8px)',
                    borderColor: 'hsl(0 0% 100% / 0.1)',
                    borderWidth: '1px',
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${feature.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </motion.div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center flex items-center justify-center gap-3">
            <Navigation style={{ color: 'hsl(145 65% 42%)' }} />
            How It Works
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                step: 1,
                title: 'Accident Detection',
                description: 'Our AI system continuously monitors vehicle sensors, detecting sudden impacts or abnormal vehicle behavior.',
                icon: AlertCircle,
              },
              {
                step: 2,
                title: 'Location Verification',
                description: 'Real-time GPS coordinates are obtained and verified for accuracy to pinpoint the incident location.',
                icon: MapPin,
              },
              {
                step: 3,
                title: 'Emergency Alert',
                description: 'The system instantly sends alerts to nearby ambulances, hospitals, police, and emergency services.',
                icon: Zap,
              },
              {
                step: 4,
                title: 'Rapid Response',
                description: 'Emergency responders navigate to the exact location and provide immediate assistance to victims.',
                icon: Ambulance,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="p-6 rounded-2xl text-center"
                  style={{
                    backgroundColor: 'hsl(220 13% 10% / 0.6)',
                    backdropFilter: 'blur(8px)',
                    borderColor: 'hsl(0 0% 100% / 0.1)',
                    borderWidth: '1px',
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.15, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 relative"
                    style={{
                      background: 'linear-gradient(135deg, hsl(0 85% 55%), hsl(45 95% 55%))',
                    }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <div className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'hsl(0 85% 55% / 0.3)' }}>
                    Step {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-12 text-center flex items-center justify-center gap-3">
            <Zap style={{ color: 'hsl(195 100% 50%)' }} />
            Technology Stack
          </h2>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {techStack.map((tech, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.05 }}
                className="p-4 rounded-xl text-center"
                style={{
                  backgroundColor: 'hsl(220 13% 10% / 0.6)',
                  backdropFilter: 'blur(8px)',
                  borderColor: 'hsl(0 0% 100% / 0.1)',
                  borderWidth: '1px',
                }}
              >
                <p className="text-white font-semibold text-sm">{tech.name}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
}
