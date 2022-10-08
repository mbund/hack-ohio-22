import { PusherProvider, useCurrentMemberCount } from '../utils/pusher'
import { useSession } from 'next-auth/react'

const ConnectedCounter = () => {
  const connectionCount = useCurrentMemberCount()

  if (connectionCount <= 0) return null
  return (
    <span>
      <span className="font-bold">{connectionCount}</span> connected
    </span>
  )
}

export default function ConnectedCounterWrapper() {
  const { data: sess } = useSession()

  if (!sess || !sess.user?.id) return null

  return (
    <>
      <PusherProvider slug={`user-${sess.user?.id}`}>
        <ConnectedCounter />
      </PusherProvider>
    </>
  )
}