export interface PeerState {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  peerId: string | null;
  remotePeerId: string;
  isConnected: boolean;
  error: string | null;
  activeUsers: Array<{ peerId: string; username: string }>;
  incomingCall: { from: string; caller: string } | null;
  setLocalStream: (stream: MediaStream | null) => void;
  setRemoteStream: (stream: MediaStream | null) => void;
  setPeerId: (id: string) => void;
  setRemotePeerId: (id: string) => void;
  setIsConnected: (connected: boolean) => void;
  setError: (error: string | null) => void;
  setActiveUsers: (users: Array<{ peerId: string; username: string }>) => void;
  setIncomingCall: (call: { from: string; caller: string } | null) => void;
}