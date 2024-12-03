import { create } from 'zustand';
import { PeerState } from '../types/peer';

export const usePeerStore = create<PeerState>((set) => ({
  localStream: null,
  remoteStream: null,
  peerId: null,
  remotePeerId: '',
  isConnected: false,
  error: null,
  activeUsers: [],
  incomingCall: null,
  setLocalStream: (stream) => set({ localStream: stream }),
  setRemoteStream: (stream) => set({ remoteStream: stream }),
  setPeerId: (id) => set({ peerId: id }),
  setRemotePeerId: (id) => set({ remotePeerId: id }),
  setIsConnected: (connected) => set({ isConnected: connected }),
  setError: (error) => set({ error }),
  setActiveUsers: (users) => set({ activeUsers: users }),
  setIncomingCall: (call) => set({ incomingCall: call }),
}));