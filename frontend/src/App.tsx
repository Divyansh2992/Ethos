import React, { useState } from 'react';
import { Shield, Search, Users, Activity, AlertTriangle, Clock } from 'lucide-react';
import Dashboard from './components/Dashboard';
import EntityResolver from './components/EntityResolver';
import TimelineView from './components/TimelineView';
import PredictiveMonitoring from './components/PredictiveMonitoring';
import SecurityAlerts from './components/SecurityAlerts';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Shield },
    { id: 'resolver', label: 'Entity Resolution', icon: Search },
    { id: 'timeline', label: 'Activity Timeline', icon: Activity },
    { id: 'monitoring', label: 'Predictive Monitoring', icon: Clock },
    { id: 'alerts', label: 'Security Alerts', icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-400" />
            <h1 className="text-xl font-bold">Campus Security & Entity Resolution System</h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Users className="h-4 w-4" />
            <span>Security Operations Center</span>
          </div>
        </div>
      </header>

      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="px-6">
          <div className="flex space-x-8">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === id
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="p-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'resolver' && <EntityResolver />}
        {activeTab === 'timeline' && <TimelineView />}
        {activeTab === 'monitoring' && <PredictiveMonitoring />}
        {activeTab === 'alerts' && <SecurityAlerts />}
      </main>
    </div>
  );
}

export default App;