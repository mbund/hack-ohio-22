import type { Channel, PresenceChannel } from 'pusher-js'
import type { StoreApi } from 'zustand/vanilla'
import type { PropsWithChildren } from 'react'
import { env } from "../env/client.mjs";
import { useEffect, useRef, useState } from 'react'
import Pusher from 'pusher-js'
// import { atom } from 'jotai'
import createContext from 'zustand/context'
import vanillaCreate from 'zustand/vanilla'
import State from 'pusher-js/types/src/core/http/state.js';

interface PusherZustandStore {
    pusherClient: Pusher
    channel: Channel
    presenceChannel: PresenceChannel
    members: Map<string, any>
}

const createPusherStore = (slug: string) => {
    let pusherClient: Pusher
    if (Pusher.instances.length) {
        pusherClient = Pusher.instances[0] as Pusher
        pusherClient.connect()
    } else {
        const randomUserId = `random-user-id:${Math.random().toFixed(7)}`
        pusherClient = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
            cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
            authEndpoint: '/api/pusher/auth-channel',
            auth: {
                headers: { user_id: randomUserId },
            },
        })
    }

    const channel = pusherClient.subscribe(slug)

    const presenceChannel = pusherClient.subscribe(
        `presence-${slug}`
    ) as PresenceChannel

    const store = vanillaCreate<PusherZustandStore>(() => {
        return {
            pusherClient,
            channel,
            presenceChannel,
            members: new Map(),
        }
    })

    // Update helper that sets 'members' to contents of presence channel's current members
    const updateMembers = () => {
        store.setState(() => ({
            members: new Map(Object.entries(presenceChannel.members.members)),
        }))
    }

    // Bind all "present users changed" events to trigger updateMembers
    presenceChannel.bind('pusher:subscription_succeeded', updateMembers)
    presenceChannel.bind('pusher:member_added', updateMembers)
    presenceChannel.bind('pusher:member_removed', updateMembers)

    return store
}

/**
 * Section 2: "The Context Provider"
 *
 * This creates a "Zustand React Context" that we can provide in the component tree.
 */
export const {
    Provider: PusherZustandStoreProvider,
    useStore: usePusherZustandStore,
} = createContext<StoreApi<PusherZustandStore>>()

/**
 * This provider is the thing you mount in the app to "give access to Pusher"
 *
 */
export const PusherProvider = ({
  slug,
  children,
}: PropsWithChildren<{ slug: string }>) => {
    const [store, setStore] = useState<ReturnType<typeof createPusherStore>>()

    useEffect(() => {
        const newStore = createPusherStore(slug)
        setStore(newStore)
        return () => {
            const pusher = newStore.getState().pusherClient
            console.log('disconnecting pusher and destroying store', pusher)
            console.log('(Expect a warning in terminal after this, React Dev Mode and all)')
            pusher.disconnect()
            newStore.destroy()
        }
    }, [slug])

    if (!store) return null

    return (
      <PusherZustandStoreProvider createStore={() => store}>
          {children}
      </PusherZustandStoreProvider>
    )
}

/**
 * Section 3: "The Hooks"
 *
 * The exported hooks you use to interact with this store (in this case just an event sub)
 */
export function useSubscribeToEvent<MessageType>(
  eventName: string,
  callback: (data: MessageType) => void
 ) {
    const channel = usePusherZustandStore(state => state.channel)

    const stableCallback = useRef(callback)

    useEffect(() => {
      stableCallback.current = callback
    }, [callback])

    useEffect(() => {
      const reference = (data: MessageType) => {
        stableCallback.current(data)
      }
      channel.bind(eventName, reference)
      console.log(`channel ${channel.name}`)
      return () => {
        channel.unbind(eventName, reference)
      }
    }, [channel, eventName])
}

export const useCurrentMemberCount = () => usePusherZustandStore(s => s.members.size)
