import React, { Component } from 'react';
import { OnScreenComponentState } from '../../reducers/shared';
import './image.css';
import { ImageComponent } from './ImageComponent'

interface ImagesProps { 
  components: { state: OnScreenComponentState; component: ImageComponent }[];
}

interface ImageProps {
  src: string;
  width: number;
  height: number;
  top: number;
  left: number;
  state: OnScreenComponentState;
}

function Image(props: ImageProps): JSX.Element {
  return <div style={{top: props.top, left: props.left}} className={props.state === "entering" || props.state === "visible" ?  "image-component image-component-visible" : "image-component image-component-hidden"}>
    <img alt="" src={props.src} width={props.width} height={props.height} />    
  </div>
}

export class Images extends Component<ImagesProps> {
  constructor(props: ImagesProps) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <div className={this.props.components.find((c) => c.state === "entering" || c.state === "visible") ? "image-components visible" : "image-components"}>
        { this.props.components.map((c) =>
          <Image 
            key={c.component.id} 
            src={c.component.src} 
            width={c.component.width} 
            height={c.component.height} 
            top={c.component.top} 
            left={c.component.left} 
            state={c.state} 
          />
        )}
      </div>
    )
  }
}