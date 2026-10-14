import React, { useState, useRef } from 'react';
import { Upload, X, RefreshCw, Check, AlertCircle, Image as ImageIcon } from 'lucide-react';
import { useData } from '../../context/DataContext';

interface ImageUploaderProps {
  currentUrl?: string;
  bucket: 'site-assets' | 'service-images' | 'founder-images' | 'portfolio-images' | 'product-images';
  onImageUploaded: (url: string) => void;
  aspectRatio?: '16/9' | '4/3' | '1/1' | 'auto';
  label?: string;
  helpText?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentUrl,
  bucket,
  onImageUploaded,
  aspectRatio = '16/9',
  label = 'Upload Image',
  helpText = 'Supports JPG, PNG, WebP up to 5MB',
}) => {
  const { uploadImage } = useData();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);

    // 1. Validation
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP, SVG).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('File size exceeds 5MB limit. Please select a smaller image.');
      return;
    }

    // 2. Instant local preview
    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);
    setIsUploading(true);

    try {
      // 3. Upload to Supabase Storage
      const res = await uploadImage(bucket, file);
      if (res.url) {
        setPreviewUrl(res.url);
        onImageUploaded(res.url);
        setSuccessMsg(res.error ? 'Saved locally (Supabase bucket pending)' : 'Uploaded successfully to Supabase Storage!');
        setTimeout(() => setSuccessMsg(null), 4000);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setErrorMsg(`Upload failed: ${msg}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onImageUploaded('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case '16/9':
        return 'aspect-video';
      case '4/3':
        return 'aspect-4/3';
      case '1/1':
        return 'aspect-square';
      default:
        return 'min-h-[160px]';
    }
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)]">
            {label}
          </label>
          <span className="text-[10px] text-[var(--text-secondary)]">{helpText}</span>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/svg+xml"
        className="hidden"
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            handleFileProcess(e.target.files[0]);
          }
        }}
      />

      {previewUrl ? (
        <div
          className={`relative w-full rounded-xl overflow-hidden border border-[var(--color-border)] group bg-neutral-900 ${getAspectClass()}`}
        >
          <img
            src={previewUrl}
            alt="Uploaded asset preview"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />

          {isUploading && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-[var(--color-secondary)]" />
              <span className="text-xs font-mono">Uploading to Supabase...</span>
            </div>
          )}

          {/* Action overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white text-xs font-medium hover:bg-white/30 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 rounded-lg bg-rose-950/80 backdrop-blur-md text-rose-200 text-xs font-medium hover:bg-rose-900 transition-colors flex items-center gap-1.5"
            >
              <X className="w-3.5 h-3.5" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={e => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`w-full rounded-xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center ${
            isDragging
              ? 'border-[var(--color-primary)] bg-[var(--surface-soft)]'
              : 'border-[var(--color-border)] hover:border-[var(--color-secondary)] bg-[var(--surface-card)]'
          } ${getAspectClass()}`}
        >
          <div className="p-3 rounded-full bg-[var(--surface-soft)] text-[var(--color-secondary)] mb-3">
            <Upload className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-[var(--text-primary)]">
            Click to upload or drag & drop
          </p>
          <p className="text-[11px] text-[var(--text-secondary)] mt-1">
            PNG, JPG, WebP up to 5MB
          </p>
        </div>
      )}

      {/* Status Messages */}
      {errorMsg && (
        <div className="flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <Check className="w-3.5 h-3.5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
};
