import React, { Component } from 'react';
import * as ReactDOM from "react-dom";

interface ParentState {
  visible: boolean;
  link: string;
}

export class Parent extends Component<unknown, ParentState> {
  state: ParentState = {
    visible: true,
    link: "",
  }

  constructor(props: unknown) {
    super(props)
    setInterval(() => {
      console.log("Flipping state")
      this.setState((prev) => {
        return {
          visible: !prev.visible
        }
      })
    }, 5000)
  }


//Your modified code.

// create deeplink to preview of each lower-third

// const puppeteer = require('puppeteer');
// (async () => {
//   const browser = await puppeteer.launch({ headless: false });
//   const page = await browser.newPage();
//   await page.goto(`http://localhost:3000/components/lower-third/${id}`);
//   await page.screenshot({
//     clip: { x: 0, y: 0, width: 1920, height: 1080 },
//     omitBackground: true,
//     path: `lower-third-${id}`
//   });
//   await browser.close();
// })().catch(console.error);

  render(): JSX.Element {
    return (
      <div>
      {/* <LowerThirds title="First Reading" subtitle="St Paul" visible={this.state.visible} /> */}
      </div>
    )
  }
}

ReactDOM.render(
  <Parent />,
  document.getElementById("root")
);
