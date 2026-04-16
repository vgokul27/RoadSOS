import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, AlertTriangle } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Detection', href: '/detection' },
    { name: 'Emergency Map', href: '/emergency-map' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'About', href: '/about' },
  ];

  // Hamburger menu animation
  const hamMenuVariants = {
    open: { rotate: 180, opacity: 0 },
    closed: { rotate: 0, opacity: 1 },
  };

  const xMenuVariants = {
    open: { rotate: 90, opacity: 1 },
    closed: { rotate: -90, opacity: 0 },
  };

  // Sidebar animation
  const sidebarVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
    closed: {
      x: -280,
      opacity: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      },
    },
  };

  // Backdrop animation
  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  // Link animation (stagger effect)
  const linkVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    closed: { opacity: 0, x: -20 },
  };

  const containerVariants = {
    open: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{
      background: isScrolled 
        ? 'hsl(220 18% 8% / 0.7)' 
        : 'hsl(220 18% 8%)',
      backdropFilter: isScrolled ? 'blur(10px)' : 'none',
      borderBottom: isScrolled 
        ? '1px solid hsl(0 85% 55% / 0.2)'
        : '1px solid hsl(0 0% 0% / 0)',
      boxShadow: isScrolled 
        ? '0 4px 24px hsl(0 0% 0% / 0.4)' 
        : '0 2px 8px hsl(0 0% 0% / 0.2)',
      transition: 'all 0.3s ease',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side: Hamburger Menu + Logo */}
          <div className="flex items-center gap-3 md:gap-2">
            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden relative w-10 h-10 flex items-center justify-center"
              onClick={() => setIsOpen(!isOpen)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                variants={hamMenuVariants}
                animate={isOpen ? 'open' : 'closed'}
                transition={{ duration: 0.3 }}
                className="absolute"
              >
                <Menu className="w-6 h-6" style={{ color: 'hsl(0 85% 55%)' }} />
              </motion.div>
              <motion.div
                variants={xMenuVariants}
                animate={isOpen ? 'open' : 'closed'}
                transition={{ duration: 0.3 }}
                className="absolute"
              >
                <X className="w-6 h-6" style={{ color: 'hsl(0 85% 55%)' }} />
              </motion.div>
            </motion.button>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              <div className="rounded-lg p-2" style={{ background: 'var(--gradient-emergency)' }}>
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <span className="hidden sm:block text-white font-bold text-2xl">
                Road<span style={{ color: 'hsl(0 85% 55%)' }}>SoS</span>
              </span>
            </motion.div>
          </div>

          {/* Desktop Navigation - Right side */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden md:flex items-center gap-2"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <motion.div
                  key={link.name}
                  whileHover={{
                    transition: { duration: 0.3 },
                  }}
                >
                  <Link
                    to={link.href}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      color: isActive ? 'white' : 'gray',
                      backgroundColor: isActive ? 'hsl(0 85% 55%)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'hsl(0 0% 40%)';
                        e.currentTarget.style.color = 'white';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'gray';
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <motion.div
        className="fixed inset-0 bg-black/50 md:hidden"
        variants={backdropVariants}
        animate={isOpen ? 'open' : 'closed'}
        onClick={() => setIsOpen(false)}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      />

      <motion.div
        className="fixed top-0 left-0 h-screen w-72 md:hidden"
        style={{
          background: 'hsl(220 18% 15%)',
          borderRightColor: 'hsl(0 85% 55% / 0.3)',
          borderRightWidth: '1px',
        }}
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center h-16 px-6" style={{
          borderBottomColor: 'hsl(0 85% 55% / 0.3)',
          borderBottomWidth: '1px',
        }}>
          {/* Logo in Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2"
          >
            <div className="rounded-lg p-2" style={{ background: 'var(--gradient-emergency)' }}>
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white font-bold text-lg">
              Road<span style={{ color: 'hsl(0 85% 55%)' }}>SoS</span>
            </span>
          </motion.div>

          {/* Close Button in Sidebar */}
          <motion.button
            onClick={() => setIsOpen(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="transition-colors"
            style={{ color: 'hsl(0 85% 55%)' }}
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Sidebar Navigation Content */}
        <div className="pt-6 px-6">
          <motion.div
            variants={containerVariants}
            animate={isOpen ? 'open' : 'closed'}
            className="flex flex-col gap-6"
          >
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <motion.div
                  key={link.name}
                  variants={linkVariants}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium transition-all px-4 py-2 rounded-lg block"
                    style={{
                      color: isActive ? 'white' : 'hsl(0 85% 55%)',
                      backgroundColor: isActive ? 'hsl(0 85% 55%)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'hsl(0 85% 55% / 0.2)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
    </nav>
  );
}
