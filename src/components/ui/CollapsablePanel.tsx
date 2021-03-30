import React, { useState } from 'react';
import { Card, Collapse } from 'react-bootstrap'
import { Icon } from './Icon'

interface CollapsablePanelProps {
  header: React.ReactNode;
  open?: boolean;
  children: React.ReactElement;
}

export function CollapsablePanel(props: CollapsablePanelProps): JSX.Element {

  const [open, setOpen] = useState(typeof props.open !== 'undefined' ? props.open : true)

  const toggleOpen = (): void => {
    setOpen(!open)
  }

  return (
    <Card className="mb-3">
      <Card.Header onClick={toggleOpen} className="d-flex justify-content-between align-items-center">
      { props.header }
        <Icon name={open ? "expand_less" : "expand_more" } large />
      </Card.Header>
      <Collapse in={open}>{props.children}</Collapse>
    </Card>
  )
}