import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File as FileIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onClear: () => void;
}

export function FileUpload({ onFileSelect, selectedFile, onClear }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  });

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div
              {...getRootProps()}
              className={`
                relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
                flex flex-col items-center justify-center p-10 text-center h-64
                ${isDragActive 
                  ? 'border-emerald-400 bg-emerald-50/10' 
                  : 'border-white/30 hover:border-emerald-300/50 hover:bg-white/5'}
              `}
            >
              <input {...getInputProps()} />
              <div className="bg-white/10 p-4 rounded-full mb-4 backdrop-blur-sm shadow-inner">
                <Upload className="w-8 h-8 text-emerald-300" />
              </div>
              <p className="text-lg font-medium text-white mb-2">
                {isDragActive ? 'أفلت الصورة هنا' : 'اضغط أو اسحب الصورة هنا'}
              </p>
              <p className="text-sm text-white/60">
                يدعم JPG, PNG, WEBP
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 flex items-center gap-4 shadow-lg"
          >
            <div className="bg-emerald-500/20 p-3 rounded-xl">
              <FileIcon className="w-8 h-8 text-emerald-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{selectedFile.name}</p>
              <p className="text-white/60 text-sm">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-red-300"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
