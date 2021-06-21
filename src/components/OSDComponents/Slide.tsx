import React from 'react';
import { EventParameters, OnScreenComponentState, OSDWithState, Styles } from '../../reducers/shared';
import { SlideComponent } from './SlideComponent'
import * as Mustache from 'mustache'
import { renderNode, usedStylesTree } from '.';

interface SlidesProps {
  components: OSDWithState<SlideComponent>[];
  parameters?: EventParameters;
  styles: Styles;
}

interface SlideProps {
  src: string;
  width: number;
  height: number;
  top: number;
  left: number;
  state: OnScreenComponentState;
  title: string;
  subtitle: string;
  body: string;
}

function withOrdinals(s: string): JSX.Element {
  const index = s.search(/(1st|2nd|3rd|[0-9]th)/)
  if (index >= 0) {
    return <>
      {s.slice(0, index + 1)}
      <sup>{s.slice(index + 1, index + 4)}</sup>
      {withOrdinals(s.slice(index + 4))}
    </>
  }
  return <>{s}</>
}
function Slide(props: SlideProps): JSX.Element {
  const className = props.state === "entering" || props.state === "visible" ?  "component-visible" : "component-hidden"
  const subtitle = props.subtitle.split('\n').map ((item, i) => <p key={i}>{withOrdinals(item)}</p>)
  const body = props.body.split('\n').map ((item, i) => <p key={i}>{withOrdinals(item)}</p>)
  return <div className={"individual " + className}>
    <div className="image" style={{top: props.top, left: props.left}}>
      <img alt="" src={props.src} width={props.width} height={props.height} />
    </div>
    <div className="title">{withOrdinals(props.title)}</div>
    <div className="subtitle">{subtitle}</div>
    <div className="body">{body}</div>
    <div className="extra1"><span></span></div>
    <div className="extra2"><span></span></div>
    <div className="extra3"><span></span></div>
    <div className="extra4"><span></span></div>
  </div>
}

export function Slides(props: SlidesProps): JSX.Element {
  const text = (template: string): string =>
    props.parameters ? Mustache.render(template, props.parameters) : template

  const tree = usedStylesTree(props.components, props.styles)

  return <>{tree.children.map((n) => renderNode(n, props.components, props.styles, (c) =>
    <Slide
      key={c.component.id}
      src={text(c.component.src)}
      width={c.component.width}
      height={c.component.height}
      top={c.component.top}
      left={c.component.left}
      state={c.state}
      title={text(c.component.title)}
      subtitle={text(c.component.subtitle)}
      body={text(c.component.body || "")}
      />
  ))}</>
}