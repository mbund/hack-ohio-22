import {
    DndContext,
    PointerSensor,
    useSensor,
    useSensors,
    useDroppable,
    closestCorners,
    DragStartEvent,
    UniqueIdentifier,
    DragEndEvent,
    DragOverEvent,
    closestCenter,
} from "@dnd-kit/core";

import {
    arrayMove,
    horizontalListSortingStrategy,
    SortableContext,
    useSortable
} from "@dnd-kit/sortable";

import React from 'react';
import { CSS } from '@dnd-kit/utilities';

import { useState } from "react";

type Stif = {
    version: {
        major: 0,
        minor: 1,
        patch: 1,
    },
    name: string,
    tiers: {
        color: string,
        name: string
    }[],
    items: {
        name: string,
        tier: number,
        image: string,
    }[],
};

const TierListEditor = () => {
    const sensors = useSensors(
        useSensor(PointerSensor),
    )

    const [items, setItems] = useState([
        [1, 2, 3],
        [4],
        [],
    ]);

    const [active, setActive] = useState<undefined | UniqueIdentifier>();

    const getContainerIndex = (id: string): [number | undefined, number | undefined] => {
        if (id.startsWith("row:")) {
            return [parseInt(id.substring(4)), undefined];
        } else {
            // starts with item:
            for (let i = 0; i < items.length; i++) {
                for (let j = 0; j < items[i]!.length; j++) {
                    if (`item:${items[i]![j]}` === id) {
                        return [i, j];
                    }
                }
            }
            return [undefined, undefined];
        }
    }

    const onDragOver = (e: DragOverEvent) => {
        console.log(e.active.id, e.over?.id);

        if (!e.over) return;
        if (e.active.id === e.over.id) {
            return;
        }
        const [startRow, startCol] = getContainerIndex(e.active.id as string);
        if (startRow === undefined || startCol === undefined) {
            console.warn("ummm");
            return;
        }

        const [endRow, endCol] = getContainerIndex(e.over.id as string);
        console.log([startRow, startCol], [endRow]);
        if (endRow === undefined) {
            return;
        }

        let itemsCopy = [...items.map(x => [...x])];
        const [item] = itemsCopy[startRow]!.splice(startCol, 1);
        if (endCol === undefined) {
            itemsCopy[endRow]!.push(item!);
        } else {
            itemsCopy[endRow]!.splice(endCol!, 0, item!);
        }
        setItems(itemsCopy);
    }

    const onDragEnd = (e: DragEndEvent) => {
        console.log(e.active.id, e.over?.id);

        if (!e.over) return;
        if (e.active.id === e.over.id) {
            return;
        }
        const [startRow, startCol] = getContainerIndex(e.active.id as string);
        if (startRow === undefined || startCol === undefined) {
            console.warn("ummm");
            return;
        }

        const [endRow, endCol] = getContainerIndex(e.over.id as string);
        console.log([startRow, startCol], [endRow]);
        if (endRow === undefined) {
            return;
        }

        let itemsCopy = [...items.map(x => [...x])];
        const [item] = itemsCopy[startRow]!.splice(startCol, 1);
        if (endCol === undefined) {
            itemsCopy[endRow]!.push(item!);
        } else {
            itemsCopy[endRow]!.splice(endCol!, 0, item!);
        }
        setItems(itemsCopy);
    }

    return <DndContext
        sensors={sensors}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
    >
        <div className="border-x border-black bg-[#1a1a17] flex flex-col">
            {items.map((x, i) => <Tier id={`row:${i}`} items={x} />)}
        </div>
    </DndContext>
}

const Tier = ({ items, id }: { items: number[], id: string }) => {
    const { setNodeRef } = useDroppable({ id: id });
    return <SortableContext strategy={horizontalListSortingStrategy} items={items.map(x => `item:${x}`)}>
        <div ref={setNodeRef} className="border-y border-black min-h-[80px] flex flex-row">
            <div style={{
                backgroundColor: 'rgb(255, 127, 127)'
            }} className="w-[100px] h-[80px] flex items-center justify-center">
                <span>{id}</span>
            </div>
            <div className="flex-1 flex-row flex-wrap flex">
                {items.map(x => <Item id={`item:${x}`} key={x} />)}
            </div>
        </div >
    </SortableContext>
}




const Item = ({ id }: { id: string }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        // transition,
    };
    return <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="w-[80px] h-[80px] object-cover block bg-white text-center">{id}</div>
}

export default TierListEditor;