import { AnnotatedType, isTypeGroup } from "../api/PatternHelpers";

export enum ActionType {
  Disconnected = 'Connectivity/Disconnected',
}

export type Action = Disconnected

export type Disconnected = AnnotatedType<ActionType.Disconnected>

export const isConnectivityAction = isTypeGroup<string, Action>("Connectivity/")