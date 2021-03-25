import React, { Component } from 'react';
import { classes } from '.';
import { OnScreenComponentState, OSDWithState, Styles } from '../../reducers/shared';
import './image.css';
import { ImageComponent } from './ImageComponent'
import { SharedStyles } from './SharedStyles';

interface ImagesProps {
  components: OSDWithState<ImageComponent>[];
  parameters?: { [name: string]: string };
  styles: Styles;
}

interface ImageProps {
  src: string;
  width: number;
  height: number;
  top: number;
  left: number;
  state: OnScreenComponentState;
  className: string | null;
}

function Image(props: ImageProps): JSX.Element {
  const customClassName = props.className ? ` ${props.className}` : ""
  const className = props.state === "entering" || props.state === "visible" ?  "image-component image-component-visible" : "image-component image-component-hidden"
  return <div style={{top: props.top, left: props.left}} className={"individual " + className + customClassName}>
    <img alt="" src={props.src} width={props.width} height={props.height} />
  </div>
}

export class Images extends Component<ImagesProps> {
  constructor(props: ImagesProps) {
    super(props);
  }

  render(): JSX.Element {
    return <>
      <SharedStyles components={this.props.components} styles={this.props.styles} />
      { this.props.components.map((c) =>
        <Image
          key={c.component.id}
          src={c.component.src}
          width={c.component.width}
          height={c.component.height}
          top={c.component.top}
          left={c.component.left}
          state={c.state}
          className={classes(c.component.style || null, this.props.styles)}
        />
      )}
    </>
  }
}