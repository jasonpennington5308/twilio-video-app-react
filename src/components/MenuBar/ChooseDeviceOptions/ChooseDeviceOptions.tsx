import React, { useCallback, useState, useEffect } from 'react';
import { Select, MenuItem, FormControl, FormHelperText } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
//import useLocalTracks from '../../VideoProvider/useLocalTracks/useLocalTracks';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

export default function ChooseDeviceOptions() {
  const {
    room: { localParticipant },
    localTracks,
    getLocalVideoTrack,
  } = useVideoContext();
  const classes = useStyles();
  const [camera, setCamera] = useState('');

  //const { getLocalAudioTrack } = useLocalTracks();
  const videoTrack = localTracks.find(track => track.name === 'camera');
  const [mediaDevices, setMediaDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(mediaDevices => {
      setMediaDevices(mediaDevices);
      const currentCamera = mediaDevices.filter(
        mediaDevice => mediaDevice.kind === 'videoinput' && mediaDevice.label === videoTrack?.mediaStreamTrack.label
      );

      if (currentCamera && currentCamera.length && currentCamera.length === 1) {
        setCamera(currentCamera[0].deviceId);
      }
    });
  }, []);

  const hasMultipleCameras = mediaDevices.filter(x => x.kind === 'videoinput').length > 1;

  const toggleCameraMode = useCallback(
    event => {
      const localTrackPublication = localParticipant?.unpublishTrack(videoTrack!);
      // TODO: remove when SDK implements this event. See: https://issues.corp.twilio.com/browse/JSDK-2592
      localParticipant?.emit('trackUnpublished', localTrackPublication);
      videoTrack!.stop();

      const videoConstraints = { exact: event.target.value };
      setCamera(event.target.value);
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
      {hasMultipleCameras && (
        <FormControl className={classes.formControl}>
          <Select
            value={camera}
            inputProps={{ 'aria-label': 'Without label' }}
            displayEmpty
            className={classes.selectEmpty}
            onChange={toggleCameraMode}
          >
            <MenuItem value="" disabled>
              Select Camera
            </MenuItem>
            {mediaDevices
              .filter(x => x.kind === 'videoinput')
              .map(mediaDevice => (
                <MenuItem
                  //selected={mediaDevice.label === videoTrack?.mediaStreamTrack.label}
                  key={mediaDevice.deviceId}
                  value={mediaDevice.deviceId}
                >
                  {mediaDevice.label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      )}
    </div>
  );
}
