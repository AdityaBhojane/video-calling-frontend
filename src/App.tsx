import React from 'react';
import { usePeerConnection } from './hooks/usePeerConnection';
import { usePeerStore } from './store/peerStore';
import { useMediaDevices } from './hooks/useMediaDevices';
import { VideoPlayer } from './components/VideoPlayer';
import { CallControls } from './components/CallControls';
import { ActiveUsers } from './components/ActiveUsers';
import { IncomingCall } from './components/IncomingCall';
import { useSocket } from './hooks/useSocket';

function App() {
  const { startCall, endCall } = usePeerConnection();
  const { devices, error: deviceError, isLoading } = useMediaDevices();
  const {
    peerId,
    remotePeerId,
    setRemotePeerId,
    localStream,
    remoteStream,
    isConnected,
    error: peerError
  } = usePeerStore();

  const error = deviceError || peerError;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-xl">Checking media devices...</p>
      </div>
    );
  }

  if (devices && !devices.hasVideo && !devices.hasAudio) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">No Media Devices Found</h2>
            <p>Please connect a camera or microphone to use this application.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Video Call App</h1>
          <ActiveUsers />
          
          {devices && (
            <div className="mb-4 text-sm">
              <p>Available devices:</p>
              <ul className="list-disc list-inside ml-4">
                {devices.hasVideo && <li>Camera</li>}
                {devices.hasAudio && <li>Microphone</li>}
              </ul>
            </div>
          )}
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <p className="mb-2">Your ID: <span className="font-mono">{peerId || 'Connecting...'}</span></p>
            <div className="flex gap-4">
              <input
                type="text"
                value={remotePeerId}
                onChange={(e) => setRemotePeerId(e.target.value)}
                placeholder="Enter peer ID to call"
                className="flex-1 px-4 py-2 rounded bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <VideoPlayer
              stream={localStream}
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded">
              You
            </div>
          </div>
          <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden">
            <VideoPlayer
              stream={remoteStream}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded">
              Remote
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <CallControls
            isConnected={isConnected}
            onCall={startCall}
            onHangup={endCall}
          />
        </div>
      </div>
      
      <IncomingCall
        onAccept={(peerId) => {
          setRemotePeerId(peerId);
          startCall();
        }}
        onReject={() => {}}
      />
    </div>
  );
}

export default App;