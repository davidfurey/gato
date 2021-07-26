import React, { useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { IconButton } from './ui';
import { Theme, EventParameters } from '../reducers/shared';

interface ComponentDownloadButtonProps {
  id: string;
  parameters: EventParameters;
  theme: Theme
}

export function ComponentDownloadButton(props: ComponentDownloadButtonProps): JSX.Element {

  const [downloading, setDownloading] = useState(false)

  const queryParams: Record<string, string> = {}

  queryParams['themeId'] = props.theme.id

  Object.entries(props.parameters).forEach(([k, v]) => {
    queryParams[`param-${k}`] = v
  })

  const url = `api/preview/${props.id}.png?${new URLSearchParams(queryParams).toString()}`

  const downloadIndicator = () => {
    // This is a complete hack for now
    setDownloading(true)
    setTimeout(() => setDownloading(false), 8000)
  }

  return <Row className="mb-3">
    <Col>
      <IconButton
        variant={downloading ? "success" : "primary"}
        icon="file_download"
        href={url}
        download
        disabled={downloading}
        onClick={downloadIndicator}> {downloading ? "Downloading..." : "Download" }</IconButton>
    </Col>
  </Row>
}