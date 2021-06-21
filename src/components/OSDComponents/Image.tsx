import React from 'react';
import { renderNode, usedStylesTree } from '.';
import { EventParameters, OnScreenComponentState, OSDWithState, Styles } from '../../reducers/shared';
import { ImageComponent } from './ImageComponent'

interface ImagesProps {
  components: OSDWithState<ImageComponent>[];
  parameters?: EventParameters;
  styles: Styles;
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
  const className = props.state === "entering" || props.state === "visible" ?  "component-visible" : "component-hidden"
  return <div style={{top: props.top, left: props.left}} className={"individual " + className}>
    <img alt="" src={props.src} width={props.width} height={props.height} />
    <div className="extra1"><span></span></div>
    <div className="extra2"><span></span></div>
    <div className="extra3"><span></span></div>
    <div className="extra4"><span></span></div>
  </div>
}

export function Images(props: ImagesProps): JSX.Element {
  const tree = usedStylesTree(props.components, props.styles)

  return <>{tree.children.map((n) => renderNode(n, props.components, props.styles, (c) =>
    <Image
        key={c.component.id}
        src={c.component.src}
        width={c.component.width}
        height={c.component.height}
        top={c.component.top}
        left={c.component.left}
        state={c.state}
      />
  ))}</>
}