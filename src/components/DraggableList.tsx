import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult, DraggableProvidedDragHandleProps } from "react-beautiful-dnd";
import { ListGroup } from 'react-bootstrap'
import { reorder } from '../libs/lists'

interface WithID {
  id: string;
}

export function DraggableList<T extends WithID>(props: {
  children: (
    item: T,
    index: number,
    dragHandleProps?: DraggableProvidedDragHandleProps
  ) => React.ReactElement<HTMLElement>;
  items: T[];
  move: (item: T, position: number, newPosition: number) => void;
}): JSX.Element {

  const [privateItems, setPrivateItems] = useState<T[] | null>(null);
  const [timeout, setTimeoutValue] = useState<number | null>(null);

  const onDragStart = () => {
    // avoid things moving around during drag
    if (timeout) {
      clearTimeout(timeout)
    }
  }

  const onDragEnd = (result: DropResult) => {
    if (timeout) {
      clearTimeout(timeout)
    }

    setTimeoutValue(window.setTimeout(() => {
      setPrivateItems(null)
    }, 1000))

    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      props.items,
      result.source.index,
      result.destination.index
    );
    props.move(props.items[result.source.index], result.source.index, result.destination.index)
    setPrivateItems(newItems)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
      <Droppable droppableId="droppable">
        {(provided) => (
          <div
            {...provided.droppableProps}
            // eslint-disable-next-line @typescript-eslint/unbound-method
            ref={provided.innerRef}
          ><ListGroup>
            {(privateItems || props.items).map((item, index) => (
              <Draggable key={item.id} draggableId={item.id} index={index}>
                {(provided) => (
                  <div
                    // eslint-disable-next-line @typescript-eslint/unbound-method
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    style={provided.draggableProps.style}
                  >
                    {props.children(item, index, provided.dragHandleProps)}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ListGroup></div>
        )}
      </Droppable>
    </DragDropContext>
  );
}