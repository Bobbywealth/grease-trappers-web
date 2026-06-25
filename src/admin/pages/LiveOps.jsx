import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Activity, RefreshCw } from 'lucide-react';
import { apiGet } from '../lib/api';

export default function LiveOps() {
  const [active, setActive] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
    const t = setInterval(load, 30000);
    return () => clearInterval(t);
  }, []);

  const load = async () => {
    try {
      const [activeData, shiftsData] = await Promise.all([
        apiGet('/api/locations/active'),
        apiGet('/api/time-clock'),
      ]);
      setActive(activeData);
      setShifts(shiftsData.slice(0, 10));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-500" />
            Live Operations
          </h1>
          <p className="text-sm text-gray-500 mt-1">Real-time view of who is clocked in and where</p>
        </div>
        <button onClick={load} className="btn-secondary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="card p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Currently Clocked In ({active.length})</h2>
        {loading && active.length === 0 ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : active.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No one is currently clocked in.</p>
            <p className="text-xs text-gray-400 mt-1">Employee app will show their status when they sign in.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {active.map(emp => (
              <div key={emp.user_id} className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-blue-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {emp.name?.[0]?.toUpperCase() || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{emp.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{emp.role}</div>
                  {emp.lat && (
                    <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      Last ping: {new Date(emp.last_ping_at).toLocaleTimeString()}
                    </div>
                  )}
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Shifts</h2>
        {shifts.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">No shifts recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-3 py-2">Employee</th>
                  <th className="px-3 py-2">Clock In</th>
                  <th className="px-3 py-2">Clock Out</th>
                  <th className="px-3 py-2">Hours</th>
                  <th className="px-3 py-2">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {shifts.map(s => (
                  <tr key={s.id} className="text-sm">
                    <td className="px-3 py-2 font-medium">{s.user_name}</td>
                    <td className="px-3 py-2 text-gray-600">{new Date(s.clock_in_at).toLocaleString()}</td>
                    <td className="px-3 py-2 text-gray-600">
                      {s.clock_out_at ? new Date(s.clock_out_at).toLocaleString() : <span className="badge badge-green">Active</span>}
                    </td>
                    <td className="px-3 py-2 font-medium">{s.total_hours || '—'}</td>
                    <td className="px-3 py-2 text-xs text-gray-500">
                      {s.clock_in_address || (s.clock_in_lat ? `${s.clock_in_lat.toFixed(4)}, ${s.clock_in_lng.toFixed(4)}` : '—')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}