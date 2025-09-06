'use client';

const isClient = typeof window !== 'undefined';

type StorageType = 'session' | 'local'


export const setStorageValue = (key: string, value: unknown, storeType?: StorageType) => {
  if (isClient) {
    if (storeType === 'session') {
      sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
}

export const getStorageValue = <T> (value: string, storeType? : StorageType): T | null =>{
  let storageValue;

  if (isClient) {
    if (storeType === 'session') {
      storageValue = sessionStorage.getItem(value)? JSON.parse(sessionStorage.getItem(value) || '') : null
    } else {
      storageValue = localStorage.getItem(value)? JSON.parse(localStorage.getItem(value) || '') : null
    }
  }

  return storageValue;
}