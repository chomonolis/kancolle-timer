import { Box } from '@mui/material';
import EditTimer from './EditTimer';
import ShowTimer from './ShowTimer';
import useTimerIndex from './useIndexTimer';

const Timer = () => {
  const { timers } = useTimerIndex();
  return (
    <>
      <Box sx={{ minWidth: '450px' }}>
        {timers &&
          timers.map((t) => {
            return <ShowTimer key={t.id} timer={t} />;
          })}
        <EditTimer timerListSize={timers.length} />
      </Box>
    </>
  );
};
export default Timer;
