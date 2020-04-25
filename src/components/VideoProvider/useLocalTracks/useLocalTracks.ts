import { useCallback, useEffect, useState } from 'react';
import Video, { LocalVideoTrack, LocalAudioTrack, CreateLocalTrackOptions } from 'twilio-video';

// This function ensures that the user has granted the browser permission to use audio and video
// devices. If permission has not been granted, it will cause the browser to ask for permission
// for audio and video at the same time (as opposed to separate requests).
function ensureMediaPermissions() {
  return navigator.mediaDevices
    .enumerateDevices()
    .then(devices => devices.every(device => !(device.deviceId && device.label)))
    .then(shouldAskForMediaPermissions => {
      if (shouldAskForMediaPermissions) {
        navigator.mediaDevices
          .getUserMedia({ audio: true, video: true })
          .then(mediaStream => mediaStream.getTracks().forEach(track => track.stop()));
      }
    });
}

export function useLocalAudioTrack() {
  const [track, setTrack] = useState<LocalAudioTrack>();

  const getLocalAudioTrack = useCallback((deviceId?: CreateLocalTrackOptions['deviceId']) => {
    const options: CreateLocalTrackOptions = {
      name: 'microphone',
    };

    if (deviceId) {
      options.deviceId = deviceId;
    }

    return ensureMediaPermissions().then(() =>
      Video.createLocalAudioTrack(options).then(newTrack => {
        setTrack(newTrack);
        return newTrack;
      })
    );
  }, []);

  useEffect(() => {
    // We get a new local video track when the app loads.
    getLocalAudioTrack();
  }, [getLocalAudioTrack]);

  useEffect(() => {
    const handleStopped = () => setTrack(undefined);
    if (track) {
      track.on('stopped', handleStopped);
      return () => {
        track.off('stopped', handleStopped);
      };
    }
  }, [track]);

  return [track, getLocalAudioTrack] as const;
}

export function useLocalVideoTrack() {
  const [track, setTrack] = useState<LocalVideoTrack>();

  const getLocalVideoTrack = useCallback((
    //facingMode?: CreateLocalTrackOptions['facingMode'],
    deviceId?: CreateLocalTrackOptions['deviceId']
  ) => {
    const options: CreateLocalTrackOptions = {
      frameRate: 24,
      height: 720,
      width: 1280,
      name: 'camera',
    };

    // if (facingMode) {
    //   options.facingMode = facingMode;
    // }

    if (deviceId) {
      options.deviceId = deviceId;
    }

    return ensureMediaPermissions().then(() =>
      Video.createLocalVideoTrack(options).then(newTrack => {
        setTrack(newTrack);
        return newTrack;
      })
    );
  }, []);

  useEffect(() => {
    // We get a new local video track when the app loads.
    getLocalVideoTrack();
  }, [getLocalVideoTrack]);

  useEffect(() => {
    const handleStopped = () => setTrack(undefined);
    if (track) {
      track.on('stopped', handleStopped);
      return () => {
        track.off('stopped', handleStopped);
      };
    }
  }, [track]);

  return [track, getLocalVideoTrack] as const;
}

export default function useLocalTracks() {
  const [audioTrack, getLocalAudioTrack] = useLocalAudioTrack();
  const [videoTrack, getLocalVideoTrack] = useLocalVideoTrack();

  const localTracks = [audioTrack, videoTrack].filter(track => track !== undefined) as (
    | LocalAudioTrack
    | LocalVideoTrack
  )[];

  return { localTracks, getLocalVideoTrack, getLocalAudioTrack };
}
