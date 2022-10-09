import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { Header } from ".";
import { TierList } from "@prisma/client";
import { useRouter } from "next/router";
import Link from "next/link";

const Lists: NextPage = () => {
    const { status, data: session } = useSession({ required: true });
    const tierLists: TierList[] = trpc.getTierLists.useQuery().data ?? [];
    const router = useRouter();
    const createPostMutation = trpc.createTierList.useMutation({
        onSuccess(data, variables, context) {
            data && router.push(`/list/${data.id}`);
        }
    });


    if (status === "loading" || !session.user) {
        return <>loading user...</>;
    }

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

    const stfFile: Stif = {
        "version": {
            "major": 0,
            "minor": 1,
            "patch": 2
        },
        "name": "star wars movies",
        "tiers": [
            {
                "color": "#39dd02",
                "name": "S"
            },
            {
                "color": "#4cb700",
                "name": "A"
            },
            {
                "color": "#8ad80d",
                "name": "B"
            },
            {
                "color": "#d7f738",
                "name": "C"
            },
            {
                "color": "#e5ac00",
                "name": "D"
            },
            {
                "color": "#fc2c02",
                "name": "F"
            }
        ],
        "items": [
            {
                "name": "the_phantom_menace.jpg",
                "tier": -1,
                "image": "https://hack-ohio-22-tierlist-images.s3.amazonaws.com/the_phantom_menace.jpg"
            },
            {
                "name": "attack_of_the_clones.jpg",
                "tier": -1,
                "image": "https://hack-ohio-22-tierlist-images.s3.amazonaws.com/attack_of_the_clones.jpg"
            },
            {
                "name": "revenge_of_the_sith.jpg",
                "tier": 0,
                "image": "https://hack-ohio-22-tierlist-images.s3.amazonaws.com/revenge_of_the_sith.jpg"
            },
            {
                "name": "a_new_hope.jpg",
                "tier": -1,
                "image": "https://hack-ohio-22-tierlist-images.s3.amazonaws.com/a_new_hope.jpg"
            },
            {
                "name": "the_empire_strikes_back.jpg",
                "tier": -1,
                "image": "https://hack-ohio-22-tierlist-images.s3.amazonaws.com/the_empire_strikes_back.jpg"
            },
            {
                "name": "return_of_the_jedi.jpg",
                "tier": -1,
                "image": "https://hack-ohio-22-tierlist-images.s3.amazonaws.com/return_of_the_jedi.jpg"
            }
        ]
    };

    const createList = () => {
        createPostMutation.mutate(stfFile)
    }

    return <>
        <Header />
        <div className="bg-gray-200 min-h-screen">
            <main className="container mx-auto flex flex-col gap-4 pb-5">
                <h2 className="font-bold md:text-[3rem] text-gray-600 text-center">{session.user.name}{"'"}s Lists</h2>
                {tierLists.map((x) => <List key={x.id} tierList={x}></List>)}
                <button
                    className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
                    onClick={createList}
                >+ New List</button>
            </main>
        </div>
    </>
}

type ListProps = {
    tierList: TierList
}
const List = ({ tierList }: ListProps) => {
    return <div>
        <Link href={`/list/${tierList.id}`}>
            <a href={`/list/${tierList.id}`} className="flex flex-col md:flex-row items-center gap-6">
                <img src="example1.png" alt="image 1" className="w-56" />
                <h2 className="font-bold md:text-[3rem] text-gray-600">{tierList.id}</h2>
            </a>
        </Link>
    </div>
}

export default Lists;