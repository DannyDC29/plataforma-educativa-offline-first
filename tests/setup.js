let store = {};

const mockStorage = {
  getItem(key) {
    return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
  },
  setItem(key, value) {
    store[key] = String(value);
  },
  removeItem(key) {
    delete store[key];
  },
  clear() {
    store = {};
  },
  key(index) {
    return Object.keys(store)[index] || null;
  },
  get length() {
    return Object.keys(store).length;
  }
};

Object.defineProperty(globalThis, 'localStorage', {
  value: mockStorage,
  writable: true,
  configurable: true
});

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'localStorage', {
    value: mockStorage,
    writable: true,
    configurable: true
  });
}