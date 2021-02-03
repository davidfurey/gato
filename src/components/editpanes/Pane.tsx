import React from 'react';
import { Row, FormGroup, FormLabel } from 'react-bootstrap';

export function Group(props: React.ComponentProps<typeof FormGroup>): ReturnType<FormGroup> {
  return <FormGroup { ...props} as={Row} />
}

export function Label(props: React.ComponentProps<typeof FormLabel>): ReturnType<FormLabel> {
  return <FormLabel { ...props} column lg={2} />
}

export type TypePropertyNames<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
