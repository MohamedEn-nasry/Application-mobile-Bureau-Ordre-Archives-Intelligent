import { Outlet } from 'react-router';

export function PhoneFrame() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e3a5f 100%)',
      }}
    >
      {/* Phone mockup */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: '393px',
          height: '852px',
          background: '#0a0a0a',
          borderRadius: '50px',
          padding: '8px',
          boxShadow: '0 0 0 1px #2a2a2a, 0 40px 120px rgba(0,0,0,0.8), inset 0 0 0 1px #1a1a1a',
        }}
      >
        {/* Screen glass */}
        <div
          className="w-full h-full overflow-hidden bg-slate-50"
          style={{ borderRadius: '43px', position: 'relative' }}
        >
          {/* Dynamic Island */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '120px',
              height: '34px',
              background: '#0a0a0a',
              borderRadius: '20px',
              zIndex: 100,
            }}
          />
          {/* Screen content */}
          <div className="w-full h-full overflow-hidden" style={{ borderRadius: '43px' }}>
            <Outlet />
          </div>
        </div>
        {/* Side buttons */}
        <div
          style={{
            position: 'absolute',
            right: '-3px',
            top: '120px',
            width: '3px',
            height: '60px',
            background: '#1a1a1a',
            borderRadius: '0 3px 3px 0',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-3px',
            top: '130px',
            width: '3px',
            height: '36px',
            background: '#1a1a1a',
            borderRadius: '3px 0 0 3px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-3px',
            top: '178px',
            width: '3px',
            height: '60px',
            background: '#1a1a1a',
            borderRadius: '3px 0 0 3px',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '-3px',
            top: '248px',
            width: '3px',
            height: '60px',
            background: '#1a1a1a',
            borderRadius: '3px 0 0 3px',
          }}
        />
      </div>
    </div>
  );
}
