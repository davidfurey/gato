import React, { CSSProperties, useState } from 'react';
import { Button, ListGroup, ButtonGroup, Modal } from 'react-bootstrap'
import { Theme } from '../reducers/shared';
import { EditPane, EditPaneType } from '../types/editpane';
import { IconButton } from './ui'

function ThemeListItem(props: {
  theme: Theme;
  openTab?: (pane: EditPane) => void;
  deleteTheme?: () => void;
  active: boolean;
  onClick?: () => void;
 }): JSX.Element {
  const [show, setShow] = useState(false);

  function deleteHandler(deleteTheme: () => void): () => void {
    return (): void => {
      setShow(false)
      deleteTheme()
    }
  }

  const openTab = props.openTab
  const settings: (() => void) | undefined = openTab ? (): void => {
    openTab({
      type: EditPaneType.Theme,
      id: props.theme.id,
    })
  } : undefined

  const handleClose = (): void => setShow(false)
  const handleShow = (): void => setShow(true)

  return <ListGroup.Item active={props.active} action={props.onClick !== undefined} className="d-flex justify-content-between align-items-center" onClick={props.onClick}>
    {props.theme.name}
    <ButtonGroup size="sm">
      {settings ? <IconButton variant="info" onClick={settings} icon="settings" /> : null }
      {props.deleteTheme ? <IconButton variant="danger" onClick={handleShow} icon="delete" /> : null }
    </ButtonGroup>
    { props.deleteTheme ?
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Delete theme</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete theme &quot;{props.theme.name}&quot;?
        </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={deleteHandler(props.deleteTheme)}>
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

export function ThemeList(
  props: {
    themes: Theme[];
    openTab?: (pane: EditPane) => void;
    deleteTheme?: (id: string) => void;
    onClick?: (id: string, active: boolean) => void;
    activeId?: string;
    scroll?: boolean;
  }
): JSX.Element {
  const deleteTheme = props.deleteTheme
  const onClick = props.onClick
  const style: CSSProperties = props.scroll ? {height: "30em", overflowY: "scroll"} : {}
  return <ListGroup variant="flush" style={style}>
    {props.themes.slice(0).reverse().map((theme) =>
      <ThemeListItem
        key={theme.id}
        theme={theme}
        openTab={props.openTab}
        deleteTheme={deleteTheme ? (): void => deleteTheme(theme.id) : undefined }
        onClick={onClick ? (): void =>
          onClick(theme.id, theme.id === props.activeId) : undefined
        }
        active={theme.id === props.activeId}
      />
    )}
  </ListGroup>
}