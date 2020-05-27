import { OSDComponent } from '../OSDComponent'
import React, { Component } from 'react';
import { LowerThirds, LowerThirdsComponent } from './OSDComponents/LowerThirds';
import { OnScreenComponentState } from '../reducers/shared'

interface ViewPanelProps {
  name: string;
  components: { state: OnScreenComponentState; component: OSDComponent }[];
  showCaption: boolean;
  preview: boolean;
}

export class ViewPanel extends Component<ViewPanelProps> {

  constructor(props: ViewPanelProps) {
    super(props);
  }

  private visibleComponentSummary = (): string => {
    // todo: sort visibleComponents by name to avoid jumping
    const visibleComponents = this.props.components.filter((c) => c.state === "entering" || c.state === "visible")
    if (visibleComponents.length === 1) {
      return visibleComponents[0].component.name
    } else if (visibleComponents.length === 2) {
      return `${visibleComponents[0].component.name} and ${visibleComponents[1].component.name}`
    } else if (visibleComponents.length >= 3) {
      return `${visibleComponents[0].component.name}, ${visibleComponents[1].component.name}, etc`
    }
    return "(blank)"
  }

  lowerThirdsComponents = (
    components: { state: OnScreenComponentState; component: OSDComponent }[]
  ): { state: OnScreenComponentState; component: LowerThirdsComponent }[] => {
    return components.filter((c) => c.component.type === "lower-thirds") as 
      { state: OnScreenComponentState; component: LowerThirdsComponent }[]
  }
  render(): JSX.Element {
    return (
      <div className="view-panel">
        <div className={this.props.preview ? "view-panel-content view-panel-content-preview" : "view-panel-content"}>
        <LowerThirds components={this.lowerThirdsComponents(this.props.components)} />
        </div>
        { this.props.showCaption ? 
        <div className="view-panel-caption">
          <span className="view-panel-name">{this.props.name}</span>:&nbsp; 
          <span className="view-panel-component">{this.visibleComponentSummary()}</span>
        </div>
        : null}
      </div>
    )
  }
}