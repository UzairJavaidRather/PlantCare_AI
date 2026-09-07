import { useState } from 'react'

export default function ImageUpload({ onFileSelected }) {
  const [preview, setPreview] = useState(null)
  const [isDragging, setIsDragging] = useState(false)

  function selectFile(file) {
    if (!file) return

    setPreview(URL.createObjectURL(file))
    onFileSelected(file)
  }

  function handleChange(event) {
    selectFile(event.target.files[0])
  }

  function handleDrop(event) {
    event.preventDefault()
    setIsDragging(false)
    selectFile(event.dataTransfer.files[0])
  }

  return (
    <div className="w-full">
      <label
        onDragOver={(event) => event.preventDefault()}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`group relative block cursor-pointer overflow-hidden rounded-xl border-2 border-dashed p-5 text-center transition ${
          isDragging
            ? 'scale-[1.01] border-[#b88628] bg-[#fff9e8] shadow-[0_10px_24px_rgba(184,134,40,0.14)]'
            : 'border-[#b8cdb5] bg-[#f7faf1] hover:border-[#b88628] hover:bg-[#fff9e8]'
        }`}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
        />
        {preview ? (
          <div className="relative mx-auto w-fit overflow-hidden rounded-xl shadow-md">
            <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-xl object-cover transition duration-500 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#173b31]/80 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white">Choose another photo</span>
            </div>
          </div>
        ) : (
          <div className="py-3">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#173b31] text-2xl text-[#e7c56f] shadow-lg transition group-hover:rotate-6 group-hover:scale-105">✦</div>
            <p className="text-sm font-bold text-[#173b31]">{isDragging ? 'Drop your leaf photo here' : 'Bring a leaf into focus'}</p>
            <p className="mt-1 text-xs text-[#6d7b70]">{isDragging ? 'Release to begin the analysis' : 'Tap or drag a clear plant photo here'}</p>
            <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9aab9b]">JPG · PNG · WEBP</p>
          </div>
        )}
      </label>
    </div>
  )
}