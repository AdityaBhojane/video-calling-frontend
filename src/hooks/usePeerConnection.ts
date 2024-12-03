import { useEffect, useRef, useCallback } from 'react';
import Peer, { MediaConnection } from 'peerjs';
import { usePeerStore } from '../store/peerStore';
import { useMediaDevices } from './useMediaDevices';
import { useSocket } from './useSocket';

export const usePeerConnection = () => {
  const peerRef = useRef<Peer>();
  const callRef = useRef<MediaConnection>();
  const { requestUserMedia } = useMediaDevices();
  const { socket } = useSocket();
  
  const {
    setLocalStream,
    setRemoteStream,
    setPeerId,
    remotePeerId,
    setIsConnected,
    setError,
    localStream,
  } = usePeerStore();

  useEffect(() => {
    const initializePeer = async () => {
      try {
        const peer = new Peer();
        peerRef.current = peer;

        peer.on('open', (id) => {
          setPeerId(id);
        });

        peer.on('call', async (call) => {
          try {
            const stream = await requestUserMedia();
            if (!stream) {
              throw new Error('Failed to access media devices');
            }
            
            setLocalStream(stream);
            call.answer(stream);
            callRef.current = call;
            
            call.on('stream', (remoteStream) => {
              setRemoteStream(remoteStream);
              setIsConnected(true);
            });

            call.on('close', () => {
              setRemoteStream(null);
              setIsConnected(false);
            });
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to answer call');
          }
        });

        peer.on('error', (err) => {
          setError(err.message);
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize peer');
      }
    };

    initializePeer();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      peerRef.current?.destroy();
      setLocalStream(null);
      setRemoteStream(null);
      setIsConnected(false);
    };
  }, []);

  const startCall = async () => {
    try {
      if (!peerRef.current || !remotePeerId) return;

      const stream = await requestUserMedia();
      if (!stream) {
        throw new Error('Failed to access media devices');
      }

      setLocalStream(stream);
      const call = peerRef.current.call(remotePeerId, stream);
      callRef.current = call;

      call.on('stream', (remoteStream) => {
        setRemoteStream(remoteStream);
        setIsConnected(true);
      });

      call.on('close', () => {
        setRemoteStream(null);
        setIsConnected(false);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start call');
    }
  };

  const endCall = useCallback(() => {
    if (callRef.current) {
      callRef.current.close();
      socket?.emit('call:end', { to: remotePeerId });
    }
    
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    setRemoteStream(null);
    setIsConnected(false);
  }, [localStream, remotePeerId, socket]);

  return { startCall, endCall };
};