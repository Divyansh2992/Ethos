import React, { useState } from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle, MapPin, Clock, Target } from 'lucide-react';

interface Prediction {
  entityId: string;
  entityName: string;
  predictedLocation: string;
  probability: number;
  timeWindow: string;
  reasoning: string[];
  confidence: number;
  missingDataPoints: string[];
}

const PredictiveMonitoring: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState('ST20001');
  const [predictionTime, setPredictionTime] = useState('current');

  const mockPredictions: Prediction[] = [
    {
      entityId: 'ST20001',
      entityName: 'John Doe',
      predictedLocation: 'Engineering Building - Lab 204',
      probability: 87.3,
      timeWindow: 'Next 2 hours',
      reasoning: [
        'Historical pattern shows 85% probability of lab attendance on Tuesdays at 2 PM',
        'Last WiFi connection from Student Center indicates movement toward Engineering area',
        'CS472 lab session scheduled at 2:30 PM according to academic calendar',
        'Previous week showed consistent lab attendance pattern'
      ],
      confidence: 87.3,
      missingDataPoints: ['Current card swipe location', 'Active WiFi connection']
    }
  ];

  const missingEntities = [
    {
      id: 'ST20045',
      name: 'Sarah Johnson',
      type: 'Student',
      lastSeen: '2024-01-14T16:30:00Z',
      location: 'Library - Study Room 105',
      duration: '18 hours',
      riskLevel: 'medium',
      predictions: [
        { location: 'Dormitory Building A', probability: 65.2 },
        { location: 'Student Center Cafeteria', probability: 23.8 },
        { location: 'Off-campus', probability: 11.0 }
      ]
    },
    {
      id: 'LB445',
      name: 'Lab Equipment LB-445',
      type: 'Asset',
      lastSeen: '2024-01-15T08:45:00Z',
      location: 'Chemistry Lab A',
      duration: '8 hours',
      riskLevel: 'high',
      predictions: [
        { location: 'Same location (stationary equipment)', probability: 89.5 },
        { location: 'Maintenance room', probability: 8.2 },
        { location: 'Storage facility', probability: 2.3 }
      ]
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'text-red-400 bg-red-900';
      case 'medium':
        return 'text-yellow-400 bg-yellow-900';
      case 'low':
        return 'text-green-400 bg-green-900';
      default:
        return 'text-gray-400 bg-gray-700';
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 80) return 'text-green-400';
    if (probability >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Brain className="h-6 w-6 text-purple-400 mr-2" />
          Predictive Monitoring Dashboard
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Entity to Predict</label>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
              <option value="ST20001">John Doe (ST20001)</option>
              <option value="SF5001">Sarah Johnson (SF5001)</option>
              <option value="LB445">Lab Equipment LB-445</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Prediction Time</label>
            <select
              value={predictionTime}
              onChange={(e) => setPredictionTime(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
              <option value="current">Current Time</option>
              <option value="1hour">+1 Hour</option>
              <option value="2hours">+2 Hours</option>
              <option value="4hours">+4 Hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* ML Predictions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="h-5 w-5 text-green-400 mr-2" />
          Location Predictions
        </h3>
        
        {mockPredictions.map((prediction) => (
          <div key={prediction.entityId} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium">{prediction.entityName}</h4>
                <p className="text-sm text-gray-400">Entity ID: {prediction.entityId}</p>
              </div>
              <div className="text-right">
                <span className={`text-lg font-bold ${getProbabilityColor(prediction.probability)}`}>
                  {prediction.probability}%
                </span>
                <p className="text-sm text-gray-400">Confidence</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-3 text-blue-400 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Predicted Location
                </h5>
                <div className="p-4 bg-gray-700 rounded-lg">
                  <p className="font-medium text-green-400">{prediction.predictedLocation}</p>
                  <p className="text-sm text-gray-300 mt-1">Time Window: {prediction.timeWindow}</p>
                </div>
                
                {prediction.missingDataPoints.length > 0 && (
                  <div className="mt-4">
                    <h6 className="font-medium mb-2 text-yellow-400">Missing Data Points</h6>
                    <ul className="space-y-1">
                      {prediction.missingDataPoints.map((point, index) => (
                        <li key={index} className="text-sm text-gray-400 flex items-center">
                          <AlertCircle className="h-3 w-3 text-yellow-400 mr-2" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div>
                <h5 className="font-medium mb-3 text-purple-400 flex items-center">
                  <Brain className="h-4 w-4 mr-2" />
                  ML Reasoning
                </h5>
                <ul className="space-y-2">
                  {prediction.reasoning.map((reason, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Missing Entities Alert */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
          Entities Not Observed (12+ Hours)
        </h3>
        
        <div className="space-y-4">
          {missingEntities.map((entity) => (
            <div key={entity.id} className="bg-gray-700 rounded-lg p-4 border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">{entity.name}</h4>
                  <p className="text-sm text-gray-400">{entity.type} • ID: {entity.id}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getRiskColor(entity.riskLevel)}`}>
                    {entity.riskLevel.toUpperCase()} RISK
                  </span>
                  <span className="text-sm text-gray-400">
                    Missing: {entity.duration}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Last Seen Location:</p>
                  <p className="text-blue-400 font-medium">{entity.location}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(entity.lastSeen).toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-2">Predicted Locations:</p>
                  <div className="space-y-1">
                    {entity.predictions.map((pred, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-300">{pred.location}</span>
                        <span className={getProbabilityColor(pred.probability)}>
                          {pred.probability}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PredictiveMonitoring;