'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Code, Monitor, Smartphone, Undo2, Redo2, Send, HelpCircle, Save } from 'lucide-react'
import Image from 'next/image'
import { useEmailTemplate, useScreenSize, useUserDetail } from '@/app/provider'
import { useMutation, useQuery } from 'convex/react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { api } from '@/convex/_generated/api'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

const EditorHeader = ({ viewHTMLcode, isNew }) => {
  const { screenSize, setScreenSize } = useScreenSize()
  const { emailTemplate, undo, redo, canUndo, canRedo } = useEmailTemplate()
  const [isSaving, setIsSaving] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  
  const updatedEmailTemplate = useMutation(api.emailTemplate.saveOrUpdateTemplate)
  const { templateId } = useParams()
  const router = useRouter()
  const { userdetail } = useUserDetail()

  const [description, setDescription] = useState('')
  const [descriptionTouched, setDescriptionTouched] = useState(false)

  const templateData = useQuery(
    api.emailTemplate.GetTemplateDesign,
    templateId && userdetail?.email
      ? { tId: templateId, email: userdetail.email }
      : 'skip'
  )

  useEffect(() => {
    if (templateData?.description && !descriptionTouched) {
      setDescription(templateData.description)
    }
  }, [templateData, descriptionTouched])

  useEffect(() => {
    setDescriptionTouched(false)
  }, [templateId])

  // Track unsaved changes
  useEffect(() => {
    if (templateData?.design) {
      const originalTemplate = JSON.stringify(templateData.design)
      const currentTemplate = JSON.stringify(emailTemplate)
      setHasUnsavedChanges(originalTemplate !== currentTemplate)
    }
  }, [emailTemplate, templateData])

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const isSaveCombo = (isMac && e.metaKey && e.key === 's') || (!isMac && e.ctrlKey && e.key === 's')
      const isHelpCombo = (isMac && e.metaKey && e.key === '/') || (!isMac && e.ctrlKey && e.key === '/')

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        e.shiftKey ? redo() : undo()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        redo()
      } else if (isSaveCombo) {
        e.preventDefault()
        onSaveTemplate()
      } else if (isHelpCombo) {
        e.preventDefault()
        setShowKeyboardShortcuts(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, emailTemplate, description])

  const sanitizeEmailTemplate = (obj) =>
    JSON.parse(JSON.stringify(obj, (_, value) => {
      if (
        typeof value === 'function' ||
        typeof value === 'symbol' ||
        typeof value === 'undefined' ||
        (value && typeof value === 'object' && '$$typeof' in value)
      ) {
        return undefined
      }
      return value
    }))

  const onSaveTemplate = async () => {
    if (!description.trim()) {
      toast.error('Template name is required before saving.', {
        position: 'top-right',
        duration: 2000,
        style: { color: "red" }
      })
      return
    }

    if (!userdetail?.email) {
      toast.error('User email is required to save template.')
      return
    }

    setIsSaving(true)
    try {
      const sanitizedTemplate = sanitizeEmailTemplate(emailTemplate)
      await updatedEmailTemplate({
        tId: templateId,
        design: sanitizedTemplate,
        email: userdetail.email,
        description,
      })
      setHasUnsavedChanges(false)
      toast.success('Email template saved successfully', {
        duration: 2000,
      })
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save template. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  // Autosave for new templates
  useEffect(() => {
    if ((templateId === 'new' || isNew) && description.trim()) {
      const debounce = setTimeout(() => {
        onSaveTemplate()
      }, 1000)
      return () => clearTimeout(debounce)
    }
  }, [description])

  const handleSendEmail = () => {
    if (hasUnsavedChanges) {
      toast.warning('Please save your changes before sending the email.')
      return
    }
    router.push('/template/email')
  }

  const KeyboardShortcutsHelp = () => (
    <Dialog open={showKeyboardShortcuts} onOpenChange={setShowKeyboardShortcuts}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          <div className="flex justify-between items-center">
            <span>Save Template</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl/Cmd + S</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span>Undo</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl/Cmd + Z</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span>Redo</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl/Cmd + Y</kbd>
          </div>
          <div className="flex justify-between items-center">
            <span>Show Help</span>
            <kbd className="px-2 py-1 bg-gray-100 rounded text-sm">Ctrl/Cmd + /</kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="p-4 shadow-sm flex flex-col gap-4 md:flex-row md:justify-between md:items-center bg-white">
      <TooltipProvider>
        {/* Screen Size Toggle Buttons */}
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setScreenSize('desktop')}
                variant="ghost"
                className={`${screenSize === 'desktop' ? 'bg-purple-100 text-primary' : ''} transition-colors`}
              >
                <Monitor className="mr-1 w-4 h-4" /> Desktop
              </Button>
            </TooltipTrigger>
            <TooltipContent>Switch to desktop view</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => setScreenSize('mobile')}
                variant="ghost"
                className={`${screenSize === 'mobile' ? 'bg-purple-100 text-primary' : ''} transition-colors`}
              >
                <Smartphone className="mr-1 w-4 h-4" /> Mobile
              </Button>
            </TooltipTrigger>
            <TooltipContent>Switch to mobile view</TooltipContent>
          </Tooltip>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
          <div className="flex flex-wrap gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={undo} variant="ghost" disabled={!canUndo} className="hover:text-primary">
                  <Undo2 className="mr-1 w-4 h-4" /> Undo
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo last action (Ctrl/Cmd + Z)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={redo} variant="ghost" disabled={!canRedo} className="hover:text-primary">
                  <Redo2 className="mr-1 w-4 h-4" /> Redo
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo last action (Ctrl/Cmd + Y)</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={() => viewHTMLcode(true)} variant="ghost" className="hover:text-primary">
                  <Code className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View HTML code</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={handleSendEmail} disabled={hasUnsavedChanges}>
                  <Send className="mr-1 w-4 h-4" /> Send To Email
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send a test email</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => setShowKeyboardShortcuts(true)}>
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Keyboard shortcuts (Ctrl/Cmd + /)</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            {(templateId === 'new' || isNew) && (
              <Input
                required
                type="text"
                placeholder="Enter Template Name..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setDescriptionTouched(true)
                }}
                className="border rounded-lg px-3 py-2 text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                maxLength={100}
              />
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={onSaveTemplate} 
                  disabled={isSaving || !description.trim()}
                  className="min-w-[100px]"
                >
                  {isSaving ? (
                    <>
                      <Save className="mr-1 w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-1 w-4 h-4" />
                      Save Template
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>Save template (Ctrl/Cmd + S)</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </TooltipProvider>

      <KeyboardShortcutsHelp />

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <span>You have unsaved changes</span>
          <Button variant="outline" size="sm" onClick={onSaveTemplate}>
            Save Now
          </Button>
        </div>
      )}
    </div>
  )
}

export default EditorHeader
