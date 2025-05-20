// "use client"
// import React, { useEffect, useRef, useState } from 'react'
// import Columnlayout from '../LayoutElements/Columnlayout'
// import { useDragDrop, useEmailTemplate, useScreenSize } from '@/app/provider'
// import ViewHTMLDialog from './ViewHTMLdialog'

// const Canvas = ({ viewHTMLcode, closeDialog }) => {
//   const { screenSize } = useScreenSize()
//   const { dragElement } = useDragDrop()
//   const { emailTemplate, setEmailTemplate } = useEmailTemplate()

//   const [dragover, setDragover] = useState(false)
//   const [HTMLcode, setHTMLcode] = useState("")
//   const HTMLref = useRef()

//   // Handle drag over
//   const handleDragover = (e) => {
//     if (dragElement?.draglayout) {
//       e.preventDefault()
//       setDragover(true)
//     }
//   }

//   // Handle drop event
//   const handledrop = () => {
//     setDragover(false)

//     if (dragElement?.draglayout) {
//       setEmailTemplate((prev) =>
//         Array.isArray(prev) ? [...prev, dragElement.draglayout] : [dragElement.draglayout]
//       )
//     } else {
//       console.warn('Invalid drag layout:', dragElement)
//     }
//   }

//   // Render layout based on type
//   const getLayoutcomponent = (layout) => {
//     if (layout?.type === "column") {
//       return <Columnlayout layout={layout} />
//     }

//     return <div className="text-red-500">Unknown layout type: {layout?.type}</div>
//   }

//   // Get HTML code for preview
//   const GetHTMLCode = () => {
//     if (HTMLref.current) {
//       const htmlContent = HTMLref.current.innerHTML
//       setHTMLcode(htmlContent)
//     }
//   }

//   useEffect(() => {
//     if (viewHTMLcode) {
//       GetHTMLCode()
//     }
//   }, [viewHTMLcode])

//   return (
//     <div className='mt-10 flex justify-center'>
//       <div
//         className={`
//           bg-white p-6 w-full border border-gray-300 rounded-lg shadow-md
//           ${screenSize === "desktop" ? 'max-w-2xl' : 'max-w-md'}
//           ${dragover ? 'bg-purple-50 border-purple-300' : ''}
//           transition-all duration-300 ease-in-out
//         `}
//         onDragOver={handleDragover}
//         onDrop={handledrop}
//         ref={HTMLref}
//       >
//         {emailTemplate?.length > 0 ? (
//           emailTemplate.map((layout, index) => (
//             <div key={index}>{getLayoutcomponent(layout)}</div>
//           ))
//         ) : (
//           <h2 className='p-4 text-center bg-gray-100 border border-dashed rounded-lg'>
//             Add Layout Here
//           </h2>
//         )}
//       </div>

//       <ViewHTMLDialog
//         openDialog={viewHTMLcode}
//         HTMLcode={HTMLcode}
//         closeDialog={closeDialog}
//       />
//     </div>
//   )
// }

// export default Canvas




'use client'
import React, { useEffect, useRef, useState } from 'react'
import Columnlayout from '../LayoutElements/Columnlayout'
import { useDragDrop, useEmailTemplate, useScreenSize } from '@/app/provider'
import ViewHTMLDialog from './ViewHTMLdialog'
import { nanoid } from 'nanoid'

const Canvas = ({ viewHTMLcode, closeDialog }) => {
  const { screenSize } = useScreenSize()
  const { dragElement } = useDragDrop()
  const { emailTemplate, setEmailTemplate } = useEmailTemplate()
console.log(emailTemplate);

  const [dragover, setDragover] = useState(false)
  const [HTMLcode, setHTMLcode] = useState("")
  const HTMLref = useRef()

  const handleDragover = (e) => {
    if (dragElement?.draglayout) {
      e.preventDefault()
      setDragover(true)
    }
  }

  const handledrop = () => {
    setDragover(false)

    if (dragElement?.draglayout) {
      const newLayout = {
        ...dragElement.draglayout,
        id: nanoid(), // ✅ Assign a unique ID to avoid key duplication
      }

      setEmailTemplate((prev) =>
        Array.isArray(prev) ? [...prev, newLayout] : [newLayout]
      )

      

    } else {
      console.warn('Invalid drag layout:', dragElement)
    }
  }

  const getLayoutcomponent = (layout) => {
    if (layout?.type === 'column') {
      return <Columnlayout layout={layout} />
    }

    return <div className="text-red-500">Unknown layout type: {layout?.type}</div>
  }

  const GetHTMLCode = () => {
    if (HTMLref.current) {
      const htmlContent = HTMLref.current.innerHTML
      setHTMLcode(htmlContent)
    }
  }

  useEffect(() => {
    if (viewHTMLcode) {
      GetHTMLCode()
    }
  }, [viewHTMLcode])

  return (
    <div className="mt-10 flex justify-center ">
      <div
        className={`
          bg-white p-6 w-full border border-gray-300 rounded-lg shadow-md
          ${screenSize === 'desktop' ? 'max-w-2xl' : 'max-w-md'}
          ${dragover ? 'bg-purple-50 border-purple-300' : ''}
          transition-all duration-300 ease-in-out
        `}
        onDragOver={handleDragover}
        onDrop={handledrop}
        ref={HTMLref}
      >
        
        {emailTemplate?.length > 0 ? (
          emailTemplate.map((layout) => (
            <div key={layout.id}>{getLayoutcomponent(layout)}</div> // ✅ use layout.id as key
          ))
        ) : (
          <h2 className="p-4 text-center bg-gray-100 border border-dashed rounded-lg">
            Add Layout Here
          </h2>
        )}
      </div>

      <ViewHTMLDialog
        openDialog={viewHTMLcode}
        HTMLcode={HTMLcode}
        closeDialog={closeDialog}
      />
    </div>
  )
}

export default Canvas
