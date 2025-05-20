

// 'use client'
// import React, { useEffect, useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Code, Monitor, Smartphone, Undo2, Redo2, Send } from 'lucide-react'
// import Image from 'next/image'
// import { useEmailTemplate, useScreenSize, useUserDetail } from '@/app/provider'
// import { useMutation } from 'convex/react'
// import { api } from '@/convex/_generated/api'
// import { useParams, useRouter } from 'next/navigation'
// import { toast } from 'sonner'

// const EditorHeader = ({ viewHTMLcode }) => {
//   const { screenSize, setScreenSize } = useScreenSize()
//   const { emailTemplate, undo, redo, canUndo, canRedo } = useEmailTemplate()


//   const updatedEmailTemplate = useMutation(api.emailTemplate.saveOrUpdateTemplate)
//   const { templateId } = useParams()
//   const router = useRouter()
//   const { userdetail } = useUserDetail()

//   const [description, setDescription] = useState('')

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
//         e.preventDefault()
//         if (e.shiftKey) redo()
//         else undo()
//       } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
//         e.preventDefault()
//         redo()
//       }
//     }
//     window.addEventListener('keydown', handleKeyDown)
//     return () => window.removeEventListener('keydown', handleKeyDown)
//   }, [undo, redo])

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0
//       const isSaveCombo = (isMac && e.metaKey && e.key === 's') || (!isMac && e.ctrlKey && e.key === 's')

//       if (isSaveCombo) {
//         e.preventDefault()
//         onSaveTemplate()
//       }
//     }

//     window.addEventListener('keydown', handleKeyDown)
//     return () => window.removeEventListener('keydown', handleKeyDown)
//   }, [emailTemplate, description])

//   const sanitizeTemplate = (obj) => {
//     return JSON.parse(JSON.stringify(obj, (_, value) => {
//       if (
//         typeof value === 'function' ||
//         typeof value === 'symbol' ||
//         typeof value === 'undefined' ||
//         (value && typeof value === 'object' && '$$typeof' in value)
//       ) {
//         return undefined
//       }
//       return value
//     }))
//   }

//   const onSaveTemplate = async () => {
//     try {
//       const sanitizedTemplate = sanitizeTemplate(emailTemplate)

//       await updatedEmailTemplate({
//         tId: templateId,
//         design: sanitizedTemplate,
//         email: userdetail?.email,
//         description: description 
//       })

//       toast("Email template saved successfully")
//     } catch (error) {
//       console.error('Error saving template:', error)
//       toast.error("Failed to save template")
//     }
//   }

//   useEffect(() => {
//     if (!templateId && description.trim().length > 0) {
//       const debounce = setTimeout(() => {
//         onSaveTemplate()
//       }, 1000) // 1s debounce

//       return () => clearTimeout(debounce)
//     }
//   }, [description])


//   const handleSendEmail = () => {
//     router.push('/template/email')
//   }

//   return (
//     <div className="p-4 shadow-sm flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
//       {/* Logo */}
//       <div>
//         <Image src={'/next.svg'} alt='logo' width={160} height={150} />
//       </div>

//       {/* Screen Size Toggle Buttons */}
//       <div className="flex gap-2">
//         <Button onClick={() => setScreenSize("desktop")} variant="ghost"
//           className={`${screenSize == "desktop" && "bg-purple-100 text-primary"}`}>
//           <Monitor className="mr-1 w-4 h-4" /> Desktop
//         </Button>
//         <Button onClick={() => setScreenSize("mobile")} variant="ghost"
//           className={`${screenSize == "mobile" && "bg-purple-100 text-primary"}`}>
//           <Smartphone className="mr-1 w-4 h-4" /> Mobile
//         </Button>
//       </div>

//       {/* Actions */}
//       <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
//         <div className="flex gap-2">
//           <Button onClick={undo} variant="ghost" disabled={!canUndo} className="hover:text-primary">
//             <Undo2 className="mr-1 w-4 h-4" /> Undo
//           </Button>
//           <Button onClick={redo} variant="ghost" disabled={!canRedo} className="hover:text-primary">
//             <Redo2 className="mr-1 w-4 h-4" /> Redo
//           </Button>
//           <Button onClick={() => viewHTMLcode(true)} variant="ghost" className="hover:text-primary">
//             <Code />
//           </Button>
//           <Button variant="outline" onClick={handleSendEmail}>
//             <Send className="mr-1 w-4 h-4" /> Send Test Email
//           </Button>
//         </div>



//         <div className="flex flex-col gap-2 md:flex-row md:items-center">
//           {/* Only show input if template is created from scratch */}
//           {!templateId && (
//             <input
//               type="text"
//               placeholder="Enter template description..."
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="border rounded-lg px-3 py-2 text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-purple-300"
//             />
//           )}
//           <Button onClick={onSaveTemplate}>Save Template</Button>
//         </div>


//       </div>
//     </div>


//   )
// }

// export default EditorHeader



// 'use client'
// import React, { useEffect, useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Code, Monitor, Smartphone, Undo2, Redo2, Send } from 'lucide-react'
// import Image from 'next/image'
// import { useEmailTemplate, useScreenSize, useUserDetail } from '@/app/provider'
// import { useMutation, useQuery } from 'convex/react'
// import { useParams, useRouter } from 'next/navigation'
// import { toast } from 'sonner'
// import { api } from '@/convex/_generated/api'

// const EditorHeader = ({ viewHTMLcode  , isNew}) => {
//   const { screenSize, setScreenSize } = useScreenSize()
//   const { emailTemplate, undo, redo, canUndo, canRedo } = useEmailTemplate()
//   const updatedEmailTemplate = useMutation(api.emailTemplate.saveOrUpdateTemplate)
//   const { templateId } = useParams()
//   const router = useRouter()
//   const { userdetail } = useUserDetail()
// console.log(templateId);

//   const [description, setDescription] = useState('')
//   const [descriptionTouched, setDescriptionTouched] = useState(false)

//   const templateData = useQuery(api.emailTemplate.GetTemplateDesign, {
//     tId: templateId,
//     email: userdetail?.email,
//   })

//   // Set description from template data only if user hasn’t typed
//   useEffect(() => {
//     if (templateData?.description && !descriptionTouched) {
//       setDescription(templateData.description)
//     }
//   }, [templateData, descriptionTouched])

//   // Reset touched state when switching templates
//   useEffect(() => {
//     setDescriptionTouched(false)
//   }, [templateId])

//   // Undo/Redo shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
//         e.preventDefault()
//         if (e.shiftKey) redo()
//         else undo()
//       } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
//         e.preventDefault()
//         redo()
//       }
//     }
//     window.addEventListener('keydown', handleKeyDown)
//     return () => window.removeEventListener('keydown', handleKeyDown)
//   }, [undo, redo])

//   // Save shortcut (Ctrl/Cmd + S)
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       const isMac = navigator.platform.toUpperCase().includes('MAC')
//       const isSaveCombo = (isMac && e.metaKey && e.key === 's') || (!isMac && e.ctrlKey && e.key === 's')

//       if (isSaveCombo) {
//         e.preventDefault()
//         onSaveTemplate()
//       }
//     }
//     window.addEventListener('keydown', handleKeyDown)
//     return () => window.removeEventListener('keydown', handleKeyDown)
//   }, [emailTemplate, description])

//   const sanitizeTemplate = (obj) => {
//     return JSON.parse(JSON.stringify(obj, (_, value) => {
//       if (
//         typeof value === 'function' ||
//         typeof value === 'symbol' ||
//         typeof value === 'undefined' ||
//         (value && typeof value === 'object' && '$$typeof' in value)
//       ) {
//         return undefined
//       }
//       return value
//     }))
//   }

//   const onSaveTemplate = async () => {
//     try {
//       const sanitizedTemplate = sanitizeTemplate(emailTemplate)

//       await updatedEmailTemplate({
//         tId: templateId,
//         design: sanitizedTemplate,
//         email: userdetail?.email,
//         description: description
//       })

//       toast("Email template saved successfully")
//     } catch (error) {
//       console.error('Error saving template:', error)
//       toast.error("Failed to save template")
//     }
//   }

//   // Autosave description if no templateId
//   useEffect(() => {
//     if (!templateId && description.trim().length > 0) {
//       const debounce = setTimeout(() => {
//         onSaveTemplate()
//       }, 1000)

//       return () => clearTimeout(debounce)
//     }
//   }, [description])

//   const handleSendEmail = () => {
//     router.push('/template/email')
//   }
//   useEffect(() => {
//     if (templateId === 'new' && description.trim().length > 0) {
//       const debounce = setTimeout(() => {
//         onSaveTemplate()
//       }, 1000)
//       return () => clearTimeout(debounce)
//     }
//   }, [description])

//   return (
//     <div className="p-4 shadow-sm flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
//       {/* Logo */}
//       <div>
//         <Image src={'/next.svg'} alt='logo' width={160} height={150} />
//       </div>

//       {/* Screen Size Toggle Buttons */}
//       <div className="flex gap-2">
//         <Button onClick={() => setScreenSize("desktop")} variant="ghost"
//           className={`${screenSize == "desktop" && "bg-purple-100 text-primary"}`}>
//           <Monitor className="mr-1 w-4 h-4" /> Desktop
//         </Button>
//         <Button onClick={() => setScreenSize("mobile")} variant="ghost"
//           className={`${screenSize == "mobile" && "bg-purple-100 text-primary"}`}>
//           <Smartphone className="mr-1 w-4 h-4" /> Mobile
//         </Button>
//       </div>

//       {/* Actions */}
//       <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
//         <div className="flex gap-2">
//           <Button onClick={undo} variant="ghost" disabled={!canUndo} className="hover:text-primary">
//             <Undo2 className="mr-1 w-4 h-4" /> Undo
//           </Button>
//           <Button onClick={redo} variant="ghost" disabled={!canRedo} className="hover:text-primary">
//             <Redo2 className="mr-1 w-4 h-4" /> Redo
//           </Button>
//           <Button onClick={() => viewHTMLcode(true)} variant="ghost" className="hover:text-primary">
//             <Code />
//           </Button>
//           <Button variant="outline" onClick={handleSendEmail}>
//             <Send className="mr-1 w-4 h-4" /> Send Test Email
//           </Button>
//         </div>

//         <div className="flex flex-col gap-2 md:flex-row md:items-center">
//           {templateId === 'new'|| isNew && (
//             <input
//             required
//               type="text"
//               placeholder="Enter template description..."
//               value={description}
//               onChange={(e) => {
//                 setDescription(e.target.value)
//                 setDescriptionTouched(true)
//               }}
//               className="border rounded-lg px-3 py-2 text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-purple-300"
//             />
//           )}

//           <Button onClick={onSaveTemplate}>Save Template</Button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default EditorHeader


'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Code, Monitor, Smartphone, Undo2, Redo2, Send } from 'lucide-react'
import Image from 'next/image'
import { useEmailTemplate, useScreenSize, useUserDetail } from '@/app/provider'
import { useMutation, useQuery } from 'convex/react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { api } from '@/convex/_generated/api'

const EditorHeader = ({ viewHTMLcode, isNew }) => {
  const { screenSize, setScreenSize } = useScreenSize()
  const { emailTemplate, undo, redo, canUndo, canRedo } = useEmailTemplate()

  
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const isSaveCombo = (isMac && e.metaKey && e.key === 's') || (!isMac && e.ctrlKey && e.key === 's')

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        e.shiftKey ? redo() : undo()
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        redo()
      } else if (isSaveCombo) {
        e.preventDefault()
        onSaveTemplate()
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
      toast.error('Templatename is required before saving.',{position:'top-right',duration:1000,style:{color:"red"}})
      return
    }
  
    
  
    if (!userdetail?.email) return

    try {
      const sanitizedTemplate = sanitizeEmailTemplate(emailTemplate)

      await updatedEmailTemplate({
        tId: templateId,
        design: sanitizedTemplate,
        email: userdetail.email,
        description,
      })

      toast('Email template saved successfully')
    } catch (error) {
      console.error('Error saving template:', error)
      toast.error('Failed to save template')
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
    router.push('/template/email')
  }

  return (
    <div className="p-4 shadow-sm flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
      {/* Logo */}
      <div>
        <Image src="/next.svg" alt="logo" width={160} height={150} />
      </div>

      {/* Screen Size Toggle Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={() => setScreenSize('desktop')}
          variant="ghost"
          className={screenSize === 'desktop' ? 'bg-purple-100 text-primary' : ''}
        >
          <Monitor className="mr-1 w-4 h-4" /> Desktop
        </Button>
        <Button
          onClick={() => setScreenSize('mobile')}
          variant="ghost"
          className={screenSize === 'mobile' ? 'bg-purple-100 text-primary' : ''}
        >
          <Smartphone className="mr-1 w-4 h-4" /> Mobile
        </Button>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
        <div className="flex gap-2">
          <Button onClick={undo} variant="ghost" disabled={!canUndo} className="hover:text-primary">
            <Undo2 className="mr-1 w-4 h-4" /> Undo
          </Button>
          <Button onClick={redo} variant="ghost" disabled={!canRedo} className="hover:text-primary">
            <Redo2 className="mr-1 w-4 h-4" /> Redo
          </Button>
          <Button onClick={() => viewHTMLcode(true)} variant="ghost" className="hover:text-primary">
            <Code />
          </Button>
          <Button variant="outline" onClick={handleSendEmail}>
            <Send className="mr-1 w-4 h-4" /> Send Test Email
          </Button>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          {(templateId === 'new' || isNew) && (
            <input
              required
              type="text"
              placeholder="Enter Template Name..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setDescriptionTouched(true)
              }}
              className="border rounded-lg px-3 py-2 text-sm w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-purple-300"
            />
          )}
          <Button onClick={onSaveTemplate}>Save Template</Button>
        </div>
      </div>
    </div>
  )
}

export default EditorHeader
