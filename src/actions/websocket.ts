export type GenericWebsocketsAction<T> = {
  type: string;
  meta: {
      timestamp: Date;
  };
  payload?: T;
};

export interface GenericWebsocketsActionWithPayload<T> extends GenericWebsocketsAction<T> {
  payload: T;
}

export type WebsocketConnect = GenericWebsocketsActionWithPayload<{
  url: string;
  protocols: string[] | undefined;
}>

export type WebsocketMessage = GenericWebsocketsActionWithPayload<{
  message: string;
  origin: string;
}>
