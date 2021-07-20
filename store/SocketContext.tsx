import React, { createContext, ReactNode } from 'react';
import { DefaultEventsMap } from 'socket.io-client/build/typed-events';
import { io, Socket } from 'socket.io-client';

const socket: Socket<DefaultEventsMap, DefaultEventsMap> = io(
    'https://realtimechatappbdh.herokuapp.com/',
    { transports: ['websocket', 'clear'] }
);

export const SKContext = createContext(socket);

const ValueContextProvider = ({ children }: { children: ReactNode }) =>

    (<SKContext.Provider value={socket}>{children}</SKContext.Provider>)

export default ValueContextProvider;
