import { AnnotatedType, isTypeGroup } from "../api/PatternHelpers";

export enum ActionType {
  SetHash = 'Navigation/SetHash',
}

export type Action = SetHash

export interface SetHash extends AnnotatedType<ActionType.SetHash> {
  windowHash: string;
}

export const isNavigationAction = isTypeGroup<string, Action>("Navigation/")