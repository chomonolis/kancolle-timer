import { Box, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Timer } from '../../API';
import useShowTimer from './useShowTimer';

type Props = {
  timer: Timer;
};

const ShowTimer = (props: Props) => {
  const { timer } = props;
  const { callStartTimer } = useShowTimer();

  const formatTime = (time: string | null | undefined) => {
    if (!time) {
      return '--:--';
    }
    return time;
  };

  const startTimer = () => {
    void callStartTimer(timer);
  };

  const createButton = () => {
    if (timer.endTime) {
      return (
        <Button
          variant='contained'
          color='secondary'
          onClick={() => {
            startTimer();
          }}
        >
          中止
        </Button>
      );
    }
    return (
      <Button
        variant='contained'
        color='primary'
        onClick={() => {
          startTimer();
        }}
      >
        開始
      </Button>
    );
  };

  return (
    <>
      <Box sx={{ display: 'flex', m: 1 }}>
        <Box sx={{ flex: 1 }}>{timer.name}</Box>
        <Box sx={{ flex: 1 }}>{formatTime(timer.time)}</Box>
        <Box sx={{ flex: 1 }}>{formatTime(timer.endTime)}</Box>
        {createButton()}
        <IconButton aria-label='delete' sx={{ ml: 1 }}>
          <DeleteIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default ShowTimer;
