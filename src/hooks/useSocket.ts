import { useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { usePeerStore } from '../store/peerStore';

let socket: Socket | null = null;

export const useSocket = () => {
  const {
    peerId,
    setActiveUsers,
    setIncomingCall,
    setIsConnected,
    setRemoteStream,
    setLocalStream,
    localStream
  } = usePeerStore();

  useEffect(() => {
    if (!socket) {
      socket = io('https://video-calling-backend-test.onrender.com/');
    }

    if (peerId) {
      socket.emit('user:register', {
        peerId,
        username: `User-${peerId.slice(0, 4)}`
      });
    }

    socket.on('users:update', (users) => {
      setActiveUsers(users.filter(user => user.peerId !== peerId));
    });

    socket.on('call:incoming', ({ from, caller }) => {
      setIncomingCall({ from, caller });
    });

    socket.on('call:ended', () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      setLocalStream(null);
      setRemoteStream(null);
      setIsConnected(false);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [peerId]);

  const sendCallRequest = useCallback((toPeerId: string) => {
    if (socket && peerId) {
      socket.emit('call:request', { to: toPeerId, from: peerId });
    }
  }, [peerId]);

  return { sendCallRequest, socket };
};