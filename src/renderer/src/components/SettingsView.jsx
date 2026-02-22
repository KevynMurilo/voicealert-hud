const BackIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>

export function SettingsView(props) {
    const {
        setActiveView, deviceId, setDeviceId, isMonitoring, devices,
        threshold, setThreshold, alertType, setAlertType, soundType,
        setSoundType, cooldown, setCooldown, autoStart, handleAutoStart, testAlert
    } = props

    return (
        <div className="flex-1 flex flex-col z-10">
            <div className="px-6 py-4 flex items-center gap-4 bg-[#0a0a0c] border-b border-[#1a1a24] sticky top-0 z-20">
                <button onClick={() => setActiveView('monitor')} className="text-[#52525e] hover:text-[#00f0ff] transition-colors p-1 -ml-2 rounded hover:bg-[#121216]">
                    <BackIcon />
                </button>
                <h1 className="text-[13px] font-black tracking-widest uppercase text-white">Parâmetros do Sistema</h1>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 flex flex-col gap-8 bg-[#0d0d12]">

                <div className="space-y-4">
                    <h2 className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-[0.2em]">Entrada de Áudio</h2>
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[#8a8a98] uppercase">Dispositivo de Captura</label>
                        <select value={deviceId} onChange={e => setDeviceId(e.target.value)} disabled={isMonitoring} className="w-full bg-[#121216] border border-[#1a1a24] text-sm text-white rounded p-3 outline-none focus:border-[#00f0ff] disabled:opacity-50 appearance-none">
                            <option value="default">Dispositivo Padrão do Sistema</option>
                            {devices.map(d => <option key={d.deviceId} value={d.deviceId}>{d.label || `Mic ${d.deviceId.slice(0, 5)}`}</option>)}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[11px] font-bold text-[#8a8a98] uppercase">Limite de Ruído (Threshold)</label>
                            <span className="text-xs font-mono text-[#00f0ff] bg-[#0a0a0c] px-2 py-1 rounded">{threshold} dB</span>
                        </div>
                        <input type="range" min="1" max="100" value={threshold} onChange={e => setThreshold(Number(e.target.value))} className="w-full h-1.5 bg-[#1a1a24] rounded-full appearance-none cursor-pointer accent-[#00f0ff]" />
                    </div>
                </div>

                <div className="w-full h-px bg-[#1a1a24]" />

                <div className="space-y-4">
                    <h2 className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-[0.2em]">Ações de Gatilho</h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#8a8a98] uppercase">Resposta</label>
                            <select value={alertType} onChange={e => setAlertType(e.target.value)} className="w-full bg-[#121216] border border-[#1a1a24] text-sm text-white rounded p-3 outline-none focus:border-[#00f0ff] appearance-none">
                                <option value="both">Visual + Som</option>
                                <option value="visual">Apenas Tela</option>
                                <option value="sound">Apenas Som</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-[#8a8a98] uppercase">Timbre Sonoro</label>
                            <select
                                value={soundType}
                                onChange={e => setSoundType(e.target.value)}
                                disabled={alertType === 'visual'}
                                className="w-full bg-[#121216] border border-[#1a1a24] text-sm text-white rounded p-3 outline-none focus:border-[#00f0ff] disabled:opacity-50 appearance-none"
                            >
                                <option value="soft-pop">Soft Pop (Moderna)</option>
                                <option value="cyber-chirp">Cyber Chirp (Tech UI)</option>
                                <option value="sonar">Deep Sonar (Imersiva)</option>
                                <option value="glass">Glass Tap (Sutil)</option>
                                <option value="overload">Overload (Alerta Crítico)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2 mt-2">
                        <div className="flex justify-between items-center">
                            <label className="text-[11px] font-bold text-[#8a8a98] uppercase">Supressão de Spam (Cooldown)</label>
                            <span className="text-xs font-mono text-white">{cooldown}s</span>
                        </div>
                        <input type="range" min="1" max="15" value={cooldown} onChange={e => setCooldown(Number(e.target.value))} className="w-full h-1.5 bg-[#1a1a24] rounded-full appearance-none cursor-pointer accent-white" />
                    </div>
                </div>

                <div className="w-full h-px bg-[#1a1a24]" />

                <div className="space-y-4 pb-6">
                    <h2 className="text-[10px] font-bold text-[#00f0ff] uppercase tracking-[0.2em]">Sistema</h2>
                    <label className="flex items-center gap-3 cursor-pointer p-4 bg-[#121216] rounded border border-[#1a1a24] hover:border-[#333342] transition-colors">
                        <input type="checkbox" checked={autoStart} onChange={handleAutoStart} className="w-4 h-4 accent-[#00f0ff] bg-[#1a1a24] border-none rounded" />
                        <span className="text-[12px] font-bold text-white uppercase tracking-wider">Ligar com o Windows</span>
                    </label>

                    <button onClick={testAlert} className="w-full py-3 bg-[#1a1a24] hover:bg-[#2a2a35] text-[#e2e2e8] rounded text-[11px] font-bold uppercase tracking-[0.1em] transition-colors mt-2">
                        Simular Alerta
                    </button>
                </div>
            </div>
        </div>
    )
}