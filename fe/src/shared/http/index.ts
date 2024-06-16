import ky from 'ky';
import { BACKEND_URL } from '../const/config';

type AppKyConfig = {
  Authorization: string;
};

const config: AppKyConfig = {
  Authorization: '',
};

const $api = ky.create({
  prefixUrl: BACKEND_URL,
  hooks: {
    beforeRequest: [
      (req) => {
        config.Authorization &&
          req.headers.set('Authorization', config.Authorization);
        return req;
      },
    ],
  },
  // withCredentials: true, // add cookie to each request
});

export const setConfig = <K extends keyof AppKyConfig>(
  key: K,
  val: AppKyConfig[K],
) => {
  config[key] = val;
};

export default $api;
