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

import React, { useEffect } from 'react';
import { CSS } from '@dnd-kit/utilities';

import { useState } from "react";
import { url } from "inspector";
import { trpc } from "../utils/trpc";

type Stif = {
    version: {
        major: 0,
        minor: 1,
        patch: 2,
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

const fromStif = (stif: Stif) => {
    const items: string[][] = [];
    for (let i = 0; i < stif.tiers.length + 1; i++) {
        items.push([] as string[]);
    }
    for (const item of stif.items) {
        items[item.tier === -1 ? items.length - 1 : item.tier]!.push(item.image);
    }
    const tier = stif.tiers;
    const name = stif.name;
    return { items, tier, name };
}

const toStif = (items: string[][], tiers: { color: string, name: string }[], name: string) => {
    return {
        version: {
            major: 0,
            minor: 1,
            patch: 2,
        },
        name,
        tiers,
        items: items.flatMap((row, i) => row.map(url => ({
            name: url,
            image: url,
            tier: i === tiers.length ? -1 : i,
        })))
    }
}

const blankStif: Stif = {
    "version": {
        "major": 0,
        "minor": 1,
        "patch": 2
    },
    "name": "",
    "tiers": [
        {
            "color": "#39dd02",
            "name": "S"
        },
    ],
    "items": [
        {
            "name": "the_phantom_menace.jpg",
            "tier": -1,
            "image": "https://hack-ohio-22-tierlist-images.s3.amazonaws.com/the_phantom_menace.jpg"
        },
    ]
};

const TierListEditor = ({ id }: { id: string }) => {
    const sensors = useSensors(
        useSensor(PointerSensor),
    )

    const stif = blankStif

    // const x = trpc.getTierList.useQuery(id)
    // const y = x.data ?? { stif: blankStif }
    // const stif = y.stif as Stif
    // const stif = x.data?.stif as Stif
    // console.log(stif)
    
    // const [items, setItems] = useState(fromStif(stfFile).items);
    // console.log(x.data)
    // if (x.data?.stif === undefined) return <></>
    // const stif = x.data?.stif as Stif
    // console.log(stif)
    // const items = fromStif(stif).items
    const [items, setItems] = useState(fromStif(stif).items)
    const tiers = stif.tiers

    // const [active, setActive] = useState<undefined | UniqueIdentifier>();

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

        const itemsCopy = [...items.map(x => [...x])];
        const [item] = itemsCopy[startRow]!.splice(startCol, 1);
        if (endCol === undefined) {
            itemsCopy[endRow]!.push(item!);
        } else {
            itemsCopy[endRow]!.splice(endCol!, 0, item!);
        }
        setItems(itemsCopy);
        // trpc.setStif.useMutation().mutate({ id: id, stif: itemsCopy })
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

        const itemsCopy = [...items.map(x => [...x])];
        const [item] = itemsCopy[startRow]!.splice(startCol, 1);
        if (endCol === undefined) {
            itemsCopy[endRow]!.push(item!);
        } else {
            itemsCopy[endRow]!.splice(endCol!, 0, item!);
        }
        setItems(itemsCopy);
        // trpc.setStif.useMutation().mutate({ id: id, stif: itemsCopy })
    }

    return <DndContext
        sensors={sensors}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
    >
        <pre>{JSON.stringify(toStif(items, tiers, "odijfsoi"))}</pre>
        <div className="border-x border-black flex flex-col">
            {items.map((x, i) => <Tier key={i} color={tiers[i]?.color} name={tiers[i]?.name} isLast={i === items.length - 1} id={`row:${i}`} items={x} />)}
        </div>
    </DndContext>
}

const Tier = ({ items, id, isLast, color, name }: { items: string[], id: string, isLast: boolean, color: string | undefined, name: string | undefined }) => {
    const { setNodeRef } = useDroppable({ id: id });
    return <SortableContext strategy={horizontalListSortingStrategy} items={items.map(x => `item:${x}`)}>
        <div ref={setNodeRef} className={`${!isLast && "border-y border-black bg-[#1a1a17]"} ${isLast && "p-4 mt-4"} min-h-[80px] flex flex-row`}>
            {!isLast && <div style={{
                backgroundColor: color
            }} className="w-[100px] h-[80px] flex items-center justify-center">
                <span>{name}</span>
            </div>}
            <div className="flex-1 flex-row flex-wrap flex">
                {items.map(x => <Item id={`item:${x}`} key={x} />)}
            </div>
        </div >
    </SortableContext >
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
        // transform: CSS.Transform.toString(transform),
        // transition,
    };
    return <img ref={setNodeRef} style={style} {...attributes} {...listeners} className="w-[80px] h-[80px] object-cover block bg-white text-center" src={id.substring("item:".length)} />
}

export default TierListEditor;