import React from 'react';
import { Col, InputGroup } from 'react-bootstrap';
import { ImagePicker } from '../ImagePicker';

function pathFromUrl(s: string): string {
  return new URL(s, "https://streamer-1").pathname
}

export function EditableImageUrl(props: {
  value: string;
  update: (s: string) => void;
}): JSX.Element {
  return <Col>
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>{pathFromUrl(props.value)}</InputGroup.Text>
      </InputGroup.Prepend>
      <InputGroup.Append>
        <ImagePicker
          initialPath={new URL(props.value).pathname.replace(/^\/[^/]*/, '')}
          style={{border: "1px solid var(--gray-dark)" }}
          image={props.update}
        />
      </InputGroup.Append>
    </InputGroup>
  </Col>
}