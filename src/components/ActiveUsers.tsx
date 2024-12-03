import React from 'react';
import { usePeerStore } from '../store/peerStore';
import { useSocket } from '../hooks/useSocket';

export const ActiveUsers: React.FC = () => {
  const { activeUsers } = usePeerStore();
  const { sendCallRequest } = useSocket();

  return (
    <div className="bg-gray-800 p-4 rounded-lg mb-4">
      <h2 className="text-xl font-semibold mb-3">Active Users</h2>
      {activeUsers.length === 0 ? (
        <p className="text-gray-400">No active users</p>
      ) : (
        <ul className="space-y-2">
          {activeUsers.map((user) => (
            <li
              key={user.peerId}
              className="flex items-center justify-between p-2 hover:bg-gray-700 rounded"
            >
              <span>{user.username}</span>
              <button
                onClick={() => sendCallRequest(user.peerId)}
                className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded text-sm"
              >
                Call
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};