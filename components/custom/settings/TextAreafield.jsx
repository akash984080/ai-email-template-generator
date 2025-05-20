
import React, { useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'

const TextAreafield = ({ label, value, onhandleInputChange }) => {
  const textareaRef = useRef(null)
  const cursorPosition = useRef(null)

  const handleChange = (e) => {
    cursorPosition.current = e.target.selectionStart
    onhandleInputChange(e.target.value)
  }

  useEffect(() => {
    if (
      textareaRef.current &&
      document.activeElement === textareaRef.current &&
      cursorPosition.current !== null
    ) {
      textareaRef.current.setSelectionRange(cursorPosition.current, cursorPosition.current)
    }
  }, [value])

  return (
    <div>
      <label className="block mb-2 font-semibold">{label}</label>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        rows={6}
        className="w-full border p-2"
      />
    </div>
  )
}

export default React.memo(TextAreafield)
