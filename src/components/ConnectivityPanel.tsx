import React from 'react';
import { Badge, ListGroup, ListGroupItem } from 'react-bootstrap'
import { ClientStatus, ClientInterface } from '../api/Responses';
import { CollapsablePanel } from './CollapsablePanel'

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
          return <Badge variant="success" className="ml-1"><span className="material-icons material-icons-raised">wifi</span> Online</Badge>
        case "no":
          return <Badge variant="danger" className="ml-1"><span className="material-icons material-icons-raised">wifi</span> Offline</Badge>
        case "missed-ping":
          return <Badge variant="warning" className="ml-1"><span className="material-icons material-icons-raised">wifi</span> Unknown</Badge>
      }
    } else {
      return <Badge variant="secondary" className="ml-1"><span className="material-icons material-icons-raised">wifi</span> Unknown</Badge>
    }
  }

  function InterfaceBadge(
    props: { interface: ClientInterface; screenName?: string }
  ): JSX.Element {
    switch (props.interface) {
      case "control":
        return <Badge variant="info" className="ml-1"><span className="material-icons material-icons-raised">headset</span> Control</Badge>
      case "view":
        return <Badge variant="primary" className="ml-1"><span className="material-icons material-icons-raised">tv</span> {props.screenName}</Badge>
      case "manage":
        return <Badge variant="light" className="ml-1"><span className="material-icons material-icons-raised">videogame_asset</span> Manage</Badge>
    }
  }
  const header = <div>
    streamer-1
    { props.connected ?
        <Badge variant="success" className="ml-1">
        <span className='material-icons material-icons-raised'>wifi</span> Online
        </Badge>
    : <Badge variant="danger" className="ml-1"><span className='material-icons material-icons-raised'>wifi</span> Offline</Badge> }
    { props.connected ? props.clients.filter((client) => client.interface === "view" && client.connected === "yes").sort((a, b) => a.name > b.name ? 1 : -1).map((client) => <Badge key={client.id} variant="primary" className="ml-1">
      <span className="material-icons material-icons-raised">tv</span> {client.screenName}</Badge>) : null}
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