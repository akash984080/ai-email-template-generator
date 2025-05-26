"use client"
import React, { useState, useEffect } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Mic, MicOff, Loader } from 'lucide-react'
import axios from 'axios'
import Prompt from '@/data/Prompt'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { v4 as uuidv4 } from 'uuid'
import { useUserDetail } from '@/app/provider'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const AIInputbox = () => {
  const [userinput, setUserInput] = useState()
  const [language, setLanguage] = useState('en')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const saveTemplate = useMutation(api.emailTemplate.saveOrUpdateTemplate)
  const tId = uuidv4()
  const router = useRouter()
  const { userdetail, setuserdetail } = useUserDetail()

  useEffect(() => {
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = language // Set recognition language based on selected language

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('')
        setUserInput(transcript)
      }

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        toast.error('Speech recognition error. Please try again.')
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      setRecognition(recognition)
    }

    return () => {
      if (recognition) {
        recognition.stop()
      }
    }
  }, [language]) // Reinitialize when language changes

  const toggleListening = () => {
    if (!recognition) {
      toast.error('Speech recognition is not supported in your browser.')
      return
    }

    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      try {
        recognition.start()
        setIsListening(true)
        toast.success('Listening... Speak now')
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        toast.error('Failed to start speech recognition')
      }
    }
  }

  const onGenerate = async () => {
    const PROMPT = Prompt.EMAIL_PROMPT + `\n- Generate the email template in ${language} language\n-` + userinput

    setLoading(true)
    try {
      const result = await axios.post('/api/ai-email-generator', {
        prompt: PROMPT,
      })

      await saveTemplate({
        tId: tId,
        design: result.data,
        email: userdetail?.email,
        description: userinput,
        language: language
      })

      router.push('/editor/' + tId)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      toast.error('Failed to generate template')
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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Language
        </label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="it">Italian</SelectItem>
            <SelectItem value="pt">Portuguese</SelectItem>
            <SelectItem value="ru">Russian</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="ko">Korean</SelectItem>
            <SelectItem value="ar">Arabic</SelectItem>
            <SelectItem value="hi">Hindi</SelectItem>
            <SelectItem value="ta">Tamil</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <Textarea
          placeholder="e.g., A welcome email for new subscribers with a 10% discount code"
          rows={6}
          className="text-base border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg pr-12"
          onChange={(e) => setUserInput(e.target.value)}
          value={userinput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              if (userinput?.length && !loading) {
                onGenerate()
              }
            }
          }}
        />
        <button
          onClick={toggleListening}
          className={`absolute right-3 top-3 p-2 rounded-full transition-all duration-200 ${
            isListening 
              ? 'bg-red-100 text-red-600 hover:bg-red-200' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice input'}
        >
          {isListening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
      </div>

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

      {isListening && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-center text-blue-700">
          <div className="animate-pulse w-3 h-3 bg-blue-600 rounded-full mr-2"></div>
          <span className="text-sm font-medium">Listening... Speak now</span>
        </div>
      )}
    </div>
  )
}

export default AIInputbox


