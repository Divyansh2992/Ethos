import React, { useState } from 'react';
import { Search, User, CreditCard, Wifi, Mail, Hash, Eye } from 'lucide-react';

interface Entity {
  id: string;
  name: string;
  type: 'student' | 'staff' | 'device' | 'asset';
  confidence: number;
  identifiers: {
    student_id?: string;
    staff_id?: string;
    email?: string;
    card_id?: string;
    device_hash?: string;
    face_id?: string;
  };
  lastSeen: string;
  location?: string;
}

const EntityResolver: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<Entity | null>(null);
  const [resolvedEntities, setResolvedEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setLoading(true);
    setError(null);
    setSelectedEntity(null);
    try {
      const res = await fetch(`http://localhost:3000/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Search failed');
      const json = await res.json();
      const profiles = Array.isArray(json?.profiles) ? json.profiles : [];
      const mapped: Entity[] = profiles.map((p: any) => ({
        id: String(p.entity_id ?? p.id ?? ''),
        name: String(p.name ?? p.entity_id ?? 'Unknown'),
        type: (String(p.role ?? '').toLowerCase() as Entity['type']) || 'student',
        confidence: 95,
        identifiers: {
          student_id: p.student_id || undefined,
          staff_id: p.staff_id || undefined,
          email: p.email || undefined,
          card_id: p.card_id || undefined,
          device_hash: p.device_hash || undefined,
          face_id: p.face_id || undefined,
        },
        lastSeen: new Date().toISOString(),
        location: p.department || undefined,
      }));
      setResolvedEntities(mapped);
    } catch (e: any) {
      setError(e?.message || 'Search failed');
      setResolvedEntities([]);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'student':
      case 'staff':
        return <User className="h-4 w-4" />;
      case 'device':
        return <Wifi className="h-4 w-4" />;
      case 'asset':
        return <Hash className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Entity Resolution Search</h2>
        
        <div className="flex space-x-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, ID, email, card number, or device hash..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>{loading ? 'Searching...' : 'Resolve'}</span>
          </button>
        </div>

        {error && (
          <div className="mb-4 text-red-400 text-sm">{error}</div>
        )}

        {resolvedEntities.length > 0 && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {resolvedEntities.map((entity) => (
              <div
                key={entity.id}
                className="bg-gray-700 rounded-lg p-4 border border-gray-600 cursor-pointer hover:border-blue-400 transition-colors"
                onClick={() => { setSelectedEntity(entity); setResolvedEntities([entity]); }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(entity.type)}
                    <h3 className="font-semibold">{entity.name}</h3>
                  </div>
                  <span className={`text-sm font-medium ${getConfidenceColor(entity.confidence)}`}>
                    {entity.confidence}% confidence
                  </span>
                  
                </div>
               <div className="mt-2 flex items-start gap-6">
                <div className="flex-1 space-y-2 text-sm text-gray-300">
                  {Object.entries(entity.identifiers).map(([key, value]) => (
                    value && (
                      <div key={key} className="flex items-center space-x-2">
                        {key === 'email' && <Mail className="h-3 w-3" />}
                        {key === 'card_id' && <CreditCard className="h-3 w-3" />}
                        {key === 'device_hash' && <Wifi className="h-3 w-3" />}
                        {key === 'face_id' && <Eye className="h-3 w-3" />}
                        {!['email', 'card_id', 'device_hash', 'face_id'].includes(key) && <Hash className="h-3 w-3" />}
                        <span className="capitalize">{key.replace('_', ' ')}: {value}</span>
                        
                      </div>

                    )
                  ))}
               </div>
               {entity.identifiers.face_id && (
                 <div className="w-28 md:w-36 lg:w-40 shrink-0">
                   <img
                     src={`http://localhost:3000/face/${encodeURIComponent(entity.identifiers.face_id)}`}
                     alt="face"
                     className="rounded border border-gray-600 w-full h-36 object-cover"
                   />
                 </div>
               )}
               </div>
               {entity.location && (
                 <div className="mt-3 text-blue-400 text-sm">
                   <span>Last seen: {entity.location}</span>
                 </div>
               )}
               </div>
            ))}
          </div>
        )}
      </div>

      {selectedEntity && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4">Entity Details: {selectedEntity.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-blue-400">Cross-Source Identifiers</h3>
              <div className="space-y-3">
                {Object.entries(selectedEntity.identifiers).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex justify-between p-2 bg-gray-700 rounded">
                      <span className="capitalize">{key.replace('_', ' ')}</span>
                      <span className="font-mono text-sm">{value}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3 text-green-400">Activity Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between p-2 bg-gray-700 rounded">
                  <span>Entity Type</span>
                  <span className="capitalize">{selectedEntity.type}</span>
                </div>
                <div className="flex justify-between p-2 bg-gray-700 rounded">
                  <span>Resolution Confidence</span>
                  <span className={getConfidenceColor(selectedEntity.confidence)}>
                    {selectedEntity.confidence}%
                  </span>
                </div>
                <div className="flex justify-between p-2 bg-gray-700 rounded">
                  <span>Last Activity</span>
                  <span>{new Date(selectedEntity.lastSeen).toLocaleString()}</span>
                </div>
                {selectedEntity.location && (
                  <div className="flex justify-between p-2 bg-gray-700 rounded">
                    <span>Current Location</span>
                    <span className="text-blue-400">{selectedEntity.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntityResolver;