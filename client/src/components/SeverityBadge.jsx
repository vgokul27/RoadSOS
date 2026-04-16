import { motion } from 'framer-motion';

export default function SeverityBadge({ severity }) {
  const getSeverityColor = (sev) => {
    if (sev === 'Low') return { bg: 'hsl(145 65% 42% / 0.15)', text: 'hsl(145 65% 42%)', label: '🟢 Low' };
    if (sev === 'Medium') return { bg: 'hsl(45 95% 55% / 0.15)', text: 'hsl(45 95% 55%)', label: '🟡 Medium' };
    if (sev === 'High') return { bg: 'hsl(0 85% 55% / 0.15)', text: 'hsl(0 85% 55%)', label: '🔴 High' };
    return { bg: 'gray', text: 'gray', label: 'Unknown' };
  };

  const colors = getSeverityColor(severity);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold"
      style={{ background: colors.bg, color: colors.text }}
    >
      {colors.label}
    </motion.div>
  );
}
