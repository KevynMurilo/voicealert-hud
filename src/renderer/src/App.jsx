import { useState, useEffect } from 'react'
import { useAudioMonitor } from './hooks/useAudioMonitor'
import { MonitorView } from './components/MonitorView'
import { SettingsView } from './components/SettingsView'

function App() {
  const [activeView, setActiveView] = useState('monitor')

  const [threshold, setThreshold] = useState(() => Number(localStorage.getItem('threshold')) || 70)
  const [cooldown, setCooldown] = useState(() => Number(localStorage.getItem('cooldown')) || 5)
  const [alertType, setAlertType] = useState(() => localStorage.getItem('alertType') || 'both')
  const [soundType, setSoundType] = useState(() => localStorage.getItem('soundType') || 'overload')
  const [deviceId, setDeviceId] = useState(() => localStorage.getItem('deviceId') || 'default')
  const [flashCount, setFlashCount] = useState(() => Number(localStorage.getItem('flashCount')) || 3)
  const [autoStart, setAutoStart] = useState(false)
  
  const { volume, isMonitoring, toggle, devices, isFlashing, testAlert } = useAudioMonitor(threshold, cooldown, alertType, soundType, deviceId, flashCount)

  useEffect(() => {
    localStorage.setItem('threshold', threshold)
    localStorage.setItem('cooldown', cooldown)
    localStorage.setItem('alertType', alertType)
    localStorage.setItem('soundType', soundType)
    localStorage.setItem('deviceId', deviceId)
    localStorage.setItem('flashCount', flashCount)
  }, [threshold, cooldown, alertType, soundType, deviceId, flashCount])

  useEffect(() => {
    window.electron?.ipcRenderer.invoke('get-autostart').then(setAutoStart)
  }, [])

  const handleAutoStart = (e) => {
    const isChecked = e.target.checked
    setAutoStart(isChecked)
    window.electron?.ipcRenderer.send('set-autostart', isChecked)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-[#e2e2e8] flex flex-col font-sans select-none relative overflow-hidden">
      
      <div className={`absolute inset-0 pointer-events-none z-50 transition-opacity duration-75 ${isFlashing ? 'opacity-100' : 'opacity-0'}`} 
           style={{ boxShadow: 'inset 0 0 100px rgba(255, 0, 60, 0.4)' }} />

      <div className="h-10 w-full flex items-center justify-between px-5 shrink-0 z-40 bg-[#0a0a0c]" style={{ WebkitAppRegion: 'drag' }}>
        <span className="text-[11px] font-black text-[#52525e] tracking-[0.2em] uppercase">VoiceAlert HUD</span>
      </div>

      {activeView === 'monitor' ? (
        <MonitorView 
          setActiveView={setActiveView}
          volume={volume}
          threshold={threshold}
          isMonitoring={isMonitoring}
          toggle={toggle}
        />
      ) : (
        <SettingsView 
          setActiveView={setActiveView}
          deviceId={deviceId} setDeviceId={setDeviceId}
          isMonitoring={isMonitoring} devices={devices}
          threshold={threshold} setThreshold={setThreshold}
          alertType={alertType} setAlertType={setAlertType}
          soundType={soundType} setSoundType={setSoundType}
          cooldown={cooldown} setCooldown={setCooldown}
          autoStart={autoStart} handleAutoStart={handleAutoStart}
          testAlert={testAlert}
        />
      )}
    </div>
  )
}

export default App