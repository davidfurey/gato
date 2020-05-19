import { SharedState } from "./shared";
import { ConnectivityState } from './connectivity'

export interface BaseAppState {
  shared: SharedState;
  connectivity: ConnectivityState;
}