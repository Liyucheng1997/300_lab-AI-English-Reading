import { useRef, useState } from 'react'
import { createTest, nextRound, submitRound, estimate } from '../lib/assessment.js'

const TOTAL_ROUNDS = 8

// 词汇量自适应测试：逐题作答，每 3 题一轮自动升降档
export default function VocabTest({ onDone, onCancel }) {
  const stateRef = useRef(null)
  const [questions, setQuestions] = useState(() => {
    stateRef.current = createTest()
    return nextRound(stateRef.current)
  })
  const [qIndex, setQIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [round, setRound] = useState(0)

  const q = questions[qIndex]
  const answeredTotal = round * questions.length + qIndex

  function pick(option) {
    const nextAnswers = [...answers, option]
    if (qIndex + 1 < questions.length) {
      setAnswers(nextAnswers)
      setQIndex(qIndex + 1)
      return
    }
    // 一轮结束
    const finished = submitRound(stateRef.current, nextAnswers)
    if (finished) {
      onDone(estimate(stateRef.current))
      return
    }
    setQuestions(nextRound(stateRef.current))
    setAnswers([])
    setQIndex(0)
    setRound(round + 1)
  }

  return (
    <div className="card">
      <div className="row spread">
        <h2>词汇量测试</h2>
        <span className="muted">第 {answeredTotal + 1} / {TOTAL_ROUNDS * 3} 题</span>
      </div>
      <p className="muted">选出单词的正确中文意思。不认识就凭直觉选——测试会自动适应你的水平。</p>
      <div className="progress"><div style={{ width: `${(answeredTotal / (TOTAL_ROUNDS * 3)) * 100}%` }} /></div>

      <div className="word-q">
        <div className="word">{q.word}</div>
        <div className="options">
          {q.options.map(opt => (
            <button key={opt} className="opt" onClick={() => pick(opt)}>{opt}</button>
          ))}
        </div>
      </div>

      <div className="row spread mt no-print">
        <button className="link" onClick={onCancel}>放弃测试</button>
      </div>
    </div>
  )
}
