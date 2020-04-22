import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import CallEnd from '@material-ui/icons/CallEnd';
import Fab from '@material-ui/core/Fab';
import Tooltip from '@material-ui/core/Tooltip';

//import useVideoContext from '../../../hooks/useVideoContext/useVideoContext';
import useEndButtonToggle from '../../../hooks/useEndButtonToggle/useEndButtonToggle';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      margin: theme.spacing(1),
    },
  })
);

export default function EndCallButton() {
  const classes = useStyles();
  const [isEnded, toggleEnded] = useEndButtonToggle();

  return (
    <Tooltip title={'End Call'} onClick={toggleEnded} placement="top" PopperProps={{ disablePortal: true }}>
      <Fab className={classes.fab} color="primary">
        <CallEnd />
      </Fab>
    </Tooltip>
  );
}
