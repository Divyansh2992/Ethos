import React, { useState } from 'react';
import { Brain, TrendingUp, AlertCircle, CheckCircle, MapPin, Target, BarChart3, Activity } from 'lucide-react';
import Plot from 'react-plotly.js';


const PredictiveMonitoring: React.FC = () => {
  // Use real entity IDs (match mockPredictions / missingEntities) so selection drives the shown prediction
  const [selectedEntity, setSelectedEntity] = useState('S68445');
  const [predictionTime, setPredictionTime] = useState('current');

  const getPredictionsForTime = (timeWindow: string) => {
    const predictions = {
      'current': {
        'S68445': {
          entityId: 'S68445',
          entityName: 'Rohan Gupta',
          predictedLocation: 'Engineering Building - Lab 204',
          probability: 87.3,
          timeWindow: 'Current',
          reasoning: [
            'Currently in Engineering Building based on last WiFi connection',
            'Lab session in progress - high probability of remaining in current location',
            'No movement indicators detected in the last 30 minutes',
            'Historical pattern shows 90% probability of staying in lab during active sessions'
          ],
          confidence: 87.3,
          missingDataPoints: ['Real-time location verification', 'Active session status']
        },
        'S34050': {
          entityId: 'S34050',
          entityName: 'Priya Kumar',
          predictedLocation: 'Library - Study Room 105',
          probability: 78.5,
          timeWindow: 'Current',
          reasoning: [
            'Last observed in Library Study Room 105',
            'Study session likely ongoing based on historical patterns',
            'No exit indicators from library access system',
            'High probability of continued study session'
          ],
          confidence: 78.5,
          missingDataPoints: ['Current study session status', 'Library exit logs']
        },
        'S51234': {
          entityId: 'S51234',
          entityName: 'Aarav Singh',
          predictedLocation: 'Student Center - Lounge B',
          probability: 83.7,
          timeWindow: 'Current',
          reasoning: [
            'Last WiFi ping near Student Center Lounge B',
            'Break between classes aligns with lounge visits',
            'Calendar shows no conflicting classes in the next hour',
            'Historical pattern: 80% chance of staying in lounge during breaks'
          ],
          confidence: 83.7,
          missingDataPoints: ['Class schedule change updates', 'Recent access logs']
        }
      },
      '1hour': {
        'S68445': {
          entityId: 'S68445',
          entityName: 'Rohan Gupta',
          predictedLocation: 'Engineering Building - Lab 204',
          probability: 82.1,
          timeWindow: 'Next 4 Hours',
          reasoning: [
            'Lab session expected to continue for the next 2-3 hours',
            'Historical pattern shows 85% probability of remaining in lab',
            'No conflicting appointments or meetings scheduled',
            'Previous week showed consistent lab attendance pattern'
          ],
          confidence: 82.1,
          missingDataPoints: ['Session end time confirmation', 'Next appointment status']
        },
        'S34050': {
          entityId: 'S34050',
          entityName: 'Priya Kumar',
          predictedLocation: 'Student Center Cafeteria',
          probability: 68.3,
          timeWindow: 'Next 4 Hours',
          reasoning: [
            'Study session expected to conclude within the next hour',
            'Historical pattern shows movement to cafeteria after study',
            'Lunch time approaching - high probability of food court visit',
            'Previous behavior indicates post-study meal routine'
          ],
          confidence: 68.3,
          missingDataPoints: ['Study session end time', 'Meal schedule']
        },
        'S51234': {
          entityId: 'S51234',
          entityName: 'Aarav Singh',
          predictedLocation: 'Student Center - Lounge B',
          probability: 70.4,
          timeWindow: 'Next 4 Hours',
          reasoning: [
            'Break block covers most of the next 3 hours',
            'High probability of staying around Student Center before next class',
            'No meetings on calendar during this window',
            'Previous weeks show similar mid-day lounge dwell time'
          ],
          confidence: 70.4,
          missingDataPoints: ['Next class room confirmation', 'Presence check-in']
        }
      },
      '2hours': {
        'S68445': {
          entityId: 'S68445',
          entityName: 'Rohan Gupta',
          predictedLocation: 'Engineering Building - Lab 204',
          probability: 75.4,
          timeWindow: 'Next 8 Hours',
          reasoning: [
            'Lab session expected to end within the next 6 hours',
            'Historical pattern shows 75% probability of remaining in lab',
            'Possible transition to study area or library',
            'Previous week showed consistent lab attendance pattern'
          ],
          confidence: 75.4,
          missingDataPoints: ['Session end time', 'Next activity schedule']
        },
        'S34050': {
          entityId: 'S34050',
          entityName: 'Priya Kumar',
          predictedLocation: 'Student Center Cafeteria',
          probability: 65.2,
          timeWindow: 'Next 8 Hours',
          reasoning: [
            'Activity in Student Center expected for the next 2-3 hours, then transition',
            'Historical evening patterns show cafeteria visit',
            'Moderate likelihood of returning to dormitory after meal',
            'Previous behavior indicates post-study meal routine'
          ],
          confidence: 65.2,
          missingDataPoints: ['Study session end time', 'Evening schedule']
        },
        'S51234': {
          entityId: 'S51234',
          entityName: 'Aarav Singh',
          predictedLocation: 'Library - Quiet Zone',
          probability: 66.8,
          timeWindow: 'Next 8 Hours',
          reasoning: [
            'Likely transition to Library for afternoon study session',
            'Past behavior shows library visit after Student Center break',
            'No evening labs scheduled',
            'Study group meets in Library on similar days'
          ],
          confidence: 66.8,
          missingDataPoints: ['Study group confirmation', 'Seat reservation logs']
        }
      },
      '4hours': {
        'S68445': {
          entityId: 'S68445',
          entityName: 'Rohan Gupta',
          predictedLocation: 'Library - Study Area',
          probability: 58.7,
          timeWindow: 'Next 12 Hours',
          reasoning: [
            'Lab session expected to conclude within the next 10 hours',
            'Historical pattern shows transition to library study',
            'Evening study session likely in library',
            'Previous week showed consistent study patterns'
          ],
          confidence: 58.7,
          missingDataPoints: ['Evening schedule', 'Study preferences']
        },
        'S34050': {
          entityId: 'S34050',
          entityName: 'Priya Kumar',
          predictedLocation: 'Dormitory Building A',
          probability: 72.1,
          timeWindow: 'Next 12 Hours',
          reasoning: [
            'Return to dormitory expected within the next 6-8 hours',
            'Historical evening patterns show return to dormitory',
            'High probability of evening rest and study in room',
            'Previous behavior indicates dormitory return pattern'
          ],
          confidence: 72.1,
          missingDataPoints: ['Evening schedule', 'Dormitory access patterns']
        },
        'S51234': {
          entityId: 'S51234',
          entityName: 'Aarav Singh',
          predictedLocation: 'Dormitory Building B',
          probability: 61.2,
          timeWindow: 'Next 12 Hours',
          reasoning: [
            'Evening pattern shows return to dormitory after study',
            'No late-night activities on calendar',
            'Meal break likely before heading back to dorm',
            'Consistent dorm return time on previous weeks'
          ],
          confidence: 61.2,
          missingDataPoints: ['Dinner reservation logs', 'Dorm access events']
        }
      }
    };

    return predictions[timeWindow as keyof typeof predictions] || predictions['current'];
  };

  const missingEntities = [
    {
      id: 'S34050',
      name: 'Priya Kumar',
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
      id: 'S51234',
      name: 'Aarav Singh',
      type: 'Student',
      lastSeen: '2024-01-15T11:20:00Z',
      location: 'Student Center - Lounge B',
      duration: '6 hours',
      riskLevel: 'medium',
      predictions: [
        { location: 'Library - Quiet Zone', probability: 66.8 },
        { location: 'Student Center - Lounge B', probability: 23.1 },
        { location: 'Dormitory Building B', probability: 10.1 }
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

  // Chart data preparation
  const getProbabilityChartData = () => {
    const predictions = getPredictionsForTime(predictionTime);
    const current = predictions[selectedEntity as keyof typeof predictions];
    if (!current) return null;

    const locations = [
      { name: current.predictedLocation, probability: current.probability },
      { name: 'Alternative Location 1', probability: 100 - current.probability - 5 },
      { name: 'Alternative Location 2', probability: 3 },
      { name: 'Other Locations', probability: 2 }
    ];

    return {
      data: [{
        x: locations.map(l => l.name),
        y: locations.map(l => l.probability),
        type: 'bar' as const,
        marker: {
          color: locations.map(l => 
            l.probability >= 80 ? '#10b981' : 
            l.probability >= 60 ? '#f59e0b' : '#ef4444'
          )
        }
      }],
      layout: {
        title: { text: `Location Probability Distribution - ${current.entityName}` },
        xaxis: { title: { text: 'Predicted Locations' } },
        yaxis: { title: { text: 'Probability (%)' } },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e5e7eb' },
        margin: { t: 50, b: 100, l: 50, r: 50 }
      }
    };
  };

  const getLocationDistributionData = () => {
    // Mock location distribution data for the selected entity
    const locationData = {
      'S68445': [
        { label: 'Engineering Building', value: 45 },
        { label: 'Library', value: 25 },
        { label: 'Student Center', value: 15 },
        { label: 'Dormitory', value: 10 },
        { label: 'Other', value: 5 }
      ],
      'S34050': [
        { label: 'Library', value: 50 },
        { label: 'Dormitory', value: 25 },
        { label: 'Student Center', value: 15 },
        { label: 'Engineering Building', value: 7 },
        { label: 'Other', value: 3 }
      ],
      'S51234': [
        { label: 'Student Center', value: 40 },
        { label: 'Library', value: 30 },
        { label: 'Engineering Building', value: 15 },
        { label: 'Dormitory', value: 10 },
        { label: 'Other', value: 5 }
      ]
    };

    const data = locationData[selectedEntity as keyof typeof locationData] || locationData['S68445'];

    return {
      data: [{
        labels: data.map(d => d.label),
        values: data.map(d => d.value),
        type: 'pie' as const,
        marker: {
          colors: ['#4a9eff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']
        },
        textinfo: 'label+percent' as const,
        textposition: 'outside' as const
      }],
      layout: {
        title: { text: 'Location Distribution' },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e5e7eb' },
        margin: { t: 50, b: 50, l: 50, r: 50 },
        showlegend: true,
        legend: {
          orientation: 'v' as const,
          x: 1.05,
          y: 0.5
        }
      }
    };
  };

  const getConfidenceTrendData = () => {
    // Mock confidence trend over time - changes based on prediction time
    const timeData = {
      'current': {
        hours: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        confidence: [75, 78, 85, 87, 82, 80],
        title: 'Prediction Confidence Trend (24h)'
      },
      '1hour': {
        hours: ['Now', '+1hr', '+2hr', '+3hr', '+4hr'],
        confidence: [87, 85, 82, 78, 75],
        title: 'Prediction Confidence Trend (Next 4 Hours)'
      },
      '2hours': {
        hours: ['Now', '+2hr', '+4hr', '+6hr', '+8hr'],
        confidence: [87, 84, 80, 76, 72],
        title: 'Prediction Confidence Trend (Next 8 Hours)'
      },
      '4hours': {
        hours: ['Now', '+3hr', '+6hr', '+9hr', '+12hr'],
        confidence: [87, 82, 75, 68, 62],
        title: 'Prediction Confidence Trend (Next 12 Hours)'
      }
    };

    const currentTimeData = timeData[predictionTime as keyof typeof timeData] || timeData['current'];

    return {
      data: [{
        x: currentTimeData.hours,
        y: currentTimeData.confidence,
        type: 'scatter' as const,
        mode: 'lines+markers' as const,
        fill: 'tonexty' as const,
        line: { color: '#10b981', width: 3 },
        marker: { size: 8, color: '#10b981' }
      }],
      layout: {
        title: { text: currentTimeData.title },
        xaxis: { title: { text: 'Time' } },
        yaxis: { title: { text: 'Confidence (%)' } },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e5e7eb' },
        margin: { t: 50, b: 50, l: 50, r: 50 }
      }
    };
  };

  const getLocationHeatmapData = () => {
    // Mock location activity heatmap - changes based on prediction time
    const locations = ['Library', 'Engineering', 'Student Center', 'Dormitory', 'Lab A', 'Lab B'];
    
    const timeData = {
      'current': {
        times: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
        title: 'Campus Activity Heatmap (24h)'
      },
      '1hour': {
        times: ['Now', '+1hr', '+2hr', '+3hr', '+4hr'],
        title: 'Campus Activity Heatmap (Next 4 Hours)'
      },
      '2hours': {
        times: ['Now', '+2hr', '+4hr', '+6hr', '+8hr'],
        title: 'Campus Activity Heatmap (Next 8 Hours)'
      },
      '4hours': {
        times: ['Now', '+3hr', '+6hr', '+9hr', '+12hr'],
        title: 'Campus Activity Heatmap (Next 12 Hours)'
      }
    };

    const currentTimeData = timeData[predictionTime as keyof typeof timeData] || timeData['current'];
    
    // Generate mock heatmap data with slight variations based on time
    const z = locations.map((_, i) => 
      currentTimeData.times.map((_, j) => {
        const baseActivity = [85, 70, 60, 75, 90, 55][i]; // Base activity per location
        const timeModifier = [0.8, 0.9, 1.0, 1.1, 1.0, 0.7][j]; // Time-based modifier
        return Math.floor(baseActivity * timeModifier + Math.random() * 10);
      })
    );

    return {
      data: [{
        z: z,
        x: currentTimeData.times,
        y: locations,
        type: 'heatmap' as const,
        colorscale: 'Viridis'
      }],
      layout: {
        title: { text: currentTimeData.title },
        xaxis: { title: { text: 'Time' } },
        yaxis: { title: { text: 'Locations' } },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#e5e7eb' },
        margin: { t: 50, b: 50, l: 100, r: 50 }
      }
    };
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
              {/* option values are the actual entity IDs used in mock data */}
              <option value="S68445">Rohan Gupta (S68445)</option>
              <option value="S34050">Priya Kumar (S34050)</option>
              <option value="S51234">Aarav Singh (S51234)</option>
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
              <option value="1hour">+4 Hour</option>
              <option value="2hours">+8 Hours</option>
              <option value="4hours">+12 Hours</option>
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
        
        {/* Show only the prediction for the currently selected entity */}
        {(() => {
          const predictions = getPredictionsForTime(predictionTime);
          const current = predictions[selectedEntity as keyof typeof predictions];
          if (!current) {
            return (
              <div className="p-4 text-gray-400">No predictions available for the selected entity.</div>
            );
          }

          const prediction = current;
          return (
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
          );
        })()}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Probability Distribution Chart */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BarChart3 className="h-5 w-5 text-blue-400 mr-2" />
            Probability Distribution
          </h3>
          {getProbabilityChartData() && (
            <Plot
              data={getProbabilityChartData()!.data}
              layout={getProbabilityChartData()!.layout}
              style={{ width: '100%', height: '300px' }}
              config={{ displayModeBar: false }}
            />
          )}
        </div>

        {/* Location Distribution Pie Chart */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="h-5 w-5 text-purple-400 mr-2" />
            Location Distribution
          </h3>
          <Plot
            data={getLocationDistributionData().data}
            layout={getLocationDistributionData().layout}
            style={{ width: '100%', height: '300px' }}
            config={{ displayModeBar: false }}
          />
        </div>

        {/* Confidence Trend Chart */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 text-green-400 mr-2" />
            Confidence Trend
          </h3>
          <Plot
            data={getConfidenceTrendData().data}
            layout={getConfidenceTrendData().layout}
            style={{ width: '100%', height: '300px' }}
            config={{ displayModeBar: false }}
          />
        </div>

        {/* Location Heatmap */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <MapPin className="h-5 w-5 text-orange-400 mr-2" />
            Activity Heatmap
          </h3>
          <Plot
            data={getLocationHeatmapData().data}
            layout={getLocationHeatmapData().layout}
            style={{ width: '100%', height: '300px' }}
            config={{ displayModeBar: false }}
          />
        </div>
      </div>

      {/* Missing Entities Alert (disabled) */}
      {false && (
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
      )}
    </div>
  );
};

export default PredictiveMonitoring;