import React from 'react';
import { Button } from 'react-bootstrap'
import { Icon } from './Icon'

export function IconButton(props: React.ComponentProps<typeof Button> & {
  icon: string;
  raised?: boolean;
}): JSX.Element {
  const { raised: ignored, ...buttonProps } = props;
  return <Button {...buttonProps}>
    <Icon name={props.icon} raised={props.raised} />
    {props.children}
  </Button>
}
