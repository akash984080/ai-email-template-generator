"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useRouter } from 'next/navigation'
import { useUserDetail } from '@/app/provider'
import { Loader2 } from 'lucide-react'

export const SigninButton = () => {
  const createuser = useMutation(api.users.createUser)
  const { setuserdetail } = useUserDetail()
  const [loading, setLoading] = useState(false)

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true)

      try {
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse?.access_token}`,
            },
          }
        )

        const user = userInfo?.data

        const result = await createuser({
          name: user?.name,
          email: user?.email,
          picture: user?.picture,
        })

        const userdetail = {
          ...user,
          id: result?.id ?? result,
        }

        setuserdetail(userdetail)
      } catch (err) {
        console.error("Login failed:", err)
      } finally {
        setLoading(false)
      }
    },
    onError: (errorResponse) => {
      console.error(errorResponse)
    },
  })

  return (
    <Button onClick={() => googleLogin()} disabled={loading}>
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {loading ? 'Signing in...' : 'Get Started'}
    </Button>
  )
}
