
import React, { useState } from 'react'
import { toast } from 'sonner'

export default function ImagePreview({ label, value, onhandleInputChange }) {
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setUploading(true)
    try {
      const res = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        toast('Upload failed')
      }

      const data = await res.json()
      if (data.url) {
        onhandleInputChange(data.url)
      }
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label>{label}</label>

      {value ? (
        <img
          src={value}
          alt="image preview"
          className="w-full h-[150px] object-cover border rounded-xl"
        />
      ) : (
        <div className="w-full h-[150px] border rounded-xl flex items-center justify-center text-gray-400 text-sm bg-gray-50">
          No Image
        </div>
      )}

      <p className="font-medium text-sm mt-2">Image URL</p>
      <input
        value={value || ''}
        onChange={(e) => onhandleInputChange(e.target.value)}
        className="mt-2 border rounded px-2 py-1 w-full"
        placeholder="Enter image URL"
      />

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-2"
        />
        {uploading && <p className="text-sm text-blue-500 mt-1">Uploading...</p>}
      </div>
    </div>
  )
}

