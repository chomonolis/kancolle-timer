import EditTimer from './EditTimer';
import ShowTimer from './ShowTimer';
import useTimer from '../../hook/Timer.hook';

const Timer = () => {
  const { timer } = useTimer();
  return (
    <>
      {timer &&
        timer.map((t) => {
          return <ShowTimer key={t.id} timer={t} />;
        })}
      <EditTimer timerListSize={5} />
    </>
  );
};
export default Timer;
