import React, { Component } from 'react';
import { OnScreenComponentState } from '../../reducers/shared';
import './slide.css';
import { SlideComponent } from './SlideComponent'
import * as Mustache from 'mustache'

interface SlidesProps {
  components: { state: OnScreenComponentState; component: SlideComponent }[];
  parameters?: { [name: string]: string };
}

interface SlideProps {
  src: string;
  width: number;
  height: number;
  top: number;
  left: number;
  state: OnScreenComponentState;
  className: string | null;
  title: string;
  subtitle: string;
}

function Slide(props: SlideProps): JSX.Element {
  const customClassName = props.className ? ` ${props.className}` : ""
  const className = props.state === "entering" || props.state === "visible" ?  "slide-component slide-component-visible" : "slide-component slide-component-hidden"
  const subtitle = props.subtitle.split('\n').map ((item, i) => <p key={i}>{item}</p>)
  return <div className={className + customClassName}>
    <div className="image" style={{top: props.top, left: props.left}}>
      <img alt="" src={props.src} width={props.width} height={props.height} />
    </div>
    <div className="title">{props.title}</div>
    <div className="subtitle">{subtitle}</div>
    <div className="extra1"><span></span></div>
    <div className="extra2"><span></span></div>
    <div className="extra3"><span></span></div>
    <div className="extra4"><span></span></div>
  </div>
}

export class Slides extends Component<SlidesProps> {
  constructor(props: SlidesProps) {
    super(props);
  }

  render(): JSX.Element {
    const text = (template: string): string =>
      this.props.parameters ? Mustache.render(template, this.props.parameters) : template

    return (
      <div className={this.props.components.find((c) => c.state === "entering" || c.state === "visible") ? "slide-components visible" : "slide-components"}>
        { this.props.components.map((c) =>
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
            className={c.component.className === undefined ? null : c.component.className}
          />
        )}
      </div>
    )
  }
}