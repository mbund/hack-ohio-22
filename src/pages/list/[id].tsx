import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
import TierListEditor from "../tierlisteditor";

const List = () => {
    const router = useRouter();
    const { data: session } = useSession();
    let id = router.query.id;
    if (typeof id !== "string") {
        // janky solution
        id = "";
    }
    const users = trpc.getTierListUsers.useQuery(id).data;
    if (users === undefined) {
        return <>Loading...</>
    }

    let viewingOrEditing;
    if (session && users.findIndex(x => x.id === session.id) !== -1) {
        viewingOrEditing = "Viewing"
    } else {
        viewingOrEditing = "Editing";
    }
    return <div>
        {/* {viewingOrEditing} tier list {id} is owned by {JSON.stringify(users.map(user => user.name))}. */}
        <TierListEditor id={id} />
    </div>
}

export default List;