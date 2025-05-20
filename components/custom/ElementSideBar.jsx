"use client"
import Layout from '@/data/Layout'
import React from 'react'
import ElementLayoutcard from './ElementLayoutcard'
import ElementList from '@/data/ElementList'
import { useDragDrop } from '@/app/provider'

export const ElementSideBar = () => {
  const {dragElement , setDragElement} = useDragDrop()

  
 
   
  const onDragLayoutStart = (layout) => {
    const dragData = {
      draglayout: {
        ...layout,
        id: Date.now()
      }
    }
    console.log("Dragging Layout:", dragData)
    setDragElement(dragData)
  }
  
  const ElementStart = (element) => {
    const dragData = {
      dragElement: {
        ...element,
        id: Date.now()
      }
    }
    setDragElement(dragData)
  }
  return (
    <div className='p-5 h-screen overflow-x-scroll '>

      <h2 className='font-bold text-lg'>Layouts</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-3'>
        {
          Layout.map((layout, index) => (
            <div  key={index} draggable onDragStart={()=>onDragLayoutStart(layout)}>

              <ElementLayoutcard layout={layout} />
            </div>
          ))
        }
      </div>


     
      <h2 className='font-bold text-lg mt-6'>Elements</h2>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-3'>
        {
          ElementList.map((element, index) => (
            <div  key={index} draggable onDragStart={()=>ElementStart(element)}>

              <ElementLayoutcard layout={element}/>
            </div>
          ))
        }
      </div>


     
    </div>
  )
}
