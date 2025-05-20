
import { ToggleGroup } from '@/components/ui/toggle-group'
import { ToggleGroupItem } from '@radix-ui/react-toggle-group'
import React, { useEffect, useState } from 'react'

const Togglegroup = ({ label, value, onhandleStyleChange, options }) => {
    const [selectedValue, setSelectedValue] = useState(value)


    useEffect(() => {
        // Sync the component state when the value prop changes
        setSelectedValue(value)
    }, [value])


    const handleValueChange = (newValue) => {
        // Prevent clearing the value if the same item is clicked again
        if (!newValue) return;

        if (newValue !== selectedValue) {
            setSelectedValue(newValue);
            onhandleStyleChange(newValue);
        }
    };


    return (
        <div>
            <label>{label}</label>
            <ToggleGroup type="single" value={selectedValue} onValueChange={handleValueChange}>
                {options.map((option, i) => (
                    <ToggleGroupItem key={i} value={option.value} className='w-full'>
                        <option.icon />
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    )
}

export default Togglegroup
