import React from 'react';
import { usePeerStore } from '../store/peerStore';

interface IncomingCallProps {
  onAccept: (peerId: string) => void;
  onReject: () => void;
}

export const IncomingCall: React.FC<IncomingCallProps> = ({
  onAccept,
  onReject,
}) => {
  const { incomingCall, setIncomingCall } = usePeerStore();

  if (!incomingCall) return null;

  const handleReject = () => {
    setIncomingCall(null);
    onReject();
  };

  const handleAccept = () => {
    onAccept(incomingCall.from);
    setIncomingCall(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h3 className="text-xl font-semibold mb-4">
          Incoming call from {incomingCall.caller}
        </h3>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleReject}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded"
          >
            Reject
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};