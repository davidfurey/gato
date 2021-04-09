import React, { CSSProperties, useState } from 'react';
import { Button, ListGroup, ButtonGroup, Modal } from 'react-bootstrap'
import { ComponentType, Style } from '../reducers/shared';
import { EditPane, EditPaneType } from '../types/editpane';
import { IconButton } from './ui'
import { componentTypes, componentTypeAsString } from './OSDComponents';


function StyleListItem(props: {
  style: Style;
  openTab?: (pane: EditPane) => void;
  deleteStyle?: () => void;
  active: boolean;
  onClick?: () => void;
 }): JSX.Element {
  const [show, setShow] = useState(false);

  function deleteHandler(deleteStyle: () => void): () => void {
    return (): void => {
      setShow(false)
      deleteStyle()
    }
  }

  const openTab = props.openTab
  const settings: (() => void) | undefined = openTab ? (): void => {
    openTab({
      type: EditPaneType.Style,
      id: props.style.id,
    })
  } : undefined

  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)

  return <ListGroup.Item active={props.active} action={props.onClick !== undefined} className="d-flex justify-content-between align-items-center pl-5 border-bottom-0" onClick={props.onClick}>
    {props.style.name}
    <ButtonGroup size="sm">
      {settings ? <IconButton variant="info" onClick={settings} icon="settings" /> : null }
      {props.deleteStyle ? <IconButton variant="danger" onClick={handleShow} icon="delete" /> : null }
    </ButtonGroup>
    { props.deleteStyle ?
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Delete style</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete style &quot;{props.style.name}&quot;?
        </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={deleteHandler(props.deleteStyle)}>
          Delete
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal> : null
    }
  </ListGroup.Item>
}

interface StyleListProps {
  styles: Style[];
  openTab?: (pane: EditPane) => void;
  deleteStyle?: (id: string) => void;
  onClick?: (id: string, active: boolean) => void;
  activeId?: string;
  scroll?: boolean;
}

function Sublist(props: { type: ComponentType, first: boolean }  & StyleListProps): JSX.Element {
  const deleteStyle = props.deleteStyle
  const onClick = props.onClick
  return <>
  <ListGroup.Item className={
    props.first ? "text-light font-weight-bold border-bottom-0 pb-1 pt-3" :
      "text-light font-weight-bold border-top border-secondary border-bottom-0 mt-2 pb-1"
  }>{ componentTypeAsString(props.type) }s</ListGroup.Item>
  {props.styles.filter((t) => t.componentType === props.type).map((style) =>
    <StyleListItem
      key={style.id}
      style={style}
      openTab={props.openTab}
      deleteStyle={deleteStyle ? (): void => deleteStyle(style.id) : undefined }
      onClick={onClick ? (): void =>
        onClick(style.id, style.id === props.activeId) : undefined
      }
      active={style.id === props.activeId}
    />
  )}</>
}

export function StyleList(props: StyleListProps): JSX.Element {
  const style: CSSProperties = props.scroll ? {height: "30em", overflowY: "scroll"} : {}
  return <ListGroup variant="flush" style={style}>
    { componentTypes.map((type, index) =>
        <Sublist key={type} {...props} type={type} first={index === 0} />) }
  </ListGroup>
}