
"use client"
import React, { useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import axios from 'axios'
import Prompt from '@/data/Prompt'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid'
import { useUserDetail } from '@/app/provider'
import { Loader } from 'lucide-react'
import { useRouter } from 'next/navigation'
const AIInputbox = () => {
  const [userinput, setUserInput] = useState()
  const [loading, setLoading] = useState(false)
  const saveTemplate = useMutation(api.emailTemplate.saveOrUpdateTemplate)
  const tId = uuidv4()
  const router = useRouter()
  const { userdetail, setuserdetail } = useUserDetail()


  const onGenerate = async () => {
    const PROMPT = Prompt.EMAIL_PROMPT + '\n-' + userinput

    setLoading(true)
    try {
      const result = await axios.post('/api/ai-email-generator', {
        prompt: PROMPT,

      })

      await saveTemplate({
        tId: tId,
        design: result.data,
        email: userdetail?.email,
        description: userinput
      })

      router.push('/editor/' + tId)
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)

    }
  }
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Describe the Email Template You Want to Generate
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Be specific about the purpose, content, or tone to get better results.
      </p>

      <Textarea
        placeholder="e.g., A welcome email for new subscribers with a 10% discount code"
        rows={6}
        className="text-base border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg"
        onChange={(e) => setUserInput(e.target.value)}
        value={userinput}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); 
            if (userinput?.length && !loading) {
              onGenerate();
            }
          }
        }}
      />

      <Button
        className="w-full mt-6 text-base py-6 rounded-xl"
        disabled={!userinput?.length || loading}
        onClick={onGenerate}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader className="animate-spin w-5 h-5" />
            Please wait...
          </span>
        ) : (
          "Generate Email Template"
        )}
      </Button>
    </div>

  )
}

export default AIInputbox


