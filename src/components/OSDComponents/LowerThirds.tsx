import React from 'react';
import { EventParameters, OnScreenComponentState, OSDWithState, Styles } from '../../reducers/shared';
import { LowerThirdsComponent } from './LowerThirdsComponent'
import * as Mustache from 'mustache'
import { renderNode, usedStylesTree } from '.';

interface LowerThirdsProps {
  components: OSDWithState<LowerThirdsComponent>[];
  parameters?: EventParameters;
  styles: Styles;
}

interface LowerThirdProps {
  title: string;
  subtitle: string;
  state: OnScreenComponentState;
}

function LowerThird(props: LowerThirdProps): JSX.Element {
  const className = props.state === "entering" || props.state === "visible" ?  "component-visible" : "component-hidden"
  const subtitle = props.subtitle.split('\n').map ((item, i) => <p key={i}>{item}</p>)
  return <div className={"individual " + className}>
    <div className="title">{props.title}</div>
    <div className="subtitle">{subtitle}</div>
    <div className="extra1"><span></span></div>
    <div className="extra2"><span></span></div>
    <div className="extra3"><span></span></div>
    <div className="extra4"><span></span></div>
  </div>
}

export function LowerThirds(props: LowerThirdsProps): JSX.Element {
  const text = (template: string): string =>
    props.parameters ? Mustache.render(template, props.parameters) : template

  const tree = usedStylesTree(props.components, props.styles)

  return <>{tree.children.map((n) => renderNode(n, props.components, props.styles, (c) =>
    <LowerThird
      key={c.component.id}
      title={text(c.component.title)}
      subtitle={text(c.component.subtitle)}
      state={c.state}
    />
  ))}</>
}