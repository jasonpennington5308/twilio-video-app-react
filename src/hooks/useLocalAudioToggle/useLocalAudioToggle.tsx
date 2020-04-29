import { LocalAudioTrack } from 'twilio-video';
import { useCallback, useState } from 'react';
import useIsTrackEnabled from '../useIsTrackEnabled/useIsTrackEnabled';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useLocalAudioToggle() {
  const { room, localTracks } = useVideoContext();
  const audioTrack = localTracks.find(track => track.kind === 'audio') as LocalAudioTrack;
  const isEnabled = useIsTrackEnabled(audioTrack);
  const localParticipant = room.localParticipant;
  const participants = room.participants;

  const toggleAudioEnabled = useCallback(() => {
    let hasPhone = false;

    if (room && room.localParticipant && participants) {
      participants.forEach(p => {
        if (p.identity.split('|')[0] === localParticipant.identity.split('|')[0] + '.phone') {
          hasPhone = true;
        }
      });
    }

    if (audioTrack && audioTrack.isEnabled && audioTrack.isEnabled === true) {
      audioTrack.disable();
    } else if (audioTrack && !audioTrack.isEnabled && !hasPhone) {
      audioTrack.enable();
    }
  }, [room, audioTrack]);

  return [isEnabled, toggleAudioEnabled] as const;
}
