import React, { useState } from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { Loader2, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { analyzeMedicalImage, AnalysisType } from '@/services/geminiService';

interface AnalysisViewProps {
  type: AnalysisType;
}

export function AnalysisView({ type }: AnalysisViewProps) {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeMedicalImage(file, type);
      setResult(analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير متوقع');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  const getTitle = () => {
    switch (type) {
      case 'prescription': return 'تحليل الروشتة الطبية';
      case 'scan': return 'تحليل الأشعة والسونار';
      case 'lab-report': return 'تحليل نتائج المعامل';
      default: return 'تحليل طبي';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'prescription': return 'قم برفع صورة واضحة للروشتة لاستخراج الأدوية والجرعات.';
      case 'scan': return 'ارفع صورة الأشعة (X-ray, MRI, CT) للحصول على تقرير أولي.';
      case 'lab-report': return 'ارفع صورة تقرير التحليل لقراءة النتائج والمؤشرات.';
      default: return '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-2 mb-8">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white"
        >
          {getTitle()}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-white/60"
        >
          {getDescription()}
        </motion.p>
      </div>

      {/* Upload Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-panel rounded-3xl p-1"
      >
        <div className="bg-black/20 rounded-[22px] p-6 sm:p-8">
          <FileUpload 
            onFileSelect={setFile} 
            selectedFile={file} 
            onClear={handleClear} 
          />

          {file && !loading && !result && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 flex justify-center"
            >
              <button
                onClick={handleAnalyze}
                className="glass-button px-8 py-3 rounded-xl text-white font-semibold flex items-center gap-2 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all group"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                بدء التحليل
              </button>
            </motion.div>
          )}

          {loading && (
            <div className="mt-8 flex flex-col items-center justify-center text-white/80 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-pulse" />
                <Loader2 className="w-10 h-10 animate-spin text-emerald-400 relative z-10" />
              </div>
              <p className="animate-pulse">جاري تحليل الصورة بواسطة الذكاء الاصطناعي...</p>
            </div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-200"
            >
              <AlertCircle className="w-6 h-6 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Results Section */}
      {result && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl p-1"
        >
          <div className="bg-black/20 rounded-[22px] p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <h3 className="text-xl font-bold text-white">نتيجة التحليل</h3>
            </div>
            
            <div className="markdown-body text-right" dir="rtl">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-center">
              <button
                onClick={handleClear}
                className="text-white/50 hover:text-white text-sm transition-colors"
              >
                تحليل صورة أخرى
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
