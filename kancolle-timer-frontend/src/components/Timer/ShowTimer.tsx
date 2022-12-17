import { Box } from '@mui/material';
import { Timer } from '../../API';

type Props = {
  timer: Timer;
};

const ShowTimer = (props: Props) => {
  const { timer } = props;

  const formatTime = (time: string | null | undefined) => {
    if (!time) {
      return '--:--';
    }
    return time.substring(0, 5);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flex: 1 }}>{timer.name}</Box>
        <Box sx={{ flex: 1 }}>{formatTime(timer.time)}</Box>
        <Box sx={{ flex: 1 }}>{formatTime(timer.endTime)}</Box>
      </Box>
    </>
  );
};

export default ShowTimer;
