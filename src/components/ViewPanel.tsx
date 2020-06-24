import { OSDComponent } from '../OSDComponent'
import React, { Component } from 'react';
import { LowerThirds } from './OSDComponents/LowerThirds';
import { Images } from './OSDComponents/Image';
import { ImageComponent, ImageType } from './OSDComponents/ImageComponent';
import { LowerThirdsComponent, LowerThirdsType } from './OSDComponents/LowerThirdsComponent';
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
    const visibleComponents = this.props.components.filter((c) => c.state === "entering" || c.state === "visible").sort(
      (a, b) => a.component.name < b.component.name ? -1 : 1
    )
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
    return components.filter((c) => c.component.type === LowerThirdsType) as
      { state: OnScreenComponentState; component: LowerThirdsComponent }[]
  }

  imageComponents = (
    components: { state: OnScreenComponentState; component: OSDComponent }[]
  ): { state: OnScreenComponentState; component: ImageComponent }[] => {
    return components.filter((c) => c.component.type === ImageType) as
      { state: OnScreenComponentState; component: ImageComponent }[]
  }

  render(): JSX.Element {
    return (
      <div className="view-panel">
        <div className={this.props.preview ? "view-panel-content view-panel-content-preview" : "view-panel-content"}>
        <LowerThirds components={this.lowerThirdsComponents(this.props.components)} />
        <Images components={this.imageComponents(this.props.components)} />
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