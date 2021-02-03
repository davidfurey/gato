import React from 'react';
import { Card } from 'react-bootstrap';
import { IconBadge } from '../../ui';

export function SubPanel(props: React.ComponentProps<typeof Card> & {
  title: string,
  icon: string,
}): ReturnType<Card> {
  const { title: ignored, icon: ignore, ...cardProps } = props;
  return <Card { ...cardProps} style={{width: "30rem"}} className="mb-3">
    <Card.Header>
      <IconBadge
        variant="dark"
        className="py-2 mr-2 ml-n2"
        style={{ width: "1.7rem", height: "1.7rem" }}
        icon={props.icon}
        raised
      />
    {props.title}</Card.Header>
    {props.children}
    </Card>
}