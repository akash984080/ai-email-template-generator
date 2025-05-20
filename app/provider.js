//pre
// 'use client'

// import { useContext, useEffect, useState } from 'react'
// import { ConvexProvider, ConvexReactClient } from 'convex/react'
// import { GoogleOAuthProvider } from '@react-oauth/google'

// import { DragDropContext } from '@/context/DragDropcontext'
// import { Emailcontext } from '@/context/EmailTemplatecontext'
// import { ScreensizeContext } from '@/context/ScreensizeContext'
// import { SelectedElementContext } from '@/context/SelectedElement'
// import { UserDetailcontext } from '@/context/UserDetailContext'
// import { TextContext } from '@/context/Textcontext'

// const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

// // Safe JSON parse with fallback
// const safeParse = (str, fallback) => {
//   try {
//     return JSON.parse(str)
//   } catch {
//     console.warn('Failed to parse localStorage JSON. Using fallback.')
//     return fallback
//   }
// }

// export const Provider = ({ children }) => {
//   const [selectedElement, setSelectedElement] = useState()
//   const [dragElement, setDragElement] = useState()
//   const [emailTemplate, setEmailTemplate] = useState([])
//   const [history, setHistory] = useState([])
//   const [future, setFuture] = useState([])
//   const [screenSize, setScreenSize] = useState('desktop')
//   const [userdetail, setuserdetail] = useState()
//   const [expandedText, setExpandedText] = useState({})

//   // Load from localStorage on mount
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const storedUser = safeParse(localStorage.getItem('userdetail'), {})
//       const storedTemplates = safeParse(localStorage.getItem('emailtemplate'), [])

//       if (storedUser?.email) setuserdetail(storedUser)
//       if (Array.isArray(storedTemplates)) setEmailTemplate(storedTemplates)
//     }
//   }, [])

//   // Save emailTemplate to localStorage
//   useEffect(() => {
//     try {
//       localStorage.setItem('emailtemplate', JSON.stringify(emailTemplate))
//     } catch (err) {
//       console.error('Error saving emailtemplate to localStorage:', err)
//     }
//   }, [emailTemplate])

//   // Save userdetail to localStorage
//   useEffect(() => {
//     if (userdetail?.email) {
//       try {
//         localStorage.setItem('userdetail', JSON.stringify(userdetail))
//       } catch (err) {
//         console.error('Error saving userdetail to localStorage:', err)
//       }
//     }
//   }, [userdetail])

//   // Update emailTemplate when selectedElement changes
//   useEffect(() => {
//     if (selectedElement?.layout?.id) {
//       const updatedTemplate = emailTemplate.map(item =>
//         item.id === selectedElement.layout.id ? selectedElement.layout : item
//       )
//       setEmailTemplateWithHistory(updatedTemplate)
//     }
//   }, [selectedElement])

//   // Set emailTemplate with undo history tracking
//   const setEmailTemplateWithHistory = newTemplate => {
//     setHistory(prev => [...prev, emailTemplate])
//     setFuture([]) // Clear redo stack
//     setEmailTemplate(newTemplate)
//   }

//   const undo = () => {
//     if (history.length === 0) return
//     const previous = history[history.length - 1]
//     setHistory(prev => prev.slice(0, -1))
//     setFuture(f => [emailTemplate, ...f])
//     setEmailTemplate(previous)
//   }

//   const redo = () => {
//     if (future.length === 0) return
//     const next = future[0]
//     setFuture(f => f.slice(1))
//     setHistory(prev => [...prev, emailTemplate])
//     setEmailTemplate(next)
//   }

//   const canUndo = history.length > 0
//   const canRedo = future.length > 0

//   const toggleText = id => {
//     setExpandedText(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }))
//   }

//   return (
//     <ConvexProvider client={convex}>
//       <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT}>
//         <TextContext.Provider value={{ expandedText, toggleText }}>
//           <UserDetailcontext.Provider value={{ userdetail, setuserdetail }}>
//             <ScreensizeContext.Provider value={{ screenSize, setScreenSize }}>
//               <DragDropContext.Provider value={{ dragElement, setDragElement }}>
//                 <Emailcontext.Provider
//                   value={{
//                     emailTemplate,
//                     setEmailTemplate: setEmailTemplateWithHistory,
//                     undo,
//                     redo,
//                     canUndo,
//                     canRedo
//                   }}
//                 >
//                   <SelectedElementContext.Provider
//                     value={{ selectedElement, setSelectedElement }}
//                   >
//                     {children}
//                   </SelectedElementContext.Provider>
//                 </Emailcontext.Provider>
//               </DragDropContext.Provider>
//             </ScreensizeContext.Provider>
//           </UserDetailcontext.Provider>
//         </TextContext.Provider>
//       </GoogleOAuthProvider>
//     </ConvexProvider>
//   )
// }

// // Custom hooks
// export const useDragDrop = () => useContext(DragDropContext)
// export const useEmailTemplate = () => useContext(Emailcontext)
// export const useScreenSize = () => useContext(ScreensizeContext)
// export const useUserDetail = () => useContext(UserDetailcontext)
// export const useSelectedElement = () => useContext(SelectedElementContext)
// export const useTextState = () => useContext(TextContext)

'use client'

import { useContext, useEffect, useState } from 'react'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { nanoid } from 'nanoid'

import { DragDropContext } from '@/context/DragDropcontext'
import { Emailcontext } from '@/context/EmailTemplatecontext'
import { ScreensizeContext } from '@/context/ScreensizeContext'
import { SelectedElementContext } from '@/context/SelectedElement'
import { UserDetailcontext } from '@/context/UserDetailContext'
import { TextContext } from '@/context/Textcontext'

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

// ✅ Ensure all layouts have unique IDs
const sanitizeLayouts = layouts => {
  if (!Array.isArray(layouts)) {
    console.warn('sanitizeLayouts: Expected an array, got:', layouts)
    return []
  }

  const seen = new Set()
  return layouts.map(layout => {
    let id = layout.id
    if (!id || seen.has(id)) {
      id = nanoid()
    }
    seen.add(id)
    return { ...layout, id }
  })
}

// ✅ Safe JSON parse
const safeParse = (str, fallback) => {
  try {
    return JSON.parse(str)
  } catch {
    console.warn('Failed to parse localStorage JSON. Using fallback.')
    return fallback
  }
}

export const Provider = ({ children }) => {
  const [selectedElement, setSelectedElement] = useState()
  const [dragElement, setDragElement] = useState()
  const [emailTemplate, setEmailTemplateState] = useState([])
  const [history, setHistory] = useState([])
  const [future, setFuture] = useState([])
  const [screenSize, setScreenSize] = useState('desktop')
  const [userdetail, setuserdetail] = useState()
  const [expandedText, setExpandedText] = useState({})
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  // ✅ Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = safeParse(localStorage.getItem('userdetail'), {})
      const storedTemplates = safeParse(
        localStorage.getItem('emailtemplate'),
        []
      )

      if (storedUser?.email) setuserdetail(storedUser)
      if (Array.isArray(storedTemplates)) {
        const sanitized = sanitizeLayouts(storedTemplates)
        setEmailTemplateState(sanitized)
      }
    }
  }, [])

  // ✅ Save emailTemplate to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('emailtemplate', JSON.stringify(emailTemplate))
    } catch (err) {
      console.error('Error saving emailtemplate to localStorage:', err)
    }
  }, [emailTemplate])

  // ✅ Save userdetail to localStorage
  useEffect(() => {
    if (userdetail?.email) {
      try {
        localStorage.setItem('userdetail', JSON.stringify(userdetail))
      } catch (err) {
        console.error('Error saving userdetail to localStorage:', err)
      }
    }
  }, [userdetail])

  // ✅ Update emailTemplate when selectedElement changes
  useEffect(() => {
    if (selectedElement?.layout?.id) {
      const updatedTemplate = emailTemplate.map(item =>
        item.id === selectedElement.layout.id ? selectedElement.layout : item
      )
      setEmailTemplateWithHistory(updatedTemplate)
    }
  }, [selectedElement])

  // ✅ Set emailTemplate with undo history and function-style updates
  const setEmailTemplateWithHistory = newTemplateOrUpdater => {
    setEmailTemplateState(prevTemplate => {
      const newTemplate =
        typeof newTemplateOrUpdater === 'function'
          ? newTemplateOrUpdater(prevTemplate)
          : newTemplateOrUpdater

      const sanitized = sanitizeLayouts(newTemplate)
      setHistory(prev => [...prev, prevTemplate])
      setFuture([]) // Clear redo stack
      return sanitized
    })
  }

  const undo = () => {
    if (history.length === 0) return
    const previous = history[history.length - 1]
    setHistory(prev => prev.slice(0, -1))
    setFuture(f => [emailTemplate, ...f])
    setEmailTemplateState(previous)
  }

  const redo = () => {
    if (future.length === 0) return
    const next = future[0]
    setFuture(f => f.slice(1))
    setHistory(prev => [...prev, emailTemplate])
    setEmailTemplateState(next)
  }

  const canUndo = history.length > 0
  const canRedo = future.length > 0

  const toggleText = id => {
    setExpandedText(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  return (
    <ConvexProvider client={convex}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT}>
        <TextContext.Provider value={{ expandedText, toggleText }}>
          <UserDetailcontext.Provider value={{ userdetail, setuserdetail }}>
            <ScreensizeContext.Provider value={{ screenSize, setScreenSize }}>
              <DragDropContext.Provider value={{ dragElement, setDragElement }}>
                <Emailcontext.Provider
                  value={{
                    emailTemplate,
                    setEmailTemplate: setEmailTemplateWithHistory,
                    undo,
                    redo,
                    canUndo,
                    canRedo,
                    backgroundColor,
                    setBackgroundColor
                  }}
                >
                  <SelectedElementContext.Provider
                    value={{ selectedElement, setSelectedElement }}
                  >
                    {children}
                  </SelectedElementContext.Provider>
                </Emailcontext.Provider>
              </DragDropContext.Provider>
            </ScreensizeContext.Provider>
          </UserDetailcontext.Provider>
        </TextContext.Provider>
      </GoogleOAuthProvider>
    </ConvexProvider>
  )
}

// ✅ Custom hooks
export const useDragDrop = () => useContext(DragDropContext)
export const useEmailTemplate = () => useContext(Emailcontext)
export const useScreenSize = () => useContext(ScreensizeContext)
export const useUserDetail = () => useContext(UserDetailcontext)
export const useSelectedElement = () => useContext(SelectedElementContext)
export const useTextState = () => useContext(TextContext)

// 'use client'

// import { DragDropContext } from '@/context/DragDropcontext'
// import { Emailcontext } from '@/context/EmailTemplatecontext'
// import { ScreensizeContext } from '@/context/ScreensizeContext'
// import { SelectedElementContext } from '@/context/SelectedElement'
// import { UserDetailcontext } from '@/context/UserDetailContext'
// import { GoogleOAuthProvider } from '@react-oauth/google'
// import { ConvexProvider, ConvexReactClient } from 'convex/react'
// import { useContext, useEffect, useState } from 'react'
// import { TextContext } from '@/context/Textcontext'
// const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

// export const Provider = ({ children }) => {
//   const [selectedElement, setSelectedElement] = useState()
//   const [dragElement, setDragElement] = useState()
//   const [emailTemplate, setEmailTemplate] = useState([])
//   const [history, setHistory] = useState([])
//   const [future, setFuture] = useState([])
//   const [screenSize, setScreenSize] = useState('desktop')
//   const [userdetail, setuserdetail] = useState()
//   const [expandedText, setExpandedText] = useState({})
//   // Load from localStorage
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       try {
//         const storageStr = localStorage.getItem('userdetails')
//         const templateStr = localStorage.getItem('emailtemplate') ?? '[]'
//         const storage = storageStr ? JSON.parse(storageStr) : {}
//         const emailtemplatestorage = templateStr ? JSON.parse(templateStr) : []
//         setEmailTemplate(emailtemplatestorage)
//         if (storage?.email) setuserdetail(storage)
//       } catch (err) {
//         console.error('Error loading from localStorage:', err)
//       }
//     }
//   }, [])

//   // Save to localStorage
//   useEffect(() => {
//     try {
//       localStorage.setItem('emailtemplate', JSON.stringify(emailTemplate))
//     } catch (err) {
//       console.error('Error saving to localStorage:', err)
//     }
//   }, [emailTemplate])

//   useEffect(() => {
//     if (userdetail?.email) {
//       try {
//         localStorage.setItem('userdetails', JSON.stringify(userdetail))
//       } catch (err) {
//         console.error('Error saving userdetails to localStorage:', err)
//       }
//     }
//   }, [userdetail])

//   // Update template when selectedElement changes
//   useEffect(() => {
//     if (selectedElement?.layout?.id) {
//       const updatedEmailtemplate = emailTemplate.map(item =>
//         item.id === selectedElement.layout.id ? selectedElement.layout : item
//       )
//       setEmailTemplateWithHistory(updatedEmailtemplate)
//     }
//   }, [selectedElement])

//   // Set template with undo history tracking
//   const setEmailTemplateWithHistory = newTemplate => {
//     setHistory(prev => [...prev, emailTemplate])
//     setFuture([]) // Clear redo stack
//     setEmailTemplate(newTemplate)
//   }

//   const undo = () => {
//     if (history.length === 0) return
//     const previous = history[history.length - 1]
//     setHistory(prev => prev.slice(0, -1))
//     setFuture(f => [emailTemplate, ...f])
//     setEmailTemplate(previous)
//   }

//   const redo = () => {
//     if (future.length === 0) return
//     const next = future[0]
//     setFuture(f => f.slice(1))
//     setHistory(prev => [...prev, emailTemplate])
//     setEmailTemplate(next)
//   }

//   const canUndo = history.length > 0
//   const canRedo = future.length > 0

//   const toggleText = id => {
//     setExpandedText(prev => ({
//       ...prev,
//       [id]: !prev[id]
//     }))
//   }

//   return (
//     <ConvexProvider client={convex}>
//       <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT}>
//         <TextContext.Provider value={{ expandedText, toggleText }}>
//           <UserDetailcontext.Provider value={{ userdetail, setuserdetail }}>
//             <ScreensizeContext.Provider value={{ screenSize, setScreenSize }}>
//               <DragDropContext.Provider value={{ dragElement, setDragElement }}>
//                 <Emailcontext.Provider
//                   value={{
//                     emailTemplate,
//                     setEmailTemplate: setEmailTemplateWithHistory,
//                     undo,
//                     redo,
//                     canUndo,
//                     canRedo
//                   }}
//                 >
//                   <SelectedElementContext.Provider
//                     value={{ selectedElement, setSelectedElement }}
//                   >
//                     {children}
//                   </SelectedElementContext.Provider>
//                 </Emailcontext.Provider>
//               </DragDropContext.Provider>
//             </ScreensizeContext.Provider>
//           </UserDetailcontext.Provider>
//         </TextContext.Provider>
//       </GoogleOAuthProvider>
//     </ConvexProvider>
//   )
// }

// export const useDragDrop = () => useContext(DragDropContext)
// export const useEmailTemplate = () => useContext(Emailcontext)
// export const useScreenSize = () => useContext(ScreensizeContext)
// export const useUserDetail = () => useContext(UserDetailcontext)
// export const useSelectedElement = () => useContext(SelectedElementContext)
// export const useTextState = () => {
//   return useContext(TextContext)
// }

// 'use client'

// import { DragDropContext } from '@/context/DragDropcontext'
// import { Emailcontext } from '@/context/EmailTemplatecontext'
// import { ScreensizeContext } from '@/context/ScreensizeContext'
// import { SelectedElementContext } from '@/context/SelectedElement'
// import { UserDetailcontext } from '@/context/UserDetailContext'
// import { GoogleOAuthProvider } from '@react-oauth/google'
// import { ConvexProvider, ConvexReactClient } from 'convex/react'
// import { useContext, useEffect, useState } from 'react'

// const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

// export const Provider = ({ children }) => {
//   const [selectedElement, setSelectedElement] = useState()
//   const [dragElement, setDragElement] = useState()
//   const [emailTemplate, setEmailTemplate] = useState([])
//   const [history, setHistory] = useState([])
//   const [future, setFuture] = useState([])
//   const [screenSize, setScreenSize] = useState('desktop')
//   const [userdetail, setuserdetail] = useState()

//   // Load from localStorage
//   const loadFromLocalStorage = () => {
//     try {
//       const storageStr = localStorage.getItem('userdetails')
//       const templateStr = localStorage.getItem('emailtemplate') ?? '[]'
//       const storage = storageStr ? JSON.parse(storageStr) : {}
//       const emailtemplatestorage = templateStr ? JSON.parse(templateStr) : []

//       // Validate emailtemplate data
//       if (Array.isArray(emailtemplatestorage)) {
//         setEmailTemplate(emailtemplatestorage)
//       } else {
//         console.error('Invalid emailtemplate data in localStorage.')
//       }

//       if (storage?.email) setuserdetail(storage)
//     } catch (err) {
//       console.error('Error loading from localStorage:', err)
//     }
//   }

//   useEffect(() => {
//     if (typeof window !== 'undefined') loadFromLocalStorage()
//   }, [])

//   // Save to localStorage
//   useEffect(() => {
//     try {
//       localStorage.setItem('emailtemplate', JSON.stringify(emailTemplate))
//     } catch (err) {
//       console.error('Error saving to localStorage:', err)
//     }
//   }, [emailTemplate])

//   useEffect(() => {
//     if (userdetail?.email) {
//       try {
//         localStorage.setItem('userdetails', JSON.stringify(userdetail))
//       } catch (err) {
//         console.error('Error saving userdetails to localStorage:', err)
//       }
//     }
//   }, [userdetail])

//   // Update template when selectedElement changes
//   useEffect(() => {
//     if (selectedElement?.layout?.id) {
//       const updatedEmailtemplate = emailTemplate.map(item =>
//         item.id === selectedElement.layout.id ? selectedElement.layout : item
//       )
//       setEmailTemplateWithHistory(updatedEmailtemplate)
//     }
//   }, [selectedElement])

//   // Set template with undo history tracking
//   const setEmailTemplateWithHistory = (newTemplate) => {
//     setHistory((prev) => [...prev, emailTemplate])
//     setFuture([]) // Clear redo stack
//     setEmailTemplate(newTemplate)
//   }

//   const undo = () => {
//     if (history.length === 0) return
//     const previous = history[history.length - 1]
//     setHistory((prev) => prev.slice(0, -1))
//     setFuture((f) => [emailTemplate, ...f])
//     setEmailTemplate(previous)
//   }

//   const redo = () => {
//     if (future.length === 0) return
//     const next = future[0]
//     setFuture((f) => f.slice(1))
//     setHistory((prev) => [...prev, emailTemplate])
//     setEmailTemplate(next)
//   }

//   const canUndo = history.length > 0
//   const canRedo = future.length > 0

//   return (
//     <ConvexProvider client={convex}>
//       <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT}>
//         <UserDetailcontext.Provider value={{ userdetail, setuserdetail }}>
//           <ScreensizeContext.Provider value={{ screenSize, setScreenSize }}>
//             <DragDropContext.Provider value={{ dragElement, setDragElement }}>
//               <Emailcontext.Provider
//                 value={{
//                   emailTemplate,
//                   setEmailTemplate: setEmailTemplateWithHistory,
//                   undo,
//                   redo,
//                   canUndo,
//                   canRedo
//                 }}
//               >
//                 <SelectedElementContext.Provider value={{ selectedElement, setSelectedElement }}>
//                   {children}
//                 </SelectedElementContext.Provider>
//               </Emailcontext.Provider>
//             </DragDropContext.Provider>
//           </ScreensizeContext.Provider>
//         </UserDetailcontext.Provider>
//       </GoogleOAuthProvider>
//     </ConvexProvider>
//   )
// }

// export const useDragDrop = () => useContext(DragDropContext)
// export const useEmailTemplate = () => useContext(Emailcontext)
// export const useScreenSize = () => useContext(ScreensizeContext)
// export const useUserDetail = () => useContext(UserDetailcontext)
// export const useSelectedElement = () => useContext(SelectedElementContext)
