import { Input } from '@/components/ui/input'
import React from 'react'

const Inputfield = ({ label, value, onhandleInputChange }) => {
  return (
    <div>

      <label >{label}</label>
     

      <Input value={value || ""} onChange={(e) => onhandleInputChange(e.target.value)} />
    </div>
  )
}

export default Inputfield