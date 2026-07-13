const listeners = new Set();

export function toast(message, options = {}) {
  for (const listener of listeners) {
    listener(message, options);
  }
}

export function subscribeToToasts(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

