import React from 'react'

const ElementLayoutcard = ({layout}) => {
  return (
    <div className='bg- flex flex-col justify-center items-center border border-dashed rounded-xl px-3 group hover:shadow-md hover:border-primary hover:cursor-pointer'>
    {
      <layout.icon className='p-2 h-9 w-9 group-hover:text-primary group-hover:bg-purple-100 bg-g rounded-full'
      />

    }
    <h2 className='text-sm group-hover:text-primary'>{layout.label}</h2>
  </div>
  )
}

export default ElementLayoutcard