import React from 'react';
import { ListGroup, ListGroupItem } from 'react-bootstrap'
import { ClientStatus, ClientInterface } from '../api/Responses';
import { CollapsablePanel, IconBadge } from './ui'

export interface ConnectivityPanelProps {
  connected: boolean;
  serverName: string;
  clients: ClientStatus[];
}

export function ConnectivityPanel(props: ConnectivityPanelProps): JSX.Element {

  function ConnectionBadge(
    props: { clientConnected: "yes" | "no" | "missed-ping"; usConnected: boolean }
  ): JSX.Element {
    if (props.usConnected) {
      switch (props.clientConnected) {
        case "yes":
          return <IconBadge variant="success" className="ml-1" icon="wifi" raised>Online</IconBadge>
        case "no":
          return <IconBadge variant="danger" className="ml-1" icon="wifi" raised>Offline</IconBadge>
        case "missed-ping":
          return <IconBadge variant="warning" className="ml-1" icon="wifi" raised>Unknown</IconBadge>
      }
    } else {
      return <IconBadge variant="secondary" className="ml-1" icon="wifi" raised>Unknown</IconBadge>
    }
  }

  function InterfaceBadge(
    props: { interface: ClientInterface; screenName?: string }
  ): JSX.Element {
    switch (props.interface) {
      case "control":
        return <IconBadge variant="info" className="ml-1" icon="headset" raised>Control</IconBadge>
      case "view":
        return <IconBadge variant="primary" className="ml-1" icon="tv" raised>{props.screenName}</IconBadge>
      case "manage":
        return <IconBadge variant="light" className="ml-1" icon="videogame_asset" raised>Manage</IconBadge>
    }
  }
  const header = <div>
    streamer-1
    { props.connected ?
        <IconBadge variant="success" className="ml-1" icon="wifi" raised>Online</IconBadge>
    : <IconBadge variant="danger" className="ml-1" icon="wifi" raised>Offline</IconBadge> }
    { props.connected ? props.clients.filter((client) => client.interface === "view" && client.connected === "yes").sort((a, b) => a.name > b.name ? 1 : -1).map((client) =>
      <IconBadge key={client.id} variant="primary" className="ml-1" icon="tv" raised>{client.screenName}</IconBadge>) : null}
  </div>

  return (
    <CollapsablePanel header={header} open={false}>
      <ListGroup>
        { props.clients.map((client) =>
          <ListGroupItem key={client.id}>
            {client.name}
            <p className="mb-1">
              <ConnectionBadge clientConnected={client.connected} usConnected={props.connected} />
              <InterfaceBadge interface={client.interface} screenName={client.screenName} />
            </p>
          </ListGroupItem>
        )}
      </ListGroup>
    </CollapsablePanel>
  )
}