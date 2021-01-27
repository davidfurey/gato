import React, { useState, useRef, CSSProperties } from 'react';
import { Button, Popover, Overlay, Card, ListGroup } from 'react-bootstrap';
import { DriveResponse, Item, getFolder } from '../api/Drive';
import path from 'path'
import { Icon } from './ui'

interface ImagePickerProps {
  image: (url: string) => void;
  initialPath: string;
  className?: string;
  style?: CSSProperties;
}

function PickerDialog(props: {
  close: () => void;
  image: (url: string) => void;
  open: (path: string) => void;
  items: Item[];
  name: string;
  parent: string | undefined;
}): JSX.Element {
  const parent = props.parent
  return <Card style={{minWidth: "24em", height: "20em"}}>
    <Card.Header className="px-2 py-2 bg-primary d-flex">
      { parent ?
        <Button style={{border: 'none', verticalAlign: "top"}} size="sm" onClick={(): void => props.open(parent)} className="p-0 my-0 mr-2">
          <Icon name="arrow_back" className="m-0" raised />
        </Button>
         : null }
      { props.name }
      <Button style={{border: 'none', verticalAlign: "top"}} size="sm" onClick={props.close} className="p-0 my-0 ml-2 ml-auto">
        <Icon name="close" className="m-0" raised />
      </Button>
    </Card.Header>
    <ListGroup variant="flush" style={{overflowY: "auto"}}>
      { props.items.map((item) =>
        <ListGroup.Item key={item.filename} active={false} action={true} onClick={(): void => {
          if (item.type === "folder") {
            props.open(item.path)
          } else {
            props.image(item.url)
          }
        }}>
          <Icon name={ item.type === "image" ? "photo" : "folder"} className="pr-1" raised />
          { item.filename }
        </ListGroup.Item>
      )}
      { props.items.length === 0 ?
        <ListGroup.Item>(empty folder)</ListGroup.Item> : null
      }
    </ListGroup>
  </Card>
}

function popover(
  initialPath: string,
  close: () => void,
  image: (url: string) => void
): JSX.Element {
  const [initialised, setInitalised] = useState(false);
  const initialDriveResponse: DriveResponse = {
    path: "",
    name: "Locations",
    items: [
      {
        filename: "Drive",
        path: "/",
        type: "folder",
        url: "",
      }
    ],
    parent: undefined
  }
  const [folder, setFolder] = useState(initialDriveResponse);

  if (!initialised) {
    void getFolder(path.dirname(initialPath)).then((r) => {
      setInitalised(true)
      setFolder(r)
    })
  }
  return <Popover id="popover-basic" className="bg-secondary p-0">
    <PickerDialog
      open={(path): void => { void getFolder(path).then((r) => { setFolder(r) }) } }
      close={close}
      image={image}
      items={folder.items}
      name={folder.name}
      parent={folder.parent}
    />
  </Popover>
}

export function ImagePicker(props: ImagePickerProps): JSX.Element {
  const [show, setShow] = useState(false);
  const target = useRef(null);
  const close = (): void => {
    setShow(false)
  }
  return <div>
    <Button
      style={props.style}
      ref={target}
      onClick={(): void => setShow(!show)}
      className={props.className}
    >
        <Icon name="create" />
    </Button>
    <Overlay target={target.current} show={show}>{popover(
      props.initialPath,
      close,
      (url: string) => {
        close()
        props.image(url)
      }
    )}</Overlay>
  </div>
}
