import { useSession } from 'next-auth/client'
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { User } from 'src/pages/members'

export default function useFollowUser(userId: string) {
  const queryClient = useQueryClient()
  const [session, loading] = useSession()
  const [currentUser, setCurrentUser] = useState<User>({})
  useEffect(() => {
    if (!loading && session) {
      setCurrentUser(session.user)
    }
  }, [loading, session])

  const { mutate: toggleFollow } = useMutation(
    () =>
      fetch(`/api/fauna/toggle-follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
        }),
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Something went wrong!!')
        }
        return res.json()
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries('api/fauna/who-to-follow')
      },
    }
  )

  return {
    shouldShowFollowButton: currentUser.id !== userId,
    toggleFollow,
  }
}
