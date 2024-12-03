import React from 'react';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { useMediaControls } from '../hooks/useMediaControls';

interface CallControlsProps {
  isConnected: boolean;
  onCall: () => void;
  onHangup: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
  isConnected,
  onCall,
  onHangup,
}) => {
  const {
    isVideoEnabled,
    isAudioEnabled,
    toggleVideo,
    toggleAudio,
  } = useMediaControls();

  const handleHangup = () => {
    onHangup();
  };

  return (
    <div className="flex items-center gap-4 bg-gray-800 p-4 rounded-lg">
      <button
        onClick={toggleVideo}
        className="p-3 rounded-full hover:bg-gray-700 transition-colors"
      >
        {isVideoEnabled ? (
          <Video className="w-6 h-6 text-white" />
        ) : (
          <VideoOff className="w-6 h-6 text-red-500" />
        )}
      </button>
      
      <button
        onClick={toggleAudio}
        className="p-3 rounded-full hover:bg-gray-700 transition-colors"
      >
        {isAudioEnabled ? (
          <Mic className="w-6 h-6 text-white" />
        ) : (
          <MicOff className="w-6 h-6 text-red-500" />
        )}
      </button>

      {isConnected ? (
        <button
          onClick={handleHangup}
          className="p-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
        >
          <PhoneOff className="w-6 h-6 text-white" />
        </button>
      ) : (
        <button
          onClick={onCall}
          className="p-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
        >
          <Phone className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
};