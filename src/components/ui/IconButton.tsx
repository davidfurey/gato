import React from 'react';
import { Button } from 'react-bootstrap'
import { Icon } from './Icon'

type FirstArgType<T> = T extends (props: infer U) => unknown ? U : never;

export function IconButton(props: FirstArgType<Button> & {
  icon: string;
  raised?: boolean;
}): JSX.Element {
  return <Button {...props}>
    <Icon name={props.icon} raised={props.raised} />
    {props.children}
  </Button>
}
