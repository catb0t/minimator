export class Shortcut {
  listeners: Map<string, listener[]> = new Map();
  isOptionPressed = false;
  keyupListener: (event: KeyboardEvent) => void;
  keydownListener: (event: KeyboardEvent) => void;

  /**
   * Init the object by listeneing to the key events
   */
  constructor() {
    this.keyupListener = this.onKeyUp.bind(this);
    this.keydownListener = this.onKeyDown.bind(this);
    window.addEventListener('keyup', this.keyupListener);
    window.addEventListener('keydown', this.keydownListener);
  }

  /**
   * Public method to listen keybind
   * @param string eventName Event to listen to
   * @param function listener Listener
   * @return function Executable to remove the listener
   */
  on(eventName: string, listener: listener) {
    if (!EVENTS[eventName]) {
      throw new Error('Ask to listen for a non existing shortcut');
    }
    let listeners = this.listeners.get(eventName);
    if (!listeners) {
      listeners = [];
      this.listeners.set(eventName, listeners);
    }
    listeners.push(listener);
    return () => {
      let listeners = this.listeners.get(eventName) as listener[];
      let listenerIndex = listeners.indexOf(listener);
      if (~listenerIndex) {
        listeners.splice(listenerIndex, 1);
      }
    };
  }

  /**
   * Listener for key up
   * @param event event Event object from window
   */
  onKeyUp(event: KeyboardEvent) {
    if (event.keyCode === OPTION_KEYCODE) {
      this.isOptionPressed = false;
    }
  }

  /**
   * Listener for key down
   * @param event event Event object from window
   */
  onKeyDown(event: KeyboardEvent) {
    if (event.keyCode === OPTION_KEYCODE) {
      this.isOptionPressed = true;
    }
    let eventSpecs: any, areSpecsPassing;
    for (let eventName in EVENTS) {
      eventSpecs = EVENTS[eventName];
      areSpecsPassing = true;
      for (let prop in eventSpecs) {
        if (
          (event as any)[prop] !== eventSpecs[prop] &&
          !(prop === 'ctrlKey' && eventSpecs[prop] && this.isOptionPressed)
        ) {
          areSpecsPassing = false;
        }
      }
      if (areSpecsPassing) {
        let listeners = this.listeners.get(eventName) || [];
        for (let listenerIndex in listeners) {
          listeners[listenerIndex]();
        }
        // Prevent default event behavior.
        // Except for the 'delete' on inputs/textareas
        if (
          eventName !== 'delete' ||
          !~['INPUT', 'TEXTAREA'].indexOf((event.target as any)?.nodeName)
        ) {
          event.preventDefault();
        }
        return;
      }
    }
  }

  /**
   * Public method to remove all events
   * to make the instance killable
   */
  destroy() {
    window.removeEventListener('keyup', this.keyupListener);
    window.removeEventListener('keydown', this.keydownListener);
  }
}

export const OPTION_KEYCODE = 91;
export const EVENTS: { [shortcutName: string]: EventDef } = {
  redo: {
    keyCode: 89,
    ctrlKey: true,
  },
  // Shift + CMD + Z is cancelled because
  // Firefox Mac doesn't detect the Shift key.
  // redo: {
  //   keyCode: 90,
  //   ctrlKey: true,
  //   shiftKey: true,
  // },
  undo: {
    keyCode: 90,
    ctrlKey: true,
  },
  delete: {
    keyCode: 8,
  },
  cut: {
    keyCode: 88,
    ctrlKey: true,
  },
  copy: {
    keyCode: 67,
    ctrlKey: true,
  },
  paste: {
    keyCode: 86,
    ctrlKey: true,
  },
};

type listener = () => void;
interface EventDef {
  keyCode: number;
  ctrlKey?: boolean;
  shiftKey?: boolean;
}
