export interface MediaDeviceInfo {
  hasVideo: boolean;
  hasAudio: boolean;
  videoDevices: MediaDeviceInfo[];
  audioDevices: MediaDeviceInfo[];
}

export const getMediaDevices = async (): Promise<MediaDeviceInfo> => {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    
    const videoDevices = devices.filter(device => device.kind === 'videoinput');
    const audioDevices = devices.filter(device => device.kind === 'audioinput');

    // Check permissions individually for available devices
    if (videoDevices.length > 0) {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
      } catch (error) {
        console.warn('Video permission denied:', error);
      }
    }

    if (audioDevices.length > 0) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch (error) {
        console.warn('Audio permission denied:', error);
      }
    }

    return {
      hasVideo: videoDevices.length > 0,
      hasAudio: audioDevices.length > 0,
      videoDevices,
      audioDevices,
    };
  } catch (error) {
    console.error('Error checking media devices:', error);
    return {
      hasVideo: false,
      hasAudio: false,
      videoDevices: [],
      audioDevices: [],
    };
  }
};

export const getUserMedia = async (
  videoEnabled: boolean = true,
  audioEnabled: boolean = true
): Promise<MediaStream | null> => {
  try {
    const devices = await getMediaDevices();
    
    // Only request media types that are available
    const constraints: MediaStreamConstraints = {};
    
    if (videoEnabled && devices.hasVideo) {
      constraints.video = true;
    }
    
    if (audioEnabled && devices.hasAudio) {
      constraints.audio = true;
    }

    // If no devices are available or enabled, return null
    if (Object.keys(constraints).length === 0) {
      return null;
    }

    return await navigator.mediaDevices.getUserMedia(constraints);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to access media devices: ${error.message}`);
    }
    throw new Error('Failed to access media devices');
  }
};