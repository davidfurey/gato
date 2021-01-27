import { OSDLiveEvent } from "../reducers/shared";
import { Badge, Col, Row } from "react-bootstrap";
import React from "react";
import { OSDComponent } from "../OSDComponent";
import { ShareComponentButton } from "./ShareComponentButton";
import { Icon, IconBadge } from './ui'

export interface SharedStatusProps {
  events: OSDLiveEvent[];
  shared: boolean;
  component: OSDComponent;
  share: () => void;
  unshare: () => void;
}

function renderList(ls: OSDLiveEvent[], maxLength: number): JSX.Element | null {
  return <span>{ls.slice(0, maxLength).map((event) =>
    <span key={event.id}><IconBadge variant="warning" icon="event" raised>{event.name}</IconBadge> </span>
  )}
    {maxLength < ls.length ? <><Badge variant="light">More</Badge> </> : null }
  </span>
}

export function SharedStatus(props: SharedStatusProps): JSX.Element {
  return !props.shared && props.events[0] ?
    <Row className="mb-3">
      <Col>
        <Icon name="lock" raised /> Private to {props.events[0].name} event
        <ShareComponentButton
          enabled={props.events.length === 1}
          shared={props.shared}
          share={props.share}
          unshare={props.unshare}
        />
      </Col>
    </Row>
    : <Row className="mb-3">
      <Col lg={2}>Events</Col>
      <Col>
        {props.events.length > 0 ? renderList(props.events, 5) : "(none)"}
        <ShareComponentButton
          enabled={props.events.length === 1}
          shared={props.shared}
          share={props.share}
          unshare={props.unshare}
        />
      </Col>
    </Row>
}