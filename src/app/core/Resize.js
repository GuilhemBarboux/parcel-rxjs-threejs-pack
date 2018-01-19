import { fromJS } from 'immutable';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/scan';

const size = fromJS({
  w: window.innerWidth,
  h: window.innerHeight,
});

const Resize = Observable
  .fromEvent(window, 'resize')
  .scan((previous) => {
    return size.merge({
      w: window.innerWidth,
      h: window.innerHeight,
    });
  }, size);

export default Resize;
