import React from 'react';
import { Badge } from 'react-bootstrap'
import { Icon } from './Icon'

export function IconBadge(props: React.ComponentProps<typeof Badge> & {
  icon: string;
  raised?: boolean;
}): JSX.Element {
  const { raised: ignored, ...badgeProps } = props;
  return <Badge {...badgeProps}>
    <Icon name={props.icon} raised={props.raised} />
    {props.children}
  </Badge>
}
