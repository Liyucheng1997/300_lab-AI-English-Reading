import { useMemo, useState } from 'react'

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

// 试卷页：作答 → 交卷评分 → 解析 → 自适应生成下一份
export default function PaperView({ paper, isDemo, onNextPaper, onBackToConfig }) {
  const [answers, setAnswers] = useState({}) // "s-q" -> optionIndex
  const [submitted, setSubmitted] = useState(false)
  const [showAnswers, setShowAnswers] = useState(false)

  const total = useMemo(
    () => paper.sections.reduce((n, s) => n + s.questions.length, 0),
    [paper]
  )
  const answered = Object.keys(answers).length

  const score = useMemo(() => {
    if (!submitted) return null
    let correct = 0
    paper.sections.forEach((s, si) =>
      s.questions.forEach((q, qi) => {
        if (answers[`${si}-${qi}`] === q.answer) correct++
      })
    )
    return { correct, percent: Math.round((correct / total) * 100) }
  }, [submitted, answers, paper, total])

  // 根据得分给下一份卷子的难度微调建议
  const adjust = score
    ? score.percent >= 85
      ? { text: '上调难度：本次得分较高，文章可加长、词汇和句式略微超出当前水平，增加推理判断题比例。', badge: '建议升档', cls: 'ok' }
      : score.percent < 60
        ? { text: '下调难度：本次得分偏低，请缩短文章、使用更常见词汇、多出细节理解题，减少推理题。', badge: '建议降档', cls: 'bad' }
        : { text: '保持当前难度，可更换话题继续练习。', badge: '保持难度', cls: 'warn' }
    : null

  function pick(si, qi, oi) {
    if (submitted) return
    setAnswers(a => ({ ...a, [`${si}-${qi}`]: oi }))
  }

  return (
    <div>
      <div className="card">
        <h2 className="paper-title">{paper.title}</h2>
        <p className="muted" style={{ textAlign: 'center' }}>
          共 {total} 题{isDemo ? ' · 演示样卷（配置 API Key 后可 AI 定制出题）' : ''}
        </p>

        {submitted && (
          <div className="score-banner">
            <div className="num">{score.percent} 分</div>
            <div className="muted">答对 {score.correct} / {total} 题</div>
            {adjust && (
              <div className="mt">
                <span className={`badge ${adjust.cls}`}>{adjust.badge}</span>
                <p className="muted small" style={{ maxWidth: 480, margin: '8px auto 0' }}>{adjust.text}</p>
              </div>
            )}
          </div>
        )}

        {paper.sections.map((section, si) => (
          <div key={si}>
            <div className="section-head">
              <h3 style={{ margin: 0 }}>
                {['一', '二', '三', '四', '五', '六'][si] || si + 1}、{section.name}
              </h3>
              <span className="muted small">{section.instruction}</span>
            </div>
            {section.passage && <div className="passage">{section.passage}</div>}
            {section.questions.map((q, qi) => {
              const key = `${si}-${qi}`
              const chosen = answers[key]
              return (
                <div className="question" key={qi}>
                  <div className="stem">{qi + 1}. {q.question}</div>
                  <div className={`options ${q.options.length <= 2 ? 'one-col' : ''}`}>
                    {q.options.map((opt, oi) => {
                      let cls = 'opt'
                      if (!submitted && chosen === oi) cls += ' selected'
                      if (submitted || showAnswers) {
                        if (oi === q.answer) cls += ' correct'
                        else if (chosen === oi) cls += ' wrong'
                      }
                      return (
                        <button key={oi} className={cls} onClick={() => pick(si, qi, oi)}>
                          {LETTERS[oi]}. {opt}
                        </button>
                      )
                    })}
                  </div>
                  {(submitted || showAnswers) && q.explanation && (
                    <div className="explain">
                      <b>解析：</b>正确答案 {LETTERS[q.answer]}。{q.explanation}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>

      <div className="card no-print">
        {!submitted ? (
          <div className="row spread">
            <span className="muted">已作答 {answered} / {total}</span>
            <div className="row">
              <button onClick={() => setShowAnswers(!showAnswers)}>
                {showAnswers ? '隐藏答案' : '显示答案'}
              </button>
              <button onClick={() => window.print()}>🖨️ 打印试卷</button>
              <button className="primary big" disabled={answered < total} onClick={() => setSubmitted(true)}>
                交卷评分
              </button>
            </div>
          </div>
        ) : (
          <div className="row spread">
            <button onClick={onBackToConfig}>调整设置</button>
            <div className="row">
              <button onClick={() => window.print()}>🖨️ 打印（含解析）</button>
              <button className="primary big" onClick={() => onNextPaper(adjust?.text || '')}>
                生成下一份（自动调难度）→
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
