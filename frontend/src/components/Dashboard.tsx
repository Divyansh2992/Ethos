import React, { useEffect, useState } from 'react';
import { Users, Wifi, CreditCard, BookOpen, AlertTriangle, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [activeEntities, setActiveEntities] = useState<number | null>(null);
  const [wifiConnections, setWifiConnections] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch('http://localhost:3000/mysql/profile/unique-entities/count', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.count === 'number') setActiveEntities(data.count);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch('http://localhost:3000/mysql/wifi/unique-device-hashes/count', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (typeof data?.count === 'number') setWifiConnections(data.count);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const stats = [
    { label: 'Active Entities', value: activeEntities ?? '—', icon: Users, change: '+2.3%', color: 'text-blue-400' },
    { label: 'Wi-Fi Connections', value: wifiConnections ?? '—', icon: Wifi, change: '+5.1%', color: 'text-green-400' },
    { label: 'Card Swipes (24h)', value: '15,642', icon: CreditCard, change: '+1.8%', color: 'text-purple-400' },
    { label: 'Library Checkouts', value: '1,847', icon: BookOpen, change: '-3.2%', color: 'text-yellow-400' },
    { label: 'Security Alerts', value: '23', icon: AlertTriangle, change: '+12.5%', color: 'text-red-400' },
    { label: 'Resolution Rate', value: '94.7%', icon: TrendingUp, change: '+0.8%', color: 'text-emerald-400' },
  ];

  const recentAlerts = [
    { id: 1, entity: 'John Doe (ST20001)', type: 'Missing', duration: '14 hours', severity: 'high' },
    { id: 2, entity: 'Lab Equipment #LB-445', type: 'Unusual Access', duration: '2 hours', severity: 'medium' },
    { id: 3, entity: 'Sarah Johnson (ST20045)', type: 'Anomalous Pattern', duration: '6 hours', severity: 'low' },
  ];

  const topEntities = [
    { name: 'Library - Main Floor', type: 'Location', activity: 2847, confidence: 98.2 },
    { name: 'Student Center WiFi', type: 'Network', activity: 1923, confidence: 97.1 },
    { name: 'Engineering Lab A', type: 'Location', activity: 876, confidence: 95.8 },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
                  <span className="text-green-400 text-sm">{stat.change}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-gray-700 ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Security Alerts */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
            Recent Security Alerts
          </h3>
          <div className="space-y-3">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">{alert.entity}</p>
                  <p className="text-sm text-gray-400">{alert.type} • {alert.duration}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  alert.severity === 'high' ? 'bg-red-900 text-red-300' :
                  alert.severity === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                  'bg-blue-900 text-blue-300'
                }`}>
                  {alert.severity.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Activity Sources */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
            Top Activity Sources
          </h3>
            <TopActivitySources />
        </div>
      </div>

      {/* System Status */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4">System Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <span>Entity Resolution Engine</span>
            <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-sm">ONLINE</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <span>Data Ingestion Pipeline</span>
            <span className="px-2 py-1 bg-green-900 text-green-300 rounded text-sm">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <span>ML Prediction Service</span>
            <span className="px-2 py-1 bg-yellow-900 text-yellow-300 rounded text-sm">WARNING</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

// Helper component to fetch and display top activity sources
const TopActivitySources: React.FC = () => {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/mysql/data/top-locations')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.top_locations)) {
          // Map backend data to UI format
          setSources(data.top_locations.map((loc, idx) => ({
            name: loc.room_id || `Location ${idx + 1}`,
            type: 'Location',
            activity: loc.visits,
            confidence: (98 - idx * 1.1).toFixed(1) // Example confidence
          })));
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load top activity sources');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="text-gray-400">Loading...</div>;
  if (error) return <div className="text-red-400">{error}</div>;

  return (
    <div className="space-y-4">
      {sources.map((entity, index) => (
        <div key={index} className="flex items-center justify-between">
          <div>
            <p className="font-medium">{entity.name}</p>
            <p className="text-sm text-gray-400">{entity.type}</p>
          </div>
          <div className="text-right">
            <p className="font-medium">{entity.activity}</p>
            <p className="text-sm text-green-400">{entity.confidence}% confidence</p>
          </div>
        </div>
      ))}
    </div>
  );
};