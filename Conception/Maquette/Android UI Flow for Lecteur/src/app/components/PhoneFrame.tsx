import { type ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="relative flex items-center justify-center">
      {/* Left buttons */}
      <div className="absolute left-0 top-28 w-[3px] h-7 bg-gray-700 rounded-r-full" style={{ left: -3 }} />
      <div className="absolute top-40 w-[3px] h-12 bg-gray-700 rounded-r-full" style={{ left: -3 }} />
      <div className="absolute top-56 w-[3px] h-12 bg-gray-700 rounded-r-full" style={{ left: -3 }} />
      {/* Right button */}
      <div className="absolute top-44 w-[3px] h-16 bg-gray-700 rounded-l-full" style={{ right: -3 }} />

      {/* Phone outer shell */}
      <div
        className="relative overflow-hidden flex flex-col"
        style={{
          width: 390,
          height: 844,
          background: 'linear-gradient(145deg, #1a1a2e 0%, #0f0f1a 100%)',
          borderRadius: 52,
          border: '1px solid #333',
          boxShadow: '0 0 0 1px #222, inset 0 0 0 1px #444, 0 40px 80px rgba(0,0,0,0.6), 0 0 40px rgba(79,70,229,0.15)',
        }}
      >
        {/* Inner screen bezel */}
        <div
          className="absolute inset-0 rounded-[50px] pointer-events-none z-50"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, transparent 40%)',
          }}
        />

        {/* Camera island */}
        <div
          className="absolute z-50 flex items-center justify-center gap-2"
          style={{
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 110,
            height: 30,
            background: '#0a0a12',
            borderRadius: 20,
            border: '1px solid #222',
          }}
        >
          {/* Selfie camera */}
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #1a2a4a, #05050d)',
              border: '1px solid #1a1a2e',
              boxShadow: 'inset 0 0 3px rgba(79,70,229,0.3)',
            }}
          />
        </div>

        {/* Screen content — full phone dimensions */}
        <div className="flex-1 overflow-hidden" style={{ borderRadius: 44 }} data-phone-screen>
          {children}
        </div>

        {/* Home indicator */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/30 rounded-full z-50"
          style={{ width: 100, height: 4 }}
        />
      </div>
    </div>
  );
}