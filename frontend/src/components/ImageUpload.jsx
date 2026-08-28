import { useState } from 'react'

export default function ImageUpload({ onFileSelected }) {
  const [preview, setPreview] = useState(null)

  function handleChange(event) {
    const file = event.target.files[0]
    if (!file) return

    setPreview(URL.createObjectURL(file))
    onFileSelected(file)
  }

  return (
    <div className="w-full">
      <label className="block border-2 border-dashed border-green-300 rounded-lg p-6 text-center cursor-pointer hover:bg-green-50">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
        />
        {preview ? (
          <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-lg" />
        ) : (
          <p className="text-gray-500">Click to upload a leaf photo</p>
        )}
      </label>
    </div>
  )
}