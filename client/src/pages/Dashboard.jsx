import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  TrendingUp,
  MapPin,
  BarChart3,
  Clock,
  Activity,
} from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/emergency/stats');
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        } else {
          setError('Failed to fetch statistics');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16" style={{ background: 'linear-gradient(135deg, hsl(220 20% 4%) 0%, hsl(220 25% 8%) 30%, hsl(15 70% 20%) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin">
              <div className="w-16 h-16 border-4 border-gray-700 border-t-red-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-16" style={{ background: 'linear-gradient(135deg, hsl(220 20% 4%) 0%, hsl(220 25% 8%) 30%, hsl(15 70% 20%) 100%)' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center text-red-200">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>Error: {error}</p>
            <p className="text-sm text-red-300 mt-2">Make sure the backend is running on http://localhost:5000</p>
          </div>
        </div>
      </div>
    );
  }

  const severityColors = {
    Low: '#22c55e',
    Medium: '#eab308',
    High: '#ef4444',
  };

  // Prepare severity distribution for pie chart
  const severityData = stats?.severityDistribution || {};
  const severityTotal = Object.values(severityData).reduce((a, b) => a + b, 0) || 1;

  // Calculate pie chart segments
  const severitySegments = [];
  let currentAngle = 0;
  Object.entries(severityData).forEach(([severity, count]) => {
    const percentage = (count / severityTotal) * 100;
    const angle = (percentage * 360) / 100;
    severitySegments.push({
      severity,
      count,
      percentage,
      angle,
      startAngle: currentAngle,
    });
    currentAngle += angle;
  });

  // Stats cards
  const StatCard = ({ icon: Icon, label, value, trend, trendUp }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl"
      style={{
        backgroundColor: 'hsl(220 13% 10% / 0.6)',
        backdropFilter: 'blur(8px)',
        borderColor: 'hsl(0 0% 100% / 0.1)',
        borderWidth: '1px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background:
              label === 'Total Incidents'
                ? 'hsl(0 85% 55% / 0.2)'
                : label === 'Avg Response Time'
                ? 'hsl(195 100% 50% / 0.2)'
                : label === 'Active Cases'
                ? 'hsl(45 95% 55% / 0.2)'
                : 'hsl(195 100% 50% / 0.2)',
          }}
        >
          <Icon
            className="w-5 h-5"
            style={{
              color:
                label === 'Total Incidents'
                  ? 'hsl(0 85% 55%)'
                  : label === 'Avg Response Time'
                  ? 'hsl(195 100% 50%)'
                  : label === 'Active Cases'
                  ? 'hsl(45 95% 55%)'
                  : 'hsl(195 100% 50%)',
            }}
          />
        </div>
        {trend && (
          <span
            className="text-xs font-semibold flex items-center gap-1"
            style={{
              color: trendUp ? 'hsl(145 65% 42%)' : 'hsl(0 85% 55%)',
            }}
          >
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </motion.div>
  );

  // Weekly incidents chart
  const weeklyData = stats?.weeklyIncidents || [];
  const maxWeeklyCount = Math.max(...weeklyData.map((d) => d.count), 1);

  // Recent incidents
  const recentIncidents = stats?.recentIncidents || [];

  return (
    <div
      className="min-h-screen pt-24 pb-16 px-4"
      style={{
        background:
          'linear-gradient(135deg, hsl(220 20% 4%) 0%, hsl(220 25% 8%) 30%, hsl(15 70% 20%) 100%)',
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'hsl(0 85% 55% / 0.2)' }}
            >
              <BarChart3 className="w-5 h-5" style={{ color: 'hsl(0 85% 55%)' }} />
            </div>
            <h1 className="text-3xl font-bold text-white">AI Dashboard</h1>
          </div>
          <p className="text-gray-400">Real-time incident monitoring and analytics</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={AlertTriangle}
            label="Total Incidents"
            value={stats?.totalIncidents || 0}
            trend="+12%"
            trendUp={false}
          />
          <StatCard
            icon={Clock}
            label="Avg Response Time"
            value={`${stats?.averageResponseDistance?.toFixed(1) || 0} km`}
            trend="-8%"
            trendUp={true}
          />
          <StatCard
            icon={MapPin}
            label="Active Cases"
            value={stats?.activeIncidents || 0}
          />
          <StatCard
            icon={Activity}
            label="AI Detections"
            value={stats?.aiDetections || 0}
            trend="+23%"
            trendUp={false}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Weekly Incidents Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl"
            style={{
              backgroundColor: 'hsl(220 13% 10% / 0.6)',
              backdropFilter: 'blur(8px)',
              borderColor: 'hsl(0 0% 100% / 0.1)',
              borderWidth: '1px',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h2 className="text-xl font-bold text-white mb-6">Weekly Incidents</h2>
            <div className="flex items-end gap-3 h-48">
              {weeklyData.length > 0 ? (
                weeklyData.map((day, idx) => (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <div className="w-full bg-gray-700 rounded-lg overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{
                          height: `${(day.count / maxWeeklyCount) * 160}px`,
                        }}
                        transition={{ delay: idx * 0.05 }}
                        style={{ background: 'hsl(0 85% 55%)' }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">
                      {day._id.split('-')[2]}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No data available</p>
              )}
            </div>
          </motion.div>

          {/* Severity Distribution Donut Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl flex flex-col items-center justify-center"
            style={{
              backgroundColor: 'hsl(220 13% 10% / 0.6)',
              backdropFilter: 'blur(8px)',
              borderColor: 'hsl(0 0% 100% / 0.1)',
              borderWidth: '1px',
              boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
            }}
          >
            <h2 className="text-xl font-bold text-white mb-6 w-full">
              Severity Distribution
            </h2>
            <svg width="180" height="180" viewBox="0 0 180 180" className="mb-4">
              {severitySegments.map((segment, idx) => {
                const radius = 70;
                const circumference = 2 * Math.PI * radius;
                const strokeDashoffset =
                  circumference - (segment.angle / 360) * circumference;

                return (
                  <circle
                    key={idx}
                    cx="90"
                    cy="90"
                    r={radius}
                    fill="none"
                    stroke={severityColors[segment.severity]}
                    strokeWidth="20"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    transform={`rotate(${segment.startAngle} 90 90)`}
                    opacity="0.9"
                  />
                );
              })}
            </svg>
            <div className="flex gap-6 justify-center">
              {severitySegments.map((segment) => (
                <div key={segment.severity} className="text-center">
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-1"
                    style={{
                      backgroundColor: severityColors[segment.severity],
                    }}
                  />
                  <p className="text-xs text-gray-400">{segment.severity}</p>
                  <p className="text-sm font-bold text-white">
                    {segment.count}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl"
          style={{
            backgroundColor: 'hsl(220 13% 10% / 0.6)',
            backdropFilter: 'blur(8px)',
            borderColor: 'hsl(0 0% 100% / 0.1)',
            borderWidth: '1px',
            boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
          }}
        >
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" style={{ color: 'hsl(0 85% 55%)' }} />
            Recent Incidents
          </h2>
          <div className="space-y-3">
            {recentIncidents.length > 0 ? (
              recentIncidents.map((incident, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg flex items-center justify-between"
                  style={{
                    backgroundColor: 'hsl(220 13% 15%)',
                    borderColor: 'hsl(0 0% 100% / 0.1)',
                    borderWidth: '1px',
                  }}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-white">
                      {incident.latitude?.toFixed(4) || 'N/A'}, {incident.longitude?.toFixed(4) || 'N/A'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(incident.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background:
                          incident.severity === 'High'
                            ? 'hsl(0 85% 55% / 0.2)'
                            : incident.severity === 'Medium'
                            ? 'hsl(45 95% 55% / 0.2)'
                            : 'hsl(145 65% 42% / 0.2)',
                        color:
                          incident.severity === 'High'
                            ? 'hsl(0 85% 55%)'
                            : incident.severity === 'Medium'
                            ? 'hsl(45 95% 55%)'
                            : 'hsl(145 65% 42%)',
                      }}
                    >
                      {incident.severity}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: 'hsl(195 100% 50% / 0.2)',
                        color: 'hsl(195 100% 50%)',
                      }}
                    >
                      {incident.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-6">No incidents yet</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
