import { Input } from '@/components/ui/input'
import React from 'react'

const Inputfield = ({ label, value, onhandleInputChange }) => {
  return (
    <div className="space-y-2 w-full">
      <label className="text-sm font-medium text-gray-700 block">{label}</label>
      <textarea 
        value={value || ""} 
        onChange={(e) => onhandleInputChange(e.target.value)}
        className="w-full h-12 px-4 text-base focus:outline-none"
        rows={5}
        cols={5}
      />
    </div>
  )
}

export default Inputfield