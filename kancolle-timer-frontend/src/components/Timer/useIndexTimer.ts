import { useState, useEffect, useCallback } from 'react';

import { Timer } from '../../API';
import { API, graphqlOperation } from 'aws-amplify';
import useTimers from '../../hook/timer.hook';
// amplifyで自動生成されたサブスクリプションのクエリをimport
import { onCreateTimer, onDeleteTimer, onUpdateTimer } from '../../graphql/subscriptions';

const useTimerIndex = () => {
  const [timersArray, setTimersArray] = useState<Timer[]>([]);
  const [timers, setTimers] = useState<Map<string, Timer>>(new Map());
  const { listTimers, updateTimer } = useTimers();

  const makeTimersArray = (timers: Map<string, Timer>) => {
    const arr = Array.from(timers.values());
    arr.sort((a, b) => {
      if (a.order < b.order) return -1;
      if (a.order > b.order) return 1;
      return 0;
    });
    setTimersArray(arr);
  };

  const callSetTimer = useCallback(async () => {
    try {
      const r = await listTimers();
      if (r) {
        const arr = r.filter((t) => t !== null) as Timer[];
        arr.sort((a, b) => {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
          return 0;
        });
        setTimersArray(arr);
      }
    } catch (e) {
      console.error(e);
    }
  }, [listTimers]);

  const organizeAfterDelete = useCallback(
    async (deletedOrder: number) => {
      const arr = timersArray.filter((t) => t.order > deletedOrder);
      try {
        const promises = arr.map(async (t) => {
          const nextTimer = { id: t.id, order: t.order - 1 };
          await updateTimer(nextTimer);
        });
        await Promise.all(promises);
      } catch (e) {
        console.error(e);
      }
    },
    [timersArray, updateTimer]
  );

  useEffect(() => {
    void (async () => {
      try {
        const r = await listTimers();
        if (r) {
          const arr = r.filter((t) => t !== null) as Timer[];
          const timersMap = new Map<string, Timer>();
          for (const t of arr) {
            timersMap.set(t.id, t);
          }
          setTimers(timersMap);
          makeTimersArray(timersMap);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, [listTimers]);

  useEffect(() => {
    (() => {
      const client = API.graphql(graphqlOperation(onCreateTimer));
      if ('subscribe' in client) {
        client.subscribe({
          next: (data) => {
            console.log('onCreate', data);
            void callSetTimer();
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    })();
    (() => {
      const client = API.graphql(graphqlOperation(onDeleteTimer));
      if ('subscribe' in client) {
        client.subscribe({
          next: (data) => {
            console.log('onDelete', data);
            void callSetTimer();
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    })();
    (() => {
      const client = API.graphql(graphqlOperation(onUpdateTimer));
      if ('subscribe' in client) {
        client.subscribe({
          next: (data) => {
            console.log('onUpdate', data);
            void callSetTimer();
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    })();
  }, [callSetTimer]);

  return { timersArray, organizeAfterDelete };
};

export default useTimerIndex;
