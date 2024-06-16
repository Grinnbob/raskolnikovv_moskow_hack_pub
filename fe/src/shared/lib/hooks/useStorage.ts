import { EAppStorageKeys } from '@web/shared/types/enums/common';
import localForage from 'localforage';

localForage.config({
  name: 'RaskolnikovvCSDB',
  version: 1.0,
  size: 5 * 1024 * 1024,
  driver: [localForage.WEBSQL, localForage.INDEXEDDB, localForage.LOCALSTORAGE],
});

export type UseStorageOptions = {
  onError?: (e: Error) => void;
};

export const useStorage = ({ onError }: UseStorageOptions = {}) => {
  const getItem = <T>(name: EAppStorageKeys) =>
    localForage.getItem<T>(name).catch(onError);

  const setItem = <T>(name: EAppStorageKeys, val: T) =>
    localForage.setItem<T>(name, val).catch(onError);

  return { setItem, getItem };
};

export default useStorage;
