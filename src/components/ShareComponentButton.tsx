import { Button } from "react-bootstrap";
import React from "react";
import { Icon } from './ui'

export interface ShareComponentButtonProps {
  enabled: boolean;
  shared: boolean;
  share: () => void;
  unshare: () => void;
}

export function ShareComponentButton(props: ShareComponentButtonProps): JSX.Element | null {
  if (props.enabled) {
    if (!props.shared) {
      return <Button className="ml-2" size="sm" variant="primary" onClick={props.share}>
        <Icon className="mr-1" name="share" raised /> Share
      </Button>
    } else {
      return <Button className="ml-2" size="sm" variant="danger" onClick={props.unshare}>
        <Icon name="lock" raised />
        Unshare
      </Button>
    }
  }
  return null
}