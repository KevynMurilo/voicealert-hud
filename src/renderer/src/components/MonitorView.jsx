const GearIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>

export function MonitorView({ setActiveView, volume, threshold, isMonitoring, toggle }) {
  const TOTAL_SEGMENTS = 30
  const normalizedVolume = Math.min(volume, 100)
  const isOverThreshold = normalizedVolume > threshold

  return (
    <div className="flex-1 flex flex-col p-6 relative z-10">
      <div className="absolute top-4 right-4" style={{ WebkitAppRegion: 'no-drag' }}>
        <button onClick={() => setActiveView('settings')} className="text-[#52525e] hover:text-[#00f0ff] transition-colors p-2 rounded-md hover:bg-[#121216]">
          <GearIcon />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-12 mt-4">
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold text-[#52525e] tracking-[0.3em] uppercase">Nível de Entrada</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-7xl font-black tabular-nums tracking-tighter transition-colors duration-300 ${isMonitoring ? (isOverThreshold ? 'text-[#ff003c] drop-shadow-[0_0_15px_rgba(255,0,60,0.5)]' : 'text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.3)]') : 'text-[#2a2a35]'}`}>
              {Math.round(normalizedVolume).toString().padStart(2, '0')}
            </span>
            <span className="text-sm font-bold text-[#52525e]">dB</span>
          </div>
        </div>

        <div className="w-full max-w-[300px] flex flex-col gap-2">
          <div className="flex justify-between w-full">
            <span className="text-[10px] font-bold text-[#52525e]">MIN</span>
            <span className="text-[10px] font-bold text-[#52525e]">MAX</span>
          </div>
          
          <div className="h-6 w-full flex gap-[2px] relative">
            <div 
              className="absolute top-[-6px] bottom-[-6px] w-[2px] bg-white z-10 shadow-[0_0_8px_white]"
              style={{ left: `${threshold}%` }}
            />
            {Array.from({ length: TOTAL_SEGMENTS }).map((_, index) => {
              const segmentPercent = (index / TOTAL_SEGMENTS) * 100
              const isActive = (normalizedVolume / 100) * TOTAL_SEGMENTS > index
              const isDangerZone = segmentPercent >= threshold

              let bgColor = 'bg-[#1a1a24]'
              if (isActive) {
                bgColor = isDangerZone 
                  ? 'bg-[#ff003c] shadow-[0_0_10px_#ff003c]' 
                  : 'bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]'
              }

              return (
                <div 
                  key={index} 
                  className={`h-full flex-1 rounded-[1px] transition-all duration-75 ${bgColor} ${!isActive && isMonitoring ? 'opacity-30' : ''}`}
                />
              )
            })}
          </div>
        </div>
      </div>

      <button 
        onClick={toggle}
        className={`w-full py-4 mt-8 rounded-md text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 border ${
          isMonitoring 
            ? 'bg-transparent text-[#ff003c] border-[#ff003c] hover:bg-[#ff003c]/10 shadow-[0_0_20px_rgba(255,0,60,0.2)]' 
            : 'bg-[#00f0ff] text-[#0a0a0c] border-[#00f0ff] hover:bg-[#00c0cc] shadow-[0_0_20px_rgba(0,240,255,0.3)]'
        }`}
      >
        {isMonitoring ? 'Desativar Sensores' : 'Ativar Monitoramento'}
      </button>
    </div>
  )
}