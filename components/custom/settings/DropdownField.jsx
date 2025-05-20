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
    return (
        <div>
            <label >{label}</label>
            <Select onValueChange={(v)=>onhandleStyleChange(v)} defaultValue={value}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={value} />
                </SelectTrigger>
                <SelectContent>
                    {
                        options.map((opt ,i)=><SelectItem value={opt} key={i}>{opt}</SelectItem>)
                    }
                </SelectContent>
            </Select>
        </div>
    )
}

export default DropdownField