import React from 'react';
import { Col, Dropdown, DropdownButton } from 'react-bootstrap';

type ItemWithParent = {
  parent: string | null;
  id: string;
  name: string;
}

export function isAncestor(
  ancestor: string,
  descendent: string,
  items: Record<string, ItemWithParent>
): boolean {

  const parent = (id: string | null): string | null => id ? items[id]?.parent || null : null

  function inner(tortoiseId: string, hareId: string | null): boolean {

    const nextTortoise = parent(tortoiseId)
    const nextHare = parent(parent(hareId))

    if (nextTortoise === nextHare && nextTortoise !== null) {
      console.error(`Item ${tortoiseId} is part of a loop`)
      return true
    }

    if (nextTortoise === ancestor) {
      return true
    }

    if (nextTortoise) {
      return inner(nextTortoise, nextHare)
    }

    return false
  }

  return inner(descendent, descendent)
}

export function ParentSelector<T extends ItemWithParent>(props: {
  child: string;
  items: Record<string, T>;
  selected: T | undefined;
  update: (s: string | null) => void;
  filter?: (item: T) => boolean
}): JSX.Element {
  return <Col>
    <DropdownButton
      variant="secondary"
      title={props.selected ? props.selected.name : "(none)"}
    >
      <Dropdown.Item
          onClick={(): void => props.update(null)}
        >
          (none)
        </Dropdown.Item>
      {Object.values(props.items)
        .filter(props.filter ? props.filter : () => true)
        .filter((parent) => parent.id !== props.child)
        .map((parent) =>
        <Dropdown.Item
          key={parent.id}
          onClick={(): void => props.update(parent.id)}
          disabled={isAncestor(props.child, parent.id, props.items)}
        >
          {parent.name}
        </Dropdown.Item>
      )}
    </DropdownButton>
  </Col>
}