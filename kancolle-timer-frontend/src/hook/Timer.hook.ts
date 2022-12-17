import { useState, useEffect, useCallback } from 'react';

import { CreateTimerInput, Timer } from '../API';
import { API, graphqlOperation } from 'aws-amplify';
import TimerService, { TimerServiceReturnType } from '../service/timer.service';
// amplifyで自動生成されたサブスクリプションのクエリをimport
import { onCreateTimer, onDeleteTimer, onUpdateTimer } from '../graphql/subscriptions';

const useTimer = () => {
  const [timer, setTimer] = useState<Timer[]>([]);

  const callSetTimer = async () => {
    try {
      const r = await listTimers();
      if (r) {
        const arr = r.filter((t) => t !== null) as Timer[];
        arr.sort((a, b) => {
          if (a.order < b.order) return -1;
          if (a.order > b.order) return 1;
          return 0;
        });
        setTimer(arr);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    void callSetTimer();
  }, []);

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
  }, []);

  const createTimer = useCallback(async (createTimerInput: CreateTimerInput) => {
    try {
      const res = await TimerService.createTimer(createTimerInput);
      return res.data?.createTimer;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, []);

  const listTimers = useCallback(async () => {
    try {
      const res = await TimerService.listTimers();
      return res.data?.listTimers?.items;
    } catch (e) {
      console.error(e);
      return null;
    }
  }, []);

  return { timer, createTimer, listTimers };
};

export type UseTimerReturnType = {
  createTimerRT: Exclude<TimerServiceReturnType['createTimerRT']['data'], undefined>['createTimer'];
  listTimersRT: Exclude<
    Exclude<TimerServiceReturnType['listTimersRT']['data'], undefined>['listTimers'],
    undefined | null
  >['items'];
};

export default useTimer;
