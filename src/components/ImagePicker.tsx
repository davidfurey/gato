import React, { useState, useRef, CSSProperties } from 'react';
import { Button, Popover, Overlay, Card, ListGroup } from 'react-bootstrap';
import { DriveResponse, Item } from '../api/Drive';
import path from 'path'

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
          <span className="material-icons material-icons-raised m-0">arrow_back</span>
        </Button>
         : null }
      { props.name }
      <Button style={{border: 'none', verticalAlign: "top"}} size="sm" onClick={props.close} className="p-0 my-0 ml-2 ml-auto">
          <span className="material-icons material-icons-raised m-0">close</span>
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
          <span className="material-icons material-icons-raised pr-1">{ item.type === "image" ? "photo" : "folder"}</span>
          { item.filename }
        </ListGroup.Item>
      )}
      { props.items.length === 0 ?
        <ListGroup.Item>(empty folder)</ListGroup.Item> : null
      }
    </ListGroup>
  </Card>
}

interface FolderData {
  [path: string]: Item[];
}

const apiUrl = process.env.NODE_ENV === 'production' ? '/gato/drive' : 'http://localhost:3040/drive'

function getFolder(path: string): Promise<DriveResponse> {
  return fetch(`${apiUrl}${path}`).then((response) =>
    response.json()
  )
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
    getFolder(path.dirname(initialPath)).then((r) => {
      setInitalised(true)
      setFolder(r)
    })
  }
  return <Popover id="popover-basic" className="bg-secondary p-0">
    <PickerDialog
      open={(path): void => { getFolder(path).then((r) => { setFolder(r) }) } }
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
        <span className="material-icons">create</span>
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
