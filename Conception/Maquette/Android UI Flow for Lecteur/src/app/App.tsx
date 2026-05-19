import { RouterProvider } from 'react-router';
import { PhoneFrame } from './components/PhoneFrame';
import { router } from './routes';

export default function App() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0f0c29 0%, #1a1a3e 40%, #0d0d2b 70%, #0f0c29 100%)',
      }}
    >
      {/* Background grid pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(79,70,229,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(79,70,229,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #4f46e5, transparent)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-8 blur-3xl" style={{ background: 'radial-gradient(circle, #7c3aed, transparent)' }} />

      <div className="relative z-10 flex flex-col items-center gap-6 py-8">
        {/* Header label */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-6 h-6 bg-indigo-500/20 rounded-lg flex items-center justify-center border border-indigo-500/30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <span className="text-white/90 text-sm font-bold tracking-tight">Intelligent Bureau d'Ordre</span>
          </div>
          <p className="text-white/40 text-xs tracking-wider uppercase">Interface Lecteur · Prototype Android</p>
        </div>

        {/* Phone frame */}
        <PhoneFrame>
          <RouterProvider router={router} />
        </PhoneFrame>

        {/* Navigation hint */}
        <div className="flex items-center gap-6 text-white/30 text-[11px]">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/60" />
            Connexion → Tableau de bord
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
            Navigation complète
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500/60" />
            9 écrans interactifs
          </span>
        </div>
      </div>
    </div>
  );
}
