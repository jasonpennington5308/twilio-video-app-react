import React, { useCallback, useState, useEffect } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
//import useLocalTracks from '../../VideoProvider/useLocalTracks/useLocalTracks';

export default function ChooseDeviceOptions() {
  const {
    room: { localParticipant },
    localTracks,
    getLocalVideoTrack,
  } = useVideoContext();

  //const { getLocalAudioTrack } = useLocalTracks();
  const videoTrack = localTracks.find(track => track.name === 'camera');
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
      setMediaDevices(mediaDevices);
    });
  }, []);

  const toggleCameraMode = useCallback(
    event => {
      const localTrackPublication = localParticipant?.unpublishTrack(videoTrack!);
      // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
      localParticipant?.emit('trackUnpublished', localTrackPublication);
      videoTrack!.stop();

      const videoConstraints = { exact: event.target.value };

      getLocalVideoTrack(videoConstraints).then(newVideoTrack => {
        localParticipant?.publishTrack(newVideoTrack, { priority: 'low' });
      });
    },
    [getLocalVideoTrack, localParticipant, videoTrack]
  );

  // const audioTrack = localTracks.find(track => track.name === 'microphone');
  // const toggleMicroponeMode = useCallback(
  //   event => {
  //     const localTrackPublication = localParticipant?.unpublishTrack(audioTrack!);
  //     // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
  //     localParticipant?.emit('trackUnpublished', localTrackPublication);
  //     audioTrack!.stop();

  //     const constraints = { exact: event.target.value };

  //     getLocalAudioTrack(constraints).then(newAudioTrack => {
  //       console.log('new audio track');
  //       console.log(newAudioTrack);
  //       localParticipant?.publishTrack(newAudioTrack, { priority: 'low' });
  //     });
  //   },
  //   [getLocalVideoTrack, localParticipant, audioTrack]
  // );

  return (
    <div>
      {/*
      <Select>
        {mediaDevices
          .filter(x => x.kind === 'audiooutput')
          .map(mediaDevice => (
            <MenuItem key={mediaDevice.deviceId} value={mediaDevice.deviceId}>
              {mediaDevice.label}
            </MenuItem>
          ))}
      </Select>
      <Select onChange={toggleMicroponeMode}>
        {mediaDevices
          .filter(x => x.kind === 'audioinput')
          .map(mediaDevice => (
            <MenuItem
              selected={mediaDevice.label === audioTrack?.mediaStreamTrack.label}
              key={mediaDevice.deviceId}
              value={mediaDevice.deviceId}
            >
              {mediaDevice.label}
            </MenuItem>
          ))}
      </Select>
      */}
      <Select onChange={toggleCameraMode}>
        {mediaDevices
          .filter(x => x.kind === 'videoinput')
          .map(mediaDevice => (
            <MenuItem
              selected={mediaDevice.label === videoTrack?.mediaStreamTrack.label}
              key={mediaDevice.deviceId}
              value={mediaDevice.deviceId}
            >
              {mediaDevice.label}
            </MenuItem>
          ))}
      </Select>
    </div>
  );
}
