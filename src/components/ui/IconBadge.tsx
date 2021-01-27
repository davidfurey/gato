import React from 'react';
import { Badge } from 'react-bootstrap'
import { Icon } from './Icon'

type FirstArgType<T> = T extends (props: infer U) => unknown ? U : never;

export function IconBadge(props: FirstArgType<Badge> & {
  icon: string;
  raised?: boolean;
}): JSX.Element {
  return <Badge {...props}>
    <Icon name={props.icon} raised={props.raised} />
    {props.children}
  </Badge>
}
