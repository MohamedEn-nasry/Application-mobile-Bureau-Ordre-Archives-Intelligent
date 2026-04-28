import { useState } from 'react';
import { useNavigate } from 'react-router';
import { X, Zap, ZapOff, RotateCcw, Crop, Contrast, Image, FileText, Camera } from 'lucide-react';
import { StatusBar } from '../components/StatusBar';

export function ScanDocumentScreen() {
  const navigate = useNavigate();
  const [flashOn, setFlashOn] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanced, setEnhanced] = useState(false);

  const handleCapture = () => {
    setCaptured(true);
  };

  const handleEnhance = () => {
    setEnhancing(true);
    setTimeout(() => {
      setEnhancing(false);
      setEnhanced(true);
    }, 1500);
  };

  const handleOCR = () => {
    navigate('/ocr');
  };

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Status bar */}
      <div className="bg-black">
        <StatusBar light />
      </div>

      {/* Top controls */}
      <div className="flex items-center justify-between px-4 py-2 z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-9 h-9 rounded-full bg-white/15"
        >
          <X size={18} color="white" />
        </button>
        <h1 className="text-white text-[16px] font-bold">Scan Document</h1>
        <button
          onClick={() => setFlashOn(!flashOn)}
          className={`flex items-center justify-center w-9 h-9 rounded-full ${flashOn ? 'bg-yellow-400' : 'bg-white/15'}`}
        >
          {flashOn ? <Zap size={18} color="black" /> : <ZapOff size={18} color="white" />}
        </button>
      </div>

      {/* Camera view */}
      <div className="flex-1 relative mx-3 mb-3 rounded-3xl overflow-hidden">
        {!captured ? (
          <>
            {/* Simulated camera preview */}
            <div
              className="w-full h-full"
              style={{
                background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
              }}
            >
              {/* Simulated document/environment */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="w-[85%] h-[70%] rounded-lg opacity-20"
                  style={{
                    background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                  }}
                />
              </div>

              {/* Scanner frame overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[80%] h-[65%]">
                  {/* Corner markers */}
                  {[
                    'top-0 left-0 border-t-2 border-l-2 rounded-tl-lg',
                    'top-0 right-0 border-t-2 border-r-2 rounded-tr-lg',
                    'bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg',
                    'bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg',
                  ].map((cls, i) => (
                    <div
                      key={i}
                      className={`absolute ${cls} border-indigo-400 w-8 h-8`}
                    />
                  ))}

                  {/* Scanning line animation */}
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-indigo-400/80"
                    style={{
                      animation: 'scan 2s ease-in-out infinite',
                      top: '50%',
                      boxShadow: '0 0 8px rgba(99,102,241,0.8)',
                    }}
                  />

                  {/* Center label */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-white"
                      style={{ background: 'rgba(99,102,241,0.6)', backdropFilter: 'blur(4px)' }}
                    >
                      Position document within frame
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid overlay */}
              <div
                className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              />
            </div>
          </>
        ) : (
          /* Captured preview */
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: '#f8fafc' }}
          >
            <div className="w-[85%] h-[75%] bg-white rounded-lg shadow-xl overflow-hidden">
              <div
                className={`w-full h-full p-4 transition-all duration-500 ${enhanced ? 'contrast-150 brightness-110' : ''}`}
                style={{ background: enhanced ? '#fff' : '#f1f5f9' }}
              >
                {/* Simulated document content */}
                <div className="space-y-2">
                  <div className="text-center mb-4">
                    <div className="h-3 bg-slate-700 rounded-full w-3/4 mx-auto mb-1.5" />
                    <div className="h-2 bg-slate-400 rounded-full w-1/2 mx-auto" />
                  </div>
                  {[1, 0.8, 0.9, 0.7, 0.85, 0.6, 0.75, 0.5, 0.65].map((w, i) => (
                    <div
                      key={i}
                      className="h-1.5 rounded-full"
                      style={{ background: '#94a3b8', width: `${w * 100}%`, opacity: enhanced ? 0.9 : 0.6 }}
                    />
                  ))}
                </div>
                {enhanced && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">
                    Enhanced ✓
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom controls */}
      {!captured ? (
        <div className="pb-6 px-4 flex flex-col items-center gap-4">
          {/* Capture row */}
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => navigate('/incoming')}
              className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10"
            >
              <Image size={22} color="white" />
            </button>

            {/* Capture button */}
            <button
              onClick={handleCapture}
              className="relative flex items-center justify-center transition-all active:scale-90"
              style={{
                width: '68px',
                height: '68px',
              }}
            >
              <div className="absolute inset-0 rounded-full border-4 border-white/40" />
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                <Camera size={26} className="text-slate-800" />
              </div>
            </button>

            <button className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white/10">
              <RotateCcw size={22} color="white" />
            </button>
          </div>
        </div>
      ) : (
        /* Post-capture actions */
        <div className="px-4 pb-5 space-y-3">
          {/* Adjustment tools */}
          <div className="flex gap-2 justify-center">
            {[
              { icon: Crop, label: 'Crop' },
              { icon: Contrast, label: 'Contrast' },
              { icon: RotateCcw, label: 'Rotate' },
            ].map(({ icon: Icon, label }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/10"
              >
                <Icon size={18} color="white" />
                <span className="text-white/80 text-[10px]">{label}</span>
              </button>
            ))}
            <button
              onClick={handleEnhance}
              className={`flex flex-col items-center gap-1.5 px-4 py-2.5 rounded-2xl ${
                enhanced ? 'bg-emerald-500/30' : 'bg-white/10'
              }`}
            >
              {enhancing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Contrast size={18} color={enhanced ? '#34d399' : 'white'} />
              )}
              <span className={`text-[10px] ${enhanced ? 'text-emerald-400' : 'text-white/80'}`}>
                {enhanced ? 'Enhanced' : 'Enhance'}
              </span>
            </button>
          </div>

          {/* Export options */}
          <div className="grid grid-cols-2 gap-2">
            <button className="py-3 rounded-2xl bg-white/10 text-white text-[12px] font-semibold flex items-center justify-center gap-2">
              <Image size={15} /> Save as Image
            </button>
            <button className="py-3 rounded-2xl bg-white/10 text-white text-[12px] font-semibold flex items-center justify-center gap-2">
              <FileText size={15} /> Save as PDF
            </button>
          </div>

          <button
            onClick={handleOCR}
            className="w-full py-3.5 rounded-2xl text-white text-[14px] font-bold flex items-center justify-center gap-2"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #6366f1)' }}
          >
            <FileText size={17} />
            Run OCR on this Document
          </button>
        </div>
      )}

      <style>{`
        @keyframes scan {
          0% { top: 5%; }
          50% { top: 90%; }
          100% { top: 5%; }
        }
      `}</style>
    </div>
  );
}
