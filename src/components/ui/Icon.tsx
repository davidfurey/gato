import React from 'react';

export function Icon(props: {
  name: string;
  raised?: boolean;
  large?: boolean;
  className?: string;
}): JSX.Element {
  const className = (props.className ? `${props.className} ` : "") +
    "material-icons" +
    (props.raised ? " material-icons-raised" : "") +
    (props.large ? " material-icons-large" : "")
  return <span className={className}>{ props.name}</span>
}
