import React from "react";
import { Container } from "react-bootstrap";

declare const COMMITHASH: string;

export function PageFooter(): JSX.Element {
  return <footer>
    <Container className="text-center mt-5">
      <span className="text-muted">
        GATO version <a className="text-muted" href="https://git.yellowbill.co.uk/david/on-screen-graphics/commit/{COMMITHASH}">
          {COMMITHASH.substring(0,7)}
        </a>
      </span>
    </Container>
  </footer>
}