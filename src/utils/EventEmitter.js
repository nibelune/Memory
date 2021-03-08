/**
 * basic event emitter class
 * it simply allow to emit/register to events
 */
export default class EventEmitter {
  constructor() {
    this.events = {}; // object to store events
  }

  /**
   * Register to an event
   * @param {string} evt - event name
   * @param {function} listener - handler to call
   * @returns
   */
  on(evt, listener) {
    //logical OR returns the first "truthy" expression
    //if there is none, it returns the last expression
    (this.events[evt] || (this.events[evt] = [])).push(listener);
    return this;
  }

  /**
   * Emit an event
   * @param {string} evt - event name
   * @param  {...any} arg - arguments to pass to handler
   */
  emit(evt, ...arg) {
    (this.events[evt] || []).slice().forEach((listener) => listener(...arg));
  }
}
