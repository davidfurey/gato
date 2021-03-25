import React, { Component } from 'react';
import { OnScreenComponentState, OSDWithState, Styles } from '../../reducers/shared';
import './lower-thirds.css';
import { LowerThirdsComponent } from './LowerThirdsComponent'
import * as Mustache from 'mustache'
import { classes } from '.';
import { SharedStyles } from './SharedStyles';

interface LowerThirdsProps {
  components: OSDWithState<LowerThirdsComponent>[];
  parameters?: { [name: string]: string };
  styles: Styles;
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
  return <div className={"individual " + className + customClassName}>
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

    return <>
      <SharedStyles components={this.props.components} styles={this.props.styles} />
      { this.props.components.map((c) =>
        <LowerThird
          key={c.component.id}
          title={text(c.component.title)}
          subtitle={text(c.component.subtitle)}
          state={c.state}
          className={classes(c.component.style || null, this.props.styles)}
        />
      )}
    </>
  }
}