import * as React from "react"

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const DropdownField = ({ label, value, options, onhandleStyleChange }) => {
    // Ensure value is a string and has a default
    const safeValue = typeof value === 'string' ? value : options[0] || '';

    return (
        <div>
            <label>{label}</label>
            <Select 
                value={safeValue} 
                onValueChange={(v) => onhandleStyleChange(v)}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={safeValue} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((opt, i) => (
                        <SelectItem key={i} value={opt}>
                            {opt}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export default DropdownField