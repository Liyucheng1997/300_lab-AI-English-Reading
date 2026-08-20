import { useState } from 'react'
import VocabTest from './components/VocabTest.jsx'
import AssessResult from './components/AssessResult.jsx'
import PaperConfig from './components/PaperConfig.jsx'
import PaperView from './components/PaperView.jsx'
import Settings from './components/Settings.jsx'
import { loadSettings, saveSettings, generatePaper } from './lib/ai.js'
import { SAMPLE_PAPER } from './data/samplePaper.js'

// 页面流转：home → test → result → config → generating → paper
export default function App() {
  const [page, setPage] = useState('home')
  const [assessed, setAssessed] = useState(null) // 词汇量评估结果
  const [settings, setSettings] = useState(loadSettings)
  const [showSettings, setShowSettings] = useState(false)
  const [paper, setPaper] = useState(null)
  const [isDemo, setIsDemo] = useState(false)
  const [lastConfig, setLastConfig] = useState(null)
  const [error, setError] = useState('')

  const hasApiKey = !!settings.apiKey

  async function handleGenerate(config) {
    setLastConfig(config)
    setError('')
    if (!hasApiKey) {
      setPaper(SAMPLE_PAPER)
      setIsDemo(true)
      setPage('paper')
      return
    }
    setPage('generating')
    try {
      const p = await generatePaper(config, settings)
      setPaper(p)
      setIsDemo(false)
      setPage('paper')
    } catch (e) {
      setError(e.message || String(e))
      setPage('config')
    }
  }

  function handleNextPaper(adjustText) {
    if (!lastConfig) { setPage('config'); return }
    handleGenerate({ ...lastConfig, adjust: adjustText })
  }

  return (
    <div className="app">
      <div className="topbar no-print">
        <h1 onClick={() => setPage('home')}>📖 AI 英语阅读<span>出题神器</span></h1>
        <div className="row">
          {assessed && <span className="badge">词汇量 ≈{assessed.size}</span>}
          <button onClick={() => setShowSettings(true)}>
            ⚙️ API 设置{hasApiKey ? '' : '（未配置）'}
          </button>
        </div>
      </div>

      {page === 'home' && (
        <div className="card hero">
          <h2>测词汇 → 定水平 → AI 出卷 → 自适应进阶</h2>
          <p>
            先用 3 分钟自适应测试估算你的英语词汇量，再按你的真实水平用 AI
            生成阅读理解、完形填空等题目。答完自动评分，下一份卷子难度随成绩自动调整。
          </p>
          <div className="row">
            <button className="primary big" onClick={() => setPage('test')}>开始词汇量测试</button>
            <button className="big" onClick={() => setPage('config')}>跳过测试，直接出题</button>
          </div>
          <div className="steps">
            <div className="step"><b>① 词汇评估</b><span>24 道选义题，阶梯式自动调档，估算词汇量并定位年级水平</span></div>
            <div className="step"><b>② 定制组卷</b><span>选择题型、题量、话题，AI 按你的水平生成全新试卷</span></div>
            <div className="step"><b>③ 自适应进阶</b><span>在线作答评分＋中文解析，成绩好自动升难度，可打印成纸质卷</span></div>
          </div>
        </div>
      )}

      {page === 'test' && (
        <VocabTest
          onDone={r => { setAssessed(r); setPage('result') }}
          onCancel={() => setPage('home')}
        />
      )}

      {page === 'result' && assessed && (
        <AssessResult
          result={assessed}
          onNext={() => setPage('config')}
          onRetest={() => setPage('test')}
        />
      )}

      {page === 'config' && (
        <>
          <PaperConfig
            assessed={assessed}
            hasApiKey={hasApiKey}
            onGenerate={handleGenerate}
            onOpenSettings={() => setShowSettings(true)}
          />
          {error && <div className="error-box">生成失败：{error}</div>}
        </>
      )}

      {page === 'generating' && (
        <div className="card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <div className="spinner" />
          <h2>AI 正在出题…</h2>
          <p className="muted">根据你的水平定制文章与题目，通常需要 20-60 秒</p>
        </div>
      )}

      {page === 'paper' && paper && (
        <PaperView
          paper={paper}
          isDemo={isDemo}
          onNextPaper={handleNextPaper}
          onBackToConfig={() => setPage('config')}
        />
      )}

      {showSettings && (
        <Settings
          settings={settings}
          onSave={s => { setSettings(s); saveSettings(s) }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
