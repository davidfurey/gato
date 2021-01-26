import React, { Component } from 'react';
import { OnScreenComponentState } from '../../reducers/shared';
import './lower-thirds.css';
import { LowerThirdsComponent } from './LowerThirdsComponent'
import * as Mustache from 'mustache'

interface LowerThirdsProps {
  components: { state: OnScreenComponentState; component: LowerThirdsComponent }[];
  parameters?: { [name: string]: string };
}

interface LowerThirdProps {
  title: string;
  subtitle: string;
  state: OnScreenComponentState;
  className: string | null;
}

function LowerThird(props: LowerThirdProps): JSX.Element {
  const customClassName = props.className ? ` ${props.className}` : ""
  const className = props.state === "entering" || props.state === "visible" ?  "lower-third lower-third-visible" : "lower-third lower-third-hidden"
  const subtitle = props.subtitle.split('\n').map ((item, i) => <p key={i}>{item}</p>)
  return <div className={className + customClassName}>
    <div className="title">{props.title}</div>
    <div className="subtitle">{subtitle}</div>
  </div>
}

export class LowerThirds extends Component<LowerThirdsProps> {
  constructor(props: LowerThirdsProps) {
    super(props);
  }

  render(): JSX.Element {
    const text = (template: string): string =>
      this.props.parameters ? Mustache.render(template, this.props.parameters) : template

    return (
      <div className={this.props.components.find((c) => c.state === "entering" || c.state === "visible") ? "lower-thirds visible" : "lower-thirds"}>
        { this.props.components.map((c) =>
          <LowerThird
            key={c.component.id}
            title={text(c.component.title)}
            subtitle={text(c.component.subtitle)}
            state={c.state}
            className={c.component.className === undefined ? null : c.component.className}
          />
        )}
      </div>
    )
  }
}