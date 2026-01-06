
import React, { useState } from 'react';
import { Upload, Microscope, AlertCircle, FileText } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const VisionTool: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    const base64Data = image.split(',')[1];
    // Fix: Using the correct method name 'analyzeVision' from geminiService as defined in services/geminiService.ts
    const result = await geminiService.analyzeVision(base64Data, "اشرح محتوى هذه الصورة الطبية أو التقرير الأكاديمي.");
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Microscope size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">أداة تحليل الصور والتقارير الطبية</h2>
        <p className="text-slate-500 max-w-md mx-auto mb-8">
          قم برفع صور الأشعة، التقارير المخبرية، أو الوثائق الأكاديمية ليقوم الذكاء الاصطناعي بتحليلها وشرحها لك.
        </p>

        {!image ? (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-12 h-12 text-slate-400 mb-4" />
              <p className="mb-2 text-sm text-slate-700 font-bold">اضغط لرفع الملف</p>
              <p className="text-xs text-slate-500">PNG, JPG أو PDF (كصورة)</p>
            </div>
            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
          </label>
        ) : (
          <div className="space-y-6">
            <div className="relative group max-w-md mx-auto">
              <img src={image} alt="Selected" className="rounded-xl shadow-md max-h-64 mx-auto" />
              <button 
                onClick={() => setImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <AlertCircle size={16} />
              </button>
            </div>
            <button 
              onClick={analyzeImage}
              disabled={loading}
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2 mx-auto"
            >
              {loading ? 'جاري التحليل...' : 'بدء التحليل الذكي'}
              {!loading && <FileText size={20} />}
            </button>
          </div>
        )}
      </div>

      {analysis && (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-6 text-blue-600 font-bold border-b pb-4">
            <FileText size={24} />
            <h3>نتائج التحليل الأكاديمي/الطبي:</h3>
          </div>
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionTool;
