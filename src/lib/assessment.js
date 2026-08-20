// 自适应词汇量测试：阶梯法（staircase）。
// 每轮从当前档位抽 3 个词出选义题；答对 ≥2 升一档，否则降一档。
// 共 8 轮（24 题），随后按各档正确率（校正猜测）估算词汇量。

import { BANDS, levelForVocab } from '../data/vocabBands.js'

const ROUNDS = 8
const PER_ROUND = 3
const CHOICES = 4

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function createTest() {
  return {
    round: 0,
    bandId: 3, // 从初中档起步
    used: new Set(), // 已用过的单词
    results: [], // {bandId, word, correct}
    current: null, // 当前这一轮的题目数组
    answeredInRound: [],
  }
}

// 为某档生成一轮题目：3 个词，每题 4 个中文释义选项（干扰项取自相邻档位）
export function nextRound(state) {
  const band = BANDS.find(b => b.id === state.bandId)
  const fresh = band.words.filter(([w]) => !state.used.has(w))
  const picked = shuffle(fresh).slice(0, PER_ROUND)
  picked.forEach(([w]) => state.used.add(w))

  // 干扰项池：本档 + 相邻档的释义
  const pool = BANDS
    .filter(b => Math.abs(b.id - band.id) <= 1)
    .flatMap(b => b.words.map(([, m]) => m))

  const questions = picked.map(([word, meaning]) => {
    const distractors = shuffle(pool.filter(m => m !== meaning)).slice(0, CHOICES - 1)
    return { word, meaning, bandId: band.id, options: shuffle([meaning, ...distractors]) }
  })
  state.current = questions
  state.answeredInRound = []
  return questions
}

// 提交一轮答案，返回是否结束
export function submitRound(state, answers) {
  let correct = 0
  state.current.forEach((q, i) => {
    const ok = answers[i] === q.meaning
    if (ok) correct++
    state.results.push({ bandId: q.bandId, word: q.word, correct: ok })
  })
  state.round++
  if (correct >= 2) state.bandId = Math.min(8, state.bandId + 1)
  else state.bandId = Math.max(1, state.bandId - 1)
  return state.round >= ROUNDS
}

export function estimate(state) {
  const stats = new Map() // bandId -> {correct, total}
  for (const r of state.results) {
    const s = stats.get(r.bandId) || { correct: 0, total: 0 }
    s.total++
    if (r.correct) s.correct++
    stats.set(r.bandId, s)
  }
  const testedIds = [...stats.keys()]
  const minTested = Math.min(...testedIds)
  const maxTested = Math.max(...testedIds)

  let vocab = 0
  const perBand = []
  for (const band of BANDS) {
    let p
    const s = stats.get(band.id)
    if (s) {
      const raw = s.correct / s.total
      p = Math.max(0, (raw - 1 / CHOICES) / (1 - 1 / CHOICES)) // 校正随机猜对
    } else if (band.id < minTested) {
      p = 1 // 起步档以下未测：视为掌握
    } else {
      p = 0 // 最高测到的档以上：视为未掌握
    }
    vocab += (band.to - band.from) * p
    perBand.push({ band, p, tested: !!s, stat: s || null })
  }
  const size = Math.round(vocab / 50) * 50
  return { size, level: levelForVocab(size), perBand }
}
