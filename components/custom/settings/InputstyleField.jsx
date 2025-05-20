import { Input } from '@/components/ui/input'
import React from 'react'

const InputstyleField = ({ label, value, onhandleStyleChange, type = "px" }) => {

    
    const formatedvalue = (value) => {
        
        const numericValue = value ? Number(value.toString().replace(/[^\d.-]/g, '')) : 0;
        return numericValue;
    }

    return (
        <div>
            <label >{label}</label>
            <div className='flex'>
                <Input type="text" value={formatedvalue(value)} onChange={(e) => onhandleStyleChange(e.target.value + type)} />
                <h2 className='p-1.5 bg-gray-100 rounded-r-lg -ml-1' >px</h2>
            </div>

        </div>
    )
}

export default InputstyleField