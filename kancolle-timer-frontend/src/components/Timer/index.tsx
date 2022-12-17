import EditTimer from './EditTimer';
import ShowTimer from './ShowTimer';
import useTimer from '../../hook/Timer.hook';

const Timer = () => {
  const { timers } = useTimer();
  return (
    <>
      {timers &&
        timers.map((t) => {
          return <ShowTimer key={t.id} timer={t} />;
        })}
      <EditTimer timerListSize={timers.length} />
    </>
  );
};
export default Timer;
