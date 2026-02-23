import { useState, useEffect, useRef } from 'react'

export function useAudioMonitor(threshold, cooldown, alertType, soundType, deviceId, flashCount) {
  const [volume, setVolume] = useState(0)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [devices, setDevices] = useState([])
  const [isFlashing, setIsFlashing] = useState(false)
  
  const audioCtxRef = useRef(null)
  const analyserRef = useRef(null)
  const streamRef = useRef(null)
  const requestRef = useRef(null)
  
  const isOnCooldownRef = useRef(false)
  const flashIntervalRef = useRef(null)
  const cooldownTimerRef = useRef(null)

  const configRefs = useRef({ threshold, cooldown, alertType, soundType, flashCount })
  
  useEffect(() => {
    configRefs.current = { threshold, cooldown, alertType, soundType, flashCount }
  }, [threshold, cooldown, alertType, soundType, flashCount])

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(devs => {
      setDevices(devs.filter(d => d.kind === 'audioinput'))
    })
  }, [])

  const playSound = () => {
    const ctx = audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)()
    if (!audioCtxRef.current) audioCtxRef.current = ctx
    if (ctx.state === 'suspended') ctx.resume()
    
    const now = ctx.currentTime
    const currentSound = configRefs.current.soundType
    
    const createLayer = (freq, type, start, dur, vol, detune = 0) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = type
      osc.frequency.setValueAtTime(freq, start)
      osc.detune.setValueAtTime(detune, start)
      gain.gain.setValueAtTime(vol, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start(start)
      osc.stop(start + dur)
    }

    if (currentSound === 'soft-pop') {
      createLayer(523.25, 'sine', now, 0.2, 0.4) // C5
      createLayer(783.99, 'sine', now + 0.05, 0.2, 0.3) // G5
    } else if (currentSound === 'cyber-chirp') {
      createLayer(1200, 'square', now, 0.1, 0.1)
      createLayer(2400, 'square', now + 0.05, 0.1, 0.05)
      createLayer(1800, 'square', now + 0.1, 0.1, 0.08)
    } else if (currentSound === 'sonar') {
      // Efeito de batimento (Beating) - Impossível de ignorar
      createLayer(440, 'sine', now, 0.8, 0.3)
      createLayer(444, 'sine', now, 0.8, 0.3) 
    } else if (currentSound === 'glass') {
      createLayer(2000, 'sine', now, 0.3, 0.3)
      createLayer(3500, 'triangle', now, 0.05, 0.2)
    } else if (currentSound === 'overload') {
      // Alerta industrial agressivo
      [0, 0.2, 0.4].forEach(offset => {
        createLayer(220, 'sawtooth', now + offset, 0.15, 0.2)
        createLayer(440, 'sawtooth', now + offset, 0.15, 0.2)
      })
    }
  }

  const doFlash = () => {
    if (flashIntervalRef.current) clearInterval(flashIntervalRef.current)
    
    let count = 0
    const maxToggles = configRefs.current.flashCount * 2
    setIsFlashing(true)
    count++
    
    flashIntervalRef.current = setInterval(() => {
      setIsFlashing(prev => !prev)
      count++
      if (count >= maxToggles) {
        clearInterval(flashIntervalRef.current)
        flashIntervalRef.current = null
        setIsFlashing(false)
      }
    }, 150)
  }

  const fireAlertEvents = () => {
    const currentAlert = configRefs.current.alertType
    
    if (currentAlert === 'visual' || currentAlert === 'both') {
      doFlash()
    }
    
    if (currentAlert === 'sound' || currentAlert === 'both') {
      playSound()
    }
  }

  const triggerAlert = () => {
    if (isOnCooldownRef.current) return

    isOnCooldownRef.current = true
    fireAlertEvents()

    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current)
    cooldownTimerRef.current = setTimeout(() => {
      isOnCooldownRef.current = false
    }, configRefs.current.cooldown * 1000)
  }

  const testAlert = () => fireAlertEvents()

  const updateVolume = () => {
    if (analyserRef.current) {
      const data = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(data)
      
      const avg = data.reduce((acc, val) => acc + val, 0) / data.length
      setVolume(avg)

      if (avg > configRefs.current.threshold) {
        triggerAlert()
      }
    }
    requestRef.current = requestAnimationFrame(updateVolume)
  }

  const toggle = async () => {
    if (isMonitoring) {
      cancelAnimationFrame(requestRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      setVolume(0)
      setIsMonitoring(false)
      isOnCooldownRef.current = false
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current)
    } else {
      try {
        const constraints = { audio: deviceId && deviceId !== 'default' ? { deviceId: { exact: deviceId } } : true }
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        streamRef.current = stream
        
        const ctx = audioCtxRef.current || new (window.AudioContext || window.webkitAudioContext)()
        audioCtxRef.current = ctx
        
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 256
        analyser.smoothingTimeConstant = 0.9 
        analyserRef.current = analyser
        
        const source = ctx.createMediaStreamSource(stream)
        source.connect(analyser)
        
        setIsMonitoring(true)
        updateVolume()
      } catch (err) {
        console.error(err)
      }
    }
  }

  useEffect(() => {
    return () => {
      cancelAnimationFrame(requestRef.current)
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
      if (flashIntervalRef.current) clearInterval(flashIntervalRef.current)
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current)
    }
  }, [])

  return { volume, isMonitoring, toggle, devices, isFlashing, testAlert }
}