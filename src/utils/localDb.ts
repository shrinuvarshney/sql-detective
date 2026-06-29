import { GameProgress, GameSettings } from '../types';

const DB_NAME = 'SQLDetectiveDB';
const DB_VERSION = 1;
const PROGRESS_STORE = 'progress';
const SETTINGS_STORE = 'settings';
const PROGRESS_KEY = 'current_progress';
const SETTINGS_KEY = 'current_settings';

export function initDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('IndexedDB is not available server-side'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        db.createObjectStore(PROGRESS_STORE);
      }
      if (!db.objectStoreNames.contains(SETTINGS_STORE)) {
        db.createObjectStore(SETTINGS_STORE);
      }
    };
  });
}

export async function getLocalProgress(): Promise<GameProgress | null> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PROGRESS_STORE], 'readonly');
      const store = transaction.objectStore(PROGRESS_STORE);
      const request = store.get(PROGRESS_KEY);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error loading progress from IndexedDB:', error);
    return null;
  }
}

export async function saveLocalProgress(progress: GameProgress): Promise<void> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PROGRESS_STORE], 'readwrite');
      const store = transaction.objectStore(PROGRESS_STORE);
      const request = store.put(progress, PROGRESS_KEY);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error saving progress to IndexedDB:', error);
  }
}

export async function clearLocalProgress(): Promise<void> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PROGRESS_STORE], 'readwrite');
      const store = transaction.objectStore(PROGRESS_STORE);
      const request = store.delete(PROGRESS_KEY);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error clearing progress from IndexedDB:', error);
  }
}

export async function getLocalSettings(): Promise<GameSettings | null> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SETTINGS_STORE], 'readonly');
      const store = transaction.objectStore(SETTINGS_STORE);
      const request = store.get(SETTINGS_KEY);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error loading settings from IndexedDB:', error);
    return null;
  }
}

export async function saveLocalSettings(settings: GameSettings): Promise<void> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SETTINGS_STORE], 'readwrite');
      const store = transaction.objectStore(SETTINGS_STORE);
      const request = store.put(settings, SETTINGS_KEY);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error saving settings to IndexedDB:', error);
  }
}

export async function clearLocalSettings(): Promise<void> {
  try {
    const db = await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SETTINGS_STORE], 'readwrite');
      const store = transaction.objectStore(SETTINGS_STORE);
      const request = store.delete(SETTINGS_KEY);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('Error clearing settings from IndexedDB:', error);
  }
}
