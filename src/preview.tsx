import React from 'react';
import { ViewPanel } from './components/ViewPanel';
import { OSDComponent } from './OSDComponent';
import { OnScreenComponentState, Styles, Themes } from './reducers/shared'
import ReactDOMServer from 'react-dom/server';
import { compileCss } from './components/PageStyle';

export function renderComponent(
  component: OSDComponent,
  parameters: { [name: string]: string },
  themes: Themes,
  styles: Styles,
  themeId: string | null,
): Promise<string> {
  const onScreenComponent: { state: OnScreenComponentState, component: OSDComponent } = {
    state: "visible",
    component
  }

  return compileCss(themes, styles, themeId).then((css) =>
    "<!doctype html>" + ReactDOMServer.renderToString(
      <html lang="en">
        <head>
          <link href="../../css/preview.css" rel="stylesheet"></link>
          <style type="text/css" dangerouslySetInnerHTML={{ __html: css }} />
        </head>
        <body>
          <ViewPanel
            name={"local preview"}
            showCaption={false}
            preview={false}
            components={[onScreenComponent]}
            parameters={parameters}
            themes={themes}
            styles={styles}
            themeId={themeId}
          />
        </body>
        </html>
      )
  )
}
