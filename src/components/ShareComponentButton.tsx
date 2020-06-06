import { Button } from "react-bootstrap";
import React from "react";

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
        <span className="material-icons material-icons-raised mr-1">share</span> Share
      </Button>
    } else {
      return <Button className="ml-2" size="sm" variant="danger" onClick={props.unshare}>
        <span className="material-icons material-icons-raised">lock</span>
        Unshare
      </Button>
    }
  }
  return null
}