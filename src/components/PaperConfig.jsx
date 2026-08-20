import { useState } from 'react'
import { LEVELS } from '../data/vocabBands.js'
import { SECTION_TYPES } from '../lib/ai.js'

// 出题配置：水平（默认取评估结果）、题型与数量、话题
export default function PaperConfig({ assessed, hasApiKey, onGenerate, onOpenSettings }) {
  const [levelIdx, setLevelIdx] = useState(() => {
    if (!assessed) return 3
    return Math.max(0, LEVELS.indexOf(assessed.level))
  })
  const [topic, setTopic] = useState('')
  const [types, setTypes] = useState(() =>
    SECTION_TYPES.map(t => ({ id: t.id, on: t.id === 'reading' || t.id === 'cloze', count: t.defaultCount }))
  )

  const selected = types.filter(t => t.on)
  const level = LEVELS[levelIdx]

  function toggle(id) {
    setTypes(types.map(t => (t.id === id ? { ...t, on: !t.on } : t)))
  }
  function setCount(id, count) {
    setTypes(types.map(t => (t.id === id ? { ...t, count: Math.max(1, Math.min(10, count || 1)) } : t)))
  }

  function submit() {
    onGenerate({
      levelText: assessed
        ? `${level.grade}（词汇量约 ${assessed.size} 词，CEFR ${level.cefr}）`
        : `${level.grade}（CEFR ${level.cefr}）`,
      difficulty: level.difficulty,
      topic: topic.trim(),
      types: selected.map(({ id, count }) => ({ id, count })),
      levelIdx,
    })
  }

  return (
    <div className="card">
      <h2>组卷设置</h2>
      {assessed && (
        <p className="muted">已根据词汇量测试（≈{assessed.size} 词）自动定位水平，可手动调整。</p>
      )}

      <div className="field mt">
        <label>目标水平 / 年级</label>
        <select value={levelIdx} onChange={e => setLevelIdx(+e.target.value)}>
          {LEVELS.map((l, i) => (
            <option key={l.grade} value={i}>{l.grade} · CEFR {l.cefr}</option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>题型与题量</label>
        <div className="type-grid">
          {SECTION_TYPES.map(def => {
            const t = types.find(x => x.id === def.id)
            return (
              <div key={def.id} className={`type-card ${t.on ? 'on' : ''}`} onClick={() => toggle(def.id)}>
                <input type="checkbox" checked={t.on} readOnly />
                <div style={{ flex: 1 }}>
                  <b>{def.name}</b>
                  <div className="muted">{def.desc}</div>
                </div>
                {t.on && (
                  <input
                    type="number" min="1" max="10" value={t.count}
                    onClick={e => e.stopPropagation()}
                    onChange={e => setCount(def.id, +e.target.value)}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="field">
        <label>文章话题（可选）</label>
        <input
          type="text" value={topic} placeholder="如：太空探索 / 校园生活 / 环保 / 人工智能……留空则自动选题"
          onChange={e => setTopic(e.target.value)}
        />
      </div>

      {!hasApiKey && (
        <p className="muted small">
          ⚠️ 未配置 API Key，将使用<b>内置演示样卷</b>（固定内容）。
          <button className="link no-print" onClick={onOpenSettings}>去设置 API Key</button>
          即可用 AI 按需出题。
        </p>
      )}

      <div className="row mt">
        <button className="primary big" disabled={selected.length === 0} onClick={submit}>
          {hasApiKey ? '🪄 AI 生成试卷' : '查看演示样卷'}
        </button>
      </div>
    </div>
  )
}
