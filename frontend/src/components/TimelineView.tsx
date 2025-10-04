import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Clock, User, CreditCard, Wifi, BookOpen } from 'lucide-react';

interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'swipe' | 'wifi' | 'checkout' | 'booking' | 'helpdesk';
  location: string;
  description: string;
  confidence: number;
  source: string;
  entityId?: string;
}

const TimelineView: React.FC = () => {
  const [selectedEntity, setSelectedEntity] = useState('ST20001');
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [topPersons, setTopPersons] = useState<Array<{ person_id: string; first_seen?: string }>>([]);
  const [manualEntryEnabled, setManualEntryEnabled] = useState(false);
  const [manualEntity, setManualEntity] = useState('');

  

  // fetch top persons once on mount
  useEffect(() => {
    let mounted = true;
    const loadTop = async () => {
      try {
        const res = await fetch('http://localhost:3000/mysql/data/top-persons');
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        const list: Array<{ person_id: string; first_seen?: string }> = (json.top_persons || []).map((x: unknown) => {
          const row = x as Record<string, unknown>;
          return { person_id: String(row.person_id || ''), first_seen: row.first_seen ? String(row.first_seen) : undefined };
        });
        setTopPersons(list);
        if (list.length > 0) setSelectedEntity(list[0].person_id);
      } catch {
        // ignore
      }
    };
    loadTop();
    return () => { mounted = false; };
  }, []);

  // fetch timeline when selection or window changes
  useEffect(() => {
    let mounted = true;
    const fetchTimeline = async () => {
      setLoading(true);
      setError(null);
      try {
        const person = manualEntryEnabled && manualEntity ? manualEntity : selectedEntity;
        const params = new URLSearchParams({ person_id: person });
        const res = await fetch(`http://localhost:3000/mysql/activity-timeline?${params.toString()}`);
        if (!res.ok) throw new Error(`Server returned ${res.status}`);
        const json = await res.json();
        if (!mounted) return;
        const mapped: TimelineEvent[] = (json.timeline || []).map((item: unknown, idx: number): TimelineEvent => {
          const r = item as Record<string, unknown>;
          const entity_id = r.entity_id ? String(r.entity_id) : '';
          const person_id = r.person_id ? String(r.person_id) : '';
          const timestamp = r.timestamp ? String(r.timestamp) : '';
          const room_id = r.room_id ? String(r.room_id) : 'Unknown';
          const next_room = r.next_room ? String(r.next_room) : '';
          return {
            id: `${entity_id || person_id}_${idx}`,
            timestamp,
            type: next_room ? 'swipe' : 'wifi',
            location: room_id,
            description: next_room ? `Moved to ${next_room}` : 'Activity',
            confidence: 95,
            source: 'Imported',
            entityId: person_id || entity_id
          };
        });
        setTimeline(mapped);
      } catch {
        setError('Failed to fetch timeline');
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
    return () => { mounted = false; };
  }, [selectedEntity, manualEntryEnabled, manualEntity]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'swipe':
        return <CreditCard className="h-4 w-4" />;
      case 'wifi':
        return <Wifi className="h-4 w-4" />;
      case 'checkout':
        return <BookOpen className="h-4 w-4" />;
      case 'booking':
        return <Calendar className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'swipe':
        return 'bg-blue-600';
      case 'wifi':
        return 'bg-green-600';
      case 'checkout':
        return 'bg-purple-600';
      case 'booking':
        return 'bg-yellow-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 95) return 'text-green-400';
    if (confidence >= 90) return 'text-yellow-400';
    return 'text-red-400';
  };

  // Robust timestamp parser: handles ISO and common DD-MM-YYYY HH:mm[:ss] formats
  const parseTimestamp = (ts?: string): Date | null => {
    if (!ts) return null;
    // Try native parse first
    const d = new Date(ts);
    if (!isNaN(d.getTime())) return d;

    // Try DD-MM-YYYY HH:MM:SS or DD-MM-YYYY HH:MM
    const m = ts.match(/^(\d{2})-(\d{2})-(\d{4})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/);
    if (m) {
      const [, dd, mm, yyyy, hh, min, sec] = m;
      const iso = `${yyyy}-${mm}-${dd}T${hh.padStart(2, '0')}:${min}:${(sec||'00')}`;
      const d2 = new Date(iso);
      if (!isNaN(d2.getTime())) return d2;
    }

    // Last-ditch: replace space with T and try
    const alt = ts.replace(' ', 'T');
    const d3 = new Date(alt);
    if (!isNaN(d3.getTime())) return d3;
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Activity Timeline Generator</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Entity ID/Name</label>
            <select
              value={selectedEntity}
              onChange={(e) => { setSelectedEntity(e.target.value); setManualEntryEnabled(false); setManualEntity(''); }}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
            >
              {topPersons && topPersons.length > 0 ? (
                topPersons.map((p) => (
                  <option key={p.person_id} value={p.person_id}>{p.person_id}</option>
                ))
              ) : (
                <>
                  <option value="ST20001">John Doe (ST20001)</option>
                  <option value="SF5001">Sarah Johnson (SF5001)</option>
                </>
              )}
              <option value="__manual__">Other (manual)</option>
            </select>
            {(selectedEntity === '__manual__' || manualEntryEnabled) && (
              <input
                type="text"
                value={manualEntity}
                onChange={(e) => { setManualEntity(e.target.value); setManualEntryEnabled(true); setSelectedEntity('__manual__'); }}
                placeholder="Enter person_id (e.g. S10011)"
                className="mt-2 w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
              />
            )}
          </div>
          
          {/* Time Window removed - timeline shows full range for selected person */}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Timeline for {manualEntryEnabled && manualEntity ? manualEntity : selectedEntity}</h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            {loading ? (
              <span>Loading...</span>
            ) : error ? (
              <span className="text-red-400">{error}</span>
            ) : (
              <span>{timeline.length} events found</span>
            )}
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-600"></div>
          
          <div className="space-y-6">
            {timeline.map((event: TimelineEvent) => (
              <div key={event.id} className="relative flex items-start">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${getEventColor(event.type)} text-white relative z-10`}>
                  {getEventIcon(event.type)}
                </div>
                
                <div className="ml-4 flex-1 bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <span className="font-medium">{event.location}</span>
                    </div>
                    <span className="text-sm text-gray-400">
                        {/* Show full date and time for the event */}
                        <div className="text-right text-sm text-gray-400">
                          {(() => {
                            const d = parseTimestamp(event.timestamp);
                            if (!d) return event.timestamp || 'Unknown time';
                            // Show date on one line and time on the next (or combined depending on UI)
                            // We'll show like: "YYYY-MM-DD — h:mm:ss AM/PM"
                            try {
                              const datePart = d.toLocaleDateString();
                              const timePart = d.toLocaleTimeString();
                              return `${datePart} — ${timePart}`;
                            } catch {
                              return d.toString();
                            }
                          })()}
                        </div>
                    </span>
                  </div>
                  
                  <p className="text-gray-300 mb-2">{event.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Source: {event.source}</span>
                    <span className={`font-medium ${getConfidenceColor(event.confidence)}`}>
                      {event.confidence}% confidence
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default TimelineView;