import React from 'react';
import { usedStyles } from '.';
import { OSDComponent } from '../../OSDComponent';
import { OSDWithState, Styles } from '../../reducers/shared';

export function SharedStyles(props: {
  components: OSDWithState<OSDComponent>[];
  styles: Styles;
}): JSX.Element {
  return <>{Object.entries(usedStyles(props.components, props.styles)).map(([id, visible]) =>
  <div key={id} className={`shared style_${id}` + (visible ? " visible" : "")}>
    <div className="extra1"><span></span></div>
    <div className="extra2"><span></span></div>
    <div className="extra3"><span></span></div>
    <div className="extra4"><span></span></div>
  </div>
  )}</>
}