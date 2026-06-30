import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gamepad2, FolderOpen, Check, ChevronRight, Loader } from 'lucide-react'
import { useApp } from '../store/AppContext'
import { Button } from '../components/Button'

const MOCK_PATHS = [
  'D:\\ROMs',
  'C:\\Users\\Danny\\Documents\\ROMs',
  'E:\\Games\\ROMs',
]

type Step = 'welcome' | 'roots' | 'scanning' | 'done'

export function Onboarding() {
  const [step, setStep] = useState<Step>('welcome')
  const [roots, setRoots] = useState<string[]>([])
  const [inputVal, setInputVal] = useState('')
  const [scanProgress, setScanProgress] = useState(0)
  const { completeOnboarding } = useApp()
  const navigate = useNavigate()

  function addRoot() {
    const v = inputVal.trim()
    if (v && !roots.includes(v)) setRoots(r => [...r, v])
    setInputVal('')
  }

  function startScan() {
    if (roots.length === 0) return
    setStep('scanning')
    setScanProgress(0)
    const timer = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(timer)
          setStep('done')
          return 100
        }
        return p + Math.random() * 8 + 2
      })
    }, 120)
  }

  function finish() {
    completeOnboarding(roots)
    navigate('/library')
  }

  return (
    <div className="min-h-screen bg-rc-bg flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded bg-rc-amber/10 border border-rc-amber/30 mb-4">
            <Gamepad2 size={28} className="text-rc-amber" />
          </div>
          <h1 className="text-2xl font-mono font-semibold text-rc-amber tracking-wide">RetroCart</h1>
          <p className="text-sm text-rc-muted mt-1">Master library · device tagging · SD sync</p>
        </div>

        <div className="bg-rc-surface border border-rc-border rounded-lg p-6 space-y-6">
          {/* Step indicator */}
          <div className="flex items-center gap-2 text-xs font-mono">
            {(['welcome', 'roots', 'scanning', 'done'] as Step[]).map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] border ${
                  step === s ? 'border-rc-amber text-rc-amber bg-rc-amber/10' :
                  ['welcome', 'roots', 'scanning', 'done'].indexOf(step) > i
                    ? 'border-rc-green text-rc-green bg-rc-green/10'
                    : 'border-rc-border text-rc-dim'
                }`}>
                  {['welcome', 'roots', 'scanning', 'done'].indexOf(step) > i ? <Check size={10} /> : i + 1}
                </div>
                {i < 3 && <ChevronRight size={10} className="text-rc-dim" />}
              </div>
            ))}
            <span className="ml-2 text-rc-muted capitalize">{step === 'scanning' ? 'Scanning...' : step}</span>
          </div>

          {/* Welcome */}
          {step === 'welcome' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-rc-text">Welcome to RetroCart</h2>
              <p className="text-sm text-rc-muted leading-relaxed">
                RetroCart manages your master ROM library on this PC and syncs tagged games to your handhelds
                when you insert an SD card.
              </p>
              <ul className="space-y-2 text-sm text-rc-muted">
                {[
                  'Index ROMs from any folder on your PC',
                  'Tag games per device (Miyoo, Retroid, etc.)',
                  'Sync ROMs, saves, metadata + collections to SD',
                ].map(t => (
                  <li key={t} className="flex items-start gap-2">
                    <span className="text-rc-amber mt-0.5">›</span>
                    {t}
                  </li>
                ))}
              </ul>
              <Button variant="primary" size="lg" className="w-full justify-center" onClick={() => setStep('roots')}>
                Get started <ChevronRight size={14} />
              </Button>
            </div>
          )}

          {/* Add library roots */}
          {step === 'roots' && (
            <div className="space-y-4">
              <div>
                <h2 className="font-semibold text-rc-text">Add your ROM folder(s)</h2>
                <p className="text-xs text-rc-muted mt-1">RetroCart will index these folders and track your library.</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addRoot()}
                  placeholder="D:\ROMs"
                  className="flex-1 bg-rc-surface2 border border-rc-border2 rounded px-3 py-1.5 text-sm font-mono text-rc-text placeholder:text-rc-dim focus:outline-none focus:border-rc-amber"
                />
                <Button variant="secondary" size="sm" onClick={addRoot}>
                  <FolderOpen size={13} /> Add
                </Button>
              </div>

              {/* Quick-add suggestions */}
              <div className="space-y-1">
                <div className="text-[10px] font-mono text-rc-dim uppercase tracking-widest mb-2">Suggestions</div>
                {MOCK_PATHS.map(p => (
                  <button
                    key={p}
                    onClick={() => { if (!roots.includes(p)) setRoots(r => [...r, p]) }}
                    disabled={roots.includes(p)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded border border-rc-border text-xs font-mono text-rc-muted hover:border-rc-amber/40 hover:text-rc-text disabled:opacity-40 disabled:cursor-default transition-colors"
                  >
                    {roots.includes(p) ? <Check size={11} className="text-rc-green" /> : <FolderOpen size={11} />}
                    {p}
                  </button>
                ))}
              </div>

              {roots.length > 0 && (
                <div className="border border-rc-green/20 bg-rc-green/5 rounded p-3 space-y-1">
                  <div className="text-[10px] font-mono text-rc-dim uppercase tracking-widest">Selected</div>
                  {roots.map(r => (
                    <div key={r} className="flex items-center justify-between text-xs font-mono">
                      <span className="text-rc-text">{r}</span>
                      <button onClick={() => setRoots(rs => rs.filter(x => x !== r))} className="text-rc-dim hover:text-rc-red">✕</button>
                    </div>
                  ))}
                </div>
              )}

              <Button
                variant="primary" size="lg" className="w-full justify-center"
                disabled={roots.length === 0}
                onClick={startScan}
              >
                Scan library <ChevronRight size={14} />
              </Button>
            </div>
          )}

          {/* Scanning */}
          {step === 'scanning' && (
            <div className="space-y-5 py-4">
              <div className="flex items-center gap-3">
                <Loader size={18} className="text-rc-amber animate-spin" />
                <span className="text-sm text-rc-text">Scanning library...</span>
              </div>
              <div className="space-y-2">
                <div className="h-1.5 bg-rc-surface3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rc-amber rounded-full transition-all duration-200"
                    style={{ width: `${Math.min(scanProgress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono text-rc-muted">
                  <span>Hashing + indexing ROMs</span>
                  <span>{Math.min(Math.round(scanProgress), 100)}%</span>
                </div>
              </div>
              <div className="space-y-1 text-xs font-mono text-rc-dim">
                {scanProgress > 20 && <div className="text-rc-green">✓ {Math.round(scanProgress * 2.5)} files indexed</div>}
                {scanProgress > 50 && <div className="text-rc-green">✓ Matching against ROM database</div>}
                {scanProgress > 80 && <div className="text-rc-green">✓ Loading metadata</div>}
              </div>
            </div>
          )}

          {/* Done */}
          {step === 'done' && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-rc-green/10 border border-rc-green/30 flex items-center justify-center">
                  <Check size={16} className="text-rc-green" />
                </div>
                <div>
                  <div className="font-semibold text-rc-text">Scan complete</div>
                  <div className="text-xs text-rc-muted">200 ROMs indexed across 8 consoles</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Total ROMs', value: '200' },
                  { label: 'Consoles', value: '8' },
                  { label: 'Matched to DB', value: '187' },
                  { label: 'With metadata', value: '187' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-rc-surface2 rounded p-3 text-center">
                    <div className="text-xl font-mono font-semibold text-rc-amber">{value}</div>
                    <div className="text-xs text-rc-muted">{label}</div>
                  </div>
                ))}
              </div>
              <Button variant="primary" size="lg" className="w-full justify-center" onClick={finish}>
                Open Library <ChevronRight size={14} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
