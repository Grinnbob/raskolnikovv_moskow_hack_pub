import { Socket, io } from 'socket.io-client';
import { EEventReason } from '@shared/types/events';
import { SOCKET_IO_SERVER } from '../const/config';

type ConnectSocketApi = {
  onInvalidToken?: (e: Error) => void;
};

export class SocketClient {
  socket: Socket | undefined;

  disconnect() {
    this.socket?.connected && this.socket.disconnect();
  }

  connect(token: string, api?: ConnectSocketApi) {
    this.disconnect();

    this.socket = io(SOCKET_IO_SERVER, {
      extraHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    this.socket.on('exception', (e) => console.log(e));

    this.socket.on('connect_error', (e) => {
      if (e.message === EEventReason.INVALID_TOKEN) {
        api?.onInvalidToken?.(e);
      } else {
        console.log('connect_error: ', e);
      }
    });

    return this.socket;
  }
}
