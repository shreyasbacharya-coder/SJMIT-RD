import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { storage } from '../../lib/firebase/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  label: string;
  maxImages?: number;
}

export function ImageUpload({ images, onChange, label, maxImages = Infinity }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0 || !storage) return;

    setUploading(true);
    setError(null);
    const newImages = [...images];

    try {
      for (let i = 0; i < files.length; i++) {
        if (newImages.length >= maxImages) break;
        
        const file = files[i];
        const fileName = `${Date.now()}-${file.name}`;
        const storageRef = ref(storage, `images/${fileName}`);

        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        newImages.push(downloadURL);
      }
      onChange(newImages);
    } catch (err: any) {
      console.error('Firebase storage upload error:', err);
      setError(err.message || 'Image upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">{label}</label>
      <div className="flex flex-wrap gap-3">
        {images.map((url, index) => (
          <div 
            key={index} 
            className="relative h-20 w-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 cursor-pointer group"
            onClick={() => setPreviewImage(url)}
          >
            <img src={url} alt="Uploaded" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => removeImage(e, index)}
                className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-lg"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        {images.length < maxImages && (
          <label className="flex flex-col items-center justify-center h-20 w-20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-white/10 cursor-pointer hover:border-brand-start/50 hover:bg-brand-start/5 transition-all group">
            {uploading ? (
              <Loader2 className="animate-spin text-brand-start" size={20} />
            ) : (
              <>
                <Upload className="text-slate-400 dark:text-slate-500 group-hover:text-brand-start transition-colors" size={20} />
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-600 group-hover:text-brand-start mt-1 uppercase tracking-tighter">Add</span>
              </>
            )}
            <input type="file" multiple={maxImages > 1} accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        )}
      </div>
      {error && <p className="text-xs text-rose-500 font-medium mt-2">{error}</p>}

      {/* Lightbox Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl p-8"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            className="absolute top-8 right-8 p-3 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-all"
            onClick={() => setPreviewImage(null)}
          >
            <X size={32} />
          </button>
          <img 
            src={previewImage} 
            alt="Full screen preview" 
            className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
