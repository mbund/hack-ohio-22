import type { NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";
import { Header } from ".";

const Lists: NextPage = () => {
    const { status, data: session } = useSession({ required: true });
    if (status === "loading" || !session.user) {
        return "loading user...";
    }

    const createList = () => {

    }
    const titles = ["eating places", "movie theaters", "movies"];
    return <>
        <Header />
        <div className="bg-gray-200 min-h-screen">
            <main className="container mx-auto flex flex-col gap-4">
                <h2 className="font-bold md:text-[3rem] text-gray-600 text-center">{session.user.name}'s Lists</h2>
                {titles.map((x) => <List url="#" title={x}></List>)}
                <button
                    className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
                    onClick={createList}
                >+ New List</button>
            </main>
        </div>
    </>
}

type ListProps = {
    title: string,
    url: string,
}
const List = ({ title, url }: ListProps) => {
    return <div>
        <a href={url} className="flex flex-col md:flex-row items-center gap-6">
            <img src="example1.png" alt="image 1" className="w-56" />
            <h2 className="font-bold md:text-[3rem] text-gray-600">{title}</h2>
        </a>
    </div>
}

export default Lists;