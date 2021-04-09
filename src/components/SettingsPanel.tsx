import React, { useState } from 'react';
import { ListGroup, ListGroupItem, Col, DropdownButton, Dropdown, Row, ButtonGroup, Button, Modal, Form, Alert } from 'react-bootstrap'
import { ComponentType, OSDLiveEvents, Settings, Style, Styles, Themes, } from '../reducers/shared'
import { CollapsablePanel, IconButton } from './ui'
import { componentTypes, componentTypeAsString } from './OSDComponents';

export interface SettingsPanelProps {
  settings: Settings;
  events: OSDLiveEvents;
  themes: Themes;
  styles: Styles;
  setEvent: (eventId: string) => void;
  setDefaultStyle: (styleId: string | null, type: ComponentType) => void;
}

function StyleSelector(props: {
  styles: Style[]
  selected: Style | undefined;
  update: (styleId: string | null, componentType: ComponentType) => void;
  componentType: ComponentType;
}): JSX.Element {
  return <Col sm="9">
    <DropdownButton
      className="btn-block"
      size="sm"
      variant="secondary"
      title={props.selected ? props.selected.name : "(none)"}
    >
      <Dropdown.Item onClick={(): void => props.update(null, props.componentType)}>
        (none)
      </Dropdown.Item>
      {props.styles.filter((style) => style.componentType === props.componentType).map((style) =>
        <Dropdown.Item key={style.id} onClick={(): void =>
          props.update(style.id, props.componentType)
        }>{style.name}</Dropdown.Item>
      )}
    </DropdownButton>
  </Col>
}

function ImportExport(props: {
  import: string;
  export: string;
  name: string;
}): JSX.Element {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [error, setError] = useState(false);

  const handleClose = (): void => {
    setFile(undefined)
    setError(false)
    setShow(false)
  }

  const handleShow = (): void => setShow(true)

  const handleUpload = (): void => {
    setError(false)
    if (file !== undefined) {
      fetch(props.import, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: file
      }).then((response) => {
        if (response.status >= 200 && response.status < 300) {
          handleClose()
        } else {
          setError(true)
        }
      }).catch((error) => {
        setError(true)
        console.log(error)
      })
     } else {
       console.warn("Attempted to upload null file")
     }
  };

  return <ListGroup.Item className="d-flex justify-content-between align-items-center pl-5 border-bottom-0">
    { props.name }
    <ButtonGroup size="sm">
      <IconButton variant="danger" onClick={handleShow} icon="file_upload">Import</IconButton>
      <IconButton variant="info" icon="file_download" href={props.export} download>Export</IconButton>
    </ButtonGroup>
    <Modal show={show} onHide={handleClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Import { props.name.toLowerCase() }</Modal.Title>
      </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">This will overwrite existing { props.name.toLowerCase() } with the same id</Alert>
          { error ? <Alert variant="warning">An error occured while uploading. Please try again</Alert> : null }
          <Form.Group>
              <Form.File
                accept="application/json"
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFile(event.target.files ? event.target.files[0] : undefined)
                }}
              />
          </Form.Group>
        </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleUpload} disabled={file === undefined}>
          Upload
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  </ListGroup.Item>
}

export function SettingsPanel(props: SettingsPanelProps): JSX.Element {
  return (
    <CollapsablePanel header="Settings" open={false}>
      <ListGroup>
      <ListGroup.Item className="text-light font-weight-bold border-bottom-0 pb-1 pt-3">Default styles</ListGroup.Item>
      {componentTypes.map((componentType) => {
        const selectedStyleId = props.settings.defaultStyles[componentType]
      return <ListGroupItem key={componentType} className="pl-5 border-bottom-0">
        <Row><Col sm="3">{componentTypeAsString(componentType)}</Col>
        <StyleSelector
          selected={selectedStyleId ?
            props.styles[selectedStyleId] :
            undefined}
          styles={Object.values(props.styles)}
          update={props.setDefaultStyle}
          componentType={componentType}
        /></Row>
        </ListGroupItem>})}
        <ListGroup.Item className="text-light font-weight-bold border-top border-secondary border-bottom-0 mt-2 pb-1">Import/Export</ListGroup.Item>
        <ImportExport import="api/import/styles" export="api/export/styles" name="Styles" />
        <ImportExport import="api/import/themes" export="api/export/themes" name="Themes" />
      </ListGroup>
    </CollapsablePanel>
  )
}