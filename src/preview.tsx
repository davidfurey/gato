import React from 'react';
import { ViewPanel } from './components/ViewPanel';
import { OSDComponent } from './OSDComponent';
import { OnScreenComponentState } from './reducers/shared'
import ReactDOMServer from 'react-dom/server';

export function renderComponent(component: OSDComponent): string {
  const onScreenComponent: { state: OnScreenComponentState, component: OSDComponent } = {
    state: "visible",
    component
  }

  return "<!doctype html>" + ReactDOMServer.renderToString(
    <html lang="en">
      <head>
        <link href="../../css/preview.css" rel="stylesheet"></link>
      </head>
      <body>
        <ViewPanel
          name={"local preview"}
          showCaption={false}
          preview={false}
          components={[onScreenComponent]}
          parameters={{}}
        />
      </body>
      </html>
    )
}
