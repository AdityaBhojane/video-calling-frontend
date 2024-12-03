import { useState, useEffect } from 'react';
import { getMediaDevices, getUserMedia, MediaDeviceInfo } from '../utils/mediaDevices';

export const useMediaDevices = () => {
  const [devices, setDevices] = useState<MediaDeviceInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDevices = async () => {
      try {
        setIsLoading(true);
        const mediaDevices = await getMediaDevices();
        
        // Only set error if no devices are available at all
        if (!mediaDevices.hasVideo && !mediaDevices.hasAudio) {
          setError('No media devices found');
        } else {
          setError(null);
        }
        
        setDevices(mediaDevices);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize media devices');
        setDevices(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDevices();

    const handleDeviceChange = () => {
      initializeDevices();
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, []);

  const requestUserMedia = async (videoEnabled: boolean = true, audioEnabled: boolean = true) => {
    try {
      const stream = await getUserMedia(videoEnabled, audioEnabled);
      if (!stream && videoEnabled && audioEnabled) {
        setError('No media devices available');
      }
      return stream;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to access media devices');
      return null;
    }
  };

  return {
    devices,
    error,
    isLoading,
    requestUserMedia,
  };
};