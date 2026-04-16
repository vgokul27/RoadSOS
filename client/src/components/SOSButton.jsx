import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone } from 'lucide-react';

export default function SOSButton({ severity }) {
  const [activated, setActivated] = useState(false);

  const handleSOS = () => {
    setActivated(true);
    // Simulate emergency alert
    console.log('🚨 SOS Emergency Activated!');
    console.log(`Severity: ${severity}`);
    
    setTimeout(() => {
      setActivated(false);
    }, 3000);
  };

  return (
    <motion.button
      onClick={handleSOS}
      disabled={activated}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative w-32 h-32 rounded-full font-bold text-white flex items-center justify-center text-center transition-all"
      style={{
        background: 'hsl(0 85% 55%)',
        boxShadow: activated ? '0 0 30px hsl(0 85% 55%), inset 0 0 20px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      {activated && (
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-white"
          style={{ borderColor: 'white' }}
          animate={{ scale: [1, 1.3], opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity }}
        />
      )}
      <div className="flex flex-col items-center gap-2">
        <AlertTriangle className="w-8 h-8" />
        <span className="text-xs">SOS</span>
      </div>
    </motion.button>
  );
}
