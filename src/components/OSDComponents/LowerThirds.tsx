import React, { Component } from 'react';
import { OSDComponent } from '../../OSDComponent';
import { OnScreenComponentState } from '../../reducers/shared';
import '../lower-thirds.css';

interface LowerThirdsProps { 
  components: { state: OnScreenComponentState; component: LowerThirdsComponent }[];
}

export interface LowerThirdsComponent extends OSDComponent {
  title: string;
  subtitle: string;
  type: "lower-thirds";
}

interface LowerThirdProps {
  title: string;
  subtitle: string;
  state: OnScreenComponentState;
}
function LowerThird(props: LowerThirdProps): JSX.Element {
  return <div className={props.state === "entering" || props.state === "visible" ?  "lower-third lower-third-visible" : "lower-third lower-third-hidden"}>
    <div className="title">{props.title}</div>
    <div className="subtitle">{props.subtitle}</div>
  </div>
}

export class LowerThirds extends Component<LowerThirdsProps> {
  constructor(props: LowerThirdsProps) {
    super(props);
  }

  render(): JSX.Element {
    return (
      <div className={this.props.components.find((c) => c.state === "entering" || c.state === "visible") ? "lower-thirds visible" : "lower-thirds"}>
        { this.props.components.map((c) =>
          <LowerThird 
            key={c.component.id} 
            title={c.component.title} 
            subtitle={c.component.subtitle} 
            state={c.state} 
          />
        )}
      </div>
    )
  }
}