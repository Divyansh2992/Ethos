import React, { useState } from 'react';
import { AlertTriangle, Shield, Clock, MapPin, User, Wifi, CreditCard, Eye, Filter, Search, Bell } from 'lucide-react';

interface SecurityAlert {
  id: string;
  entityId: string;
  entityName: string;
  entityType: 'student' | 'staff' | 'asset' | 'device';
  alertType: 'missing' | 'anomalous_behavior' | 'unauthorized_access' | 'device_anomaly' | 'location_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  firstDetected: string;
  lastSeen: string;
  location?: string;
  duration: string;
  confidence: number;
  evidenceCount: number;
  status: 'active' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  relatedAlerts: string[];
}

interface AnomalyPattern {
  pattern: string;
  description: string;
  risk_level: string;
  occurrences: number;
  entities_affected: string[];
}

const SecurityAlerts: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<SecurityAlert | null>(null);

  const mockAlerts: SecurityAlert[] = [
    {
      id: 'alert_001',
      entityId: 'S57560',
      entityName: 'Aarav Desai',
      entityType: 'student',
      alertType: 'missing',
      severity: 'high',
      description: 'Student has not been observed in any campus systems for 18+ hours',
      firstDetected: '2024-01-15T06:00:00Z',
      lastSeen: '2024-01-14T16:30:00Z',
      location: 'Library - Study Room 105',
      duration: '18 hours',
      confidence: 94.5,
      evidenceCount: 0,
      status: 'active',
      assignedTo: 'Security Team Alpha',
      relatedAlerts: []
    },
    {
      id: 'alert_002',
      entityId: 'LAB',
      entityName: 'Lab Equipment LAB-445',
      entityType: 'asset',
      alertType: 'missing',
      severity: 'critical',
      description: 'High-value laboratory equipment missing for 8+ hours',
      firstDetected: '2024-01-15T08:45:00Z',
      lastSeen: '2024-01-15T08:45:00Z',
      location: 'Chemistry Lab A',
      duration: '8 hours',
      confidence: 97.8,
      evidenceCount: 1,
      status: 'investigating',
      assignedTo: 'Dr. Martinez',
      relatedAlerts: ['alert_005']
    },
    {
      id: 'alert_003',
      entityId: 'S47028',
      entityName: 'Sana Patel',
      entityType: 'student',
      alertType: 'anomalous_behavior',
      severity: 'medium',
      description: 'Unusual access pattern detected - multiple late-night lab entries',
      firstDetected: '2024-01-15T02:30:00Z',
      lastSeen: '2024-01-15T14:30:00Z',
      location: 'Engineering Building - Lab 204',
      duration: '12 hours',
      confidence: 87.2,
      evidenceCount: 7,
      status: 'active',
      relatedAlerts: ['alert_004']
    },
    {
      id: 'alert_004',
      entityId: 'DH9975108469fb',
      entityName: 'Unknown Device',
      entityType: 'device',
      alertType: 'device_anomaly',
      severity: 'medium',
      description: 'Unregistered device attempting campus network access',
      firstDetected: '2024-01-15T01:15:00Z',
      lastSeen: '2024-01-15T14:45:00Z',
      location: 'Engineering Building WiFi Zone',
      duration: '13 hours',
      confidence: 92.1,
      evidenceCount: 15,
      status: 'active',
      relatedAlerts: ['alert_003']
    },
    {
      id: 'alert_005',
      entityId: 'T2556',
      entityName: 'Ishaan Rao',
      entityType: 'staff',
      alertType: 'unauthorized_access',
      severity: 'high',
      description: 'Staff member accessed restricted area outside authorized hours',
      firstDetected: '2024-01-15T22:45:00Z',
      lastSeen: '2024-01-15T23:15:00Z',
      location: 'Server Room B',
      duration: '30 minutes',
      confidence: 96.4,
      evidenceCount: 3,
      status: 'resolved',
      assignedTo: 'IT Security',
      relatedAlerts: ['alert_002']
    }
  ];

  const anomalyPatterns: AnomalyPattern[] = [
    {
      pattern: 'Late Night Access',
      description: 'Multiple entities accessing facilities between 11 PM - 5 AM',
      risk_level: 'medium',
      occurrences: 12,
      entities_affected: ['S16175', 'S59009', 'S79352']
    },
    {
      pattern: 'Rapid Location Changes',
      description: 'Entities appearing in multiple distant locations within short time windows',
      risk_level: 'high',
      occurrences: 3,
      entities_affected: ['S16006', 'LAB445']
    },
    {
      pattern: 'Unregistered Devices',
      description: 'Unknown devices attempting to connect to campus network',
      risk_level: 'high',
      occurrences: 8,
      entities_affected: ['DHa12fbd7e9a12', 'DH3384ceae5090']
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-300 bg-red-900 border-red-500';
      case 'high':
        return 'text-red-400 bg-red-900 border-red-600';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900 border-yellow-600';
      case 'low':
        return 'text-blue-400 bg-blue-900 border-blue-600';
      default:
        return 'text-gray-400 bg-gray-700 border-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-red-400 bg-red-900';
      case 'investigating':
        return 'text-yellow-400 bg-yellow-900';
      case 'resolved':
        return 'text-green-400 bg-green-900';
      case 'false_positive':
        return 'text-gray-400 bg-gray-700';
      default:
        return 'text-gray-400 bg-gray-700';
    }
  };

  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case 'missing':
        return <User className="h-4 w-4" />;
      case 'anomalous_behavior':
        return <Eye className="h-4 w-4" />;
      case 'unauthorized_access':
        return <Shield className="h-4 w-4" />;
      case 'device_anomaly':
        return <Wifi className="h-4 w-4" />;
      case 'location_violation':
        return <MapPin className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const filteredAlerts = mockAlerts.filter(alert => {
    const matchesSeverity = filterSeverity === 'all' || alert.severity === filterSeverity;
    const matchesStatus = filterStatus === 'all' || alert.status === filterStatus;
    const matchesType = filterType === 'all' || alert.alertType === filterType;
    const matchesSearch = searchQuery === '' || 
      alert.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.entityId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSeverity && matchesStatus && matchesType && matchesSearch;
  });

  const alertStats = {
    total: mockAlerts.length,
    active: mockAlerts.filter(a => a.status === 'active').length,
    critical: mockAlerts.filter(a => a.severity === 'critical').length,
    investigating: mockAlerts.filter(a => a.status === 'investigating').length
  };

  return (
    <div className="space-y-6">
      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Alerts</p>
              <p className="text-2xl font-bold">{alertStats.total}</p>
            </div>
            <Bell className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Alerts</p>
              <p className="text-2xl font-bold text-red-400">{alertStats.active}</p>
            </div>
            <AlertTriangle className="h-6 w-6 text-red-400" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Critical</p>
              <p className="text-2xl font-bold text-red-300">{alertStats.critical}</p>
            </div>
            <Shield className="h-6 w-6 text-red-300" />
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Under Investigation</p>
              <p className="text-2xl font-bold text-yellow-400">{alertStats.investigating}</p>
            </div>
            <Eye className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Filters:</span>
          </div>
          
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-blue-400 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-blue-400 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="false_positive">False Positive</option>
          </select>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:border-blue-400 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="missing">Missing Entity</option>
            <option value="anomalous_behavior">Anomalous Behavior</option>
            <option value="unauthorized_access">Unauthorized Access</option>
            <option value="device_anomaly">Device Anomaly</option>
            <option value="location_violation">Location Violation</option>
          </select>
          
          <div className="flex items-center space-x-2 flex-1 min-w-64">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search alerts by entity name, ID, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm placeholder-gray-400 focus:border-blue-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts List */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold">Security Alerts ({filteredAlerts.length})</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-gray-750 transition-colors border-l-4 ${getSeverityColor(alert.severity)}`}
                onClick={() => setSelectedAlert(alert)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getAlertTypeIcon(alert.alertType)}
                    <h4 className="font-medium">{alert.entityName}</h4>
                    <span className="text-xs text-gray-400">({alert.entityId})</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                      {alert.severity.toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(alert.status)}`}>
                      {alert.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-300 mb-2">{alert.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {alert.duration}
                    </span>
                    {alert.location && (
                      <span className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {alert.location}
                      </span>
                    )}
                  </div>
                  <span>{alert.confidence}% confidence</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alert Details */}
        <div className="space-y-6">
          {selectedAlert ? (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-lg font-semibold mb-4">Alert Details</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Entity</label>
                    <p className="font-medium">{selectedAlert.entityName}</p>
                    <p className="text-sm text-gray-400">{selectedAlert.entityId}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Type</label>
                    <p className="font-medium capitalize">{selectedAlert.entityType}</p>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Description</label>
                  <p className="text-gray-300">{selectedAlert.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">First Detected</label>
                    <p className="text-sm">{new Date(selectedAlert.firstDetected).toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Last Seen</label>
                    <p className="text-sm">{new Date(selectedAlert.lastSeen).toLocaleString()}</p>
                  </div>
                </div>
                
                {selectedAlert.location && (
                  <div>
                    <label className="text-sm text-gray-400">Location</label>
                    <p className="text-blue-400">{selectedAlert.location}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Evidence Count</label>
                    <p className="font-medium">{selectedAlert.evidenceCount} data points</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Confidence</label>
                    <p className="font-medium text-green-400">{selectedAlert.confidence}%</p>
                  </div>
                </div>
                
                {selectedAlert.assignedTo && (
                  <div>
                    <label className="text-sm text-gray-400">Assigned To</label>
                    <p className="font-medium">{selectedAlert.assignedTo}</p>
                  </div>
                )}
                
                {selectedAlert.relatedAlerts.length > 0 && (
                  <div>
                    <label className="text-sm text-gray-400">Related Alerts</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedAlert.relatedAlerts.map(alertId => (
                        <span key={alertId} className="px-2 py-1 bg-gray-700 rounded text-xs">
                          {alertId}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex space-x-3 pt-4 border-t border-gray-700">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                    Investigate
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm">
                    Resolve
                  </button>
                  <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors text-sm">
                    False Positive
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="text-center text-gray-400">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                <p>Select an alert to view details</p>
              </div>
            </div>
          )}

          {/* Anomaly Patterns */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Detected Anomaly Patterns</h3>
            
            <div className="space-y-3">
              {anomalyPatterns.map((pattern, index) => (
                <div key={index} className="p-3 bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{pattern.pattern}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      pattern.risk_level === 'high' ? 'bg-red-900 text-red-300' :
                      pattern.risk_level === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-blue-900 text-blue-300'
                    }`}>
                      {pattern.risk_level.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{pattern.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{pattern.occurrences} occurrences</span>
                    <span>{pattern.entities_affected.length} entities affected</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAlerts;