import { fromJS } from 'immutable';
import { Observable, Scheduler } from 'rxjs';

import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/scan';

const state = fromJS({
  time: performance.now(),
  delta: 0,
});

const Loop = Observable
  .interval(0, Scheduler.animationFrame)
  .scan((previous) => {
    const time = performance.now();
    return state.merge({
      time,
      delta: time - previous.get('time'),
    });
  }, state);

export default Loop;
