export type StorageType = 'local' | 'session' | 'cookie';

/**
 * Universal Storage Utility supporting localStorage, sessionStorage, and Cookies
 */
export const storage = {
  /**
   * Get an item from specified storage ('local' | 'session' | 'cookie')
   */
  get<T = string>(key: string, storageType: StorageType = 'local'): T | null {
    try {
      if (storageType === 'local') {
        const val = localStorage.getItem(key);
        if (!val) return null;
        try {
          return JSON.parse(val) as T;
        } catch {
          return val as unknown as T;
        }
      }
      if (storageType === 'session') {
        const val = sessionStorage.getItem(key);
        if (!val) return null;
        try {
          return JSON.parse(val) as T;
        } catch {
          return val as unknown as T;
        }
      }
      if (storageType === 'cookie') {
        const nameEQ = `${encodeURIComponent(key)}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
          let c = ca[i].trim();
          if (c.indexOf(nameEQ) === 0) {
            const raw = decodeURIComponent(c.substring(nameEQ.length));
            try {
              return JSON.parse(raw) as T;
            } catch {
              return raw as unknown as T;
            }
          }
        }
        return null;
      }
    } catch (err) {
      console.warn(`Storage get error for key "${key}":`, err);
    }
    return null;
  },

  /**
   * Set an item in specified storage ('local' | 'session' | 'cookie')
   */
  set<T = any>(
    key: string,
    value: T,
    storageType: StorageType = 'local',
    days = 7,
  ): void {
    try {
      const valStr = typeof value === 'string' ? value : JSON.stringify(value);
      if (storageType === 'local') {
        localStorage.setItem(key, valStr);
      } else if (storageType === 'session') {
        sessionStorage.setItem(key, valStr);
      } else if (storageType === 'cookie') {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = `; expires=${date.toUTCString()}`;
        document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(
          valStr,
        )}${expires}; path=/; SameSite=Lax`;
      }
    } catch (err) {
      console.warn(`Storage set error for key "${key}":`, err);
    }
  },

  /**
   * Remove a specific item from specified storage
   */
  remove(key: string, storageType: StorageType = 'local'): void {
    try {
      if (storageType === 'local') {
        localStorage.removeItem(key);
      } else if (storageType === 'session') {
        sessionStorage.removeItem(key);
      } else if (storageType === 'cookie') {
        document.cookie = `${encodeURIComponent(
          key,
        )}=; Max-Age=-99999999; path=/`;
      }
    } catch (err) {
      console.warn(`Storage remove error for key "${key}":`, err);
    }
  },

  /**
   * Clear all items in specified storage
   */
  clear(storageType: StorageType = 'local'): void {
    try {
      if (storageType === 'local') {
        localStorage.clear();
      } else if (storageType === 'session') {
        sessionStorage.clear();
      } else if (storageType === 'cookie') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i];
          const eqPos = cookie.indexOf('=');
          const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
          document.cookie = `${name}=; Max-Age=-99999999; path=/`;
        }
      }
    } catch (err) {
      console.warn(`Storage clear error for type "${storageType}":`, err);
    }
  },
};
