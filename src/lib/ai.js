// 出题支持两种后端，自动切换：
// 1. 本地 Claude Code CLI（开发服务器 /api/generate → claude -p，走订阅额度，无需 Key）
// 2. 浏览器直连 Anthropic API（线上 Pages 版，Key 只存本机 localStorage）

const SETTINGS_KEY = 'ai-reading-settings-v2'

export const DEFAULT_SETTINGS = {
  model: '', // 留空 = 使用 claude CLI 的默认模型；也可填 claude-sonnet-5 / opus 等
  apiKey: '', // 直连 API 模式使用
  baseUrl: 'https://api.anthropic.com',
  apiModel: 'claude-sonnet-5',
}

export function loadSettings() {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(s) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s))
}

// 检测本机 claude CLI 是否可用（线上 Pages 版没有 /api/health，返回 ok:false 后走直连 API）
export async function checkClaude() {
  try {
    const resp = await fetch('/api/health')
    if (!resp.ok) return { ok: false, error: `HTTP ${resp.status}` }
    return await resp.json()
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

export const SECTION_TYPES = [
  { id: 'reading', name: '阅读理解', desc: '短文 + 四选一', defaultCount: 4 },
  { id: 'cloze', name: '完形填空', desc: '短文挖空 + 四选一', defaultCount: 6 },
  { id: 'true_false', name: '阅读判断', desc: '短文 + 判断正误', defaultCount: 4 },
  { id: 'vocab', name: '词汇与语法', desc: '单句选择题', defaultCount: 5 },
]

function buildPrompt(config) {
  const sections = config.types.map(t => {
    const def = SECTION_TYPES.find(s => s.id === t.id)
    return `- 类型 "${t.id}"（${def.name}）：${t.count} 道题`
  }).join('\n')

  return `你是一位资深的中国英语教师和命题专家。请为学生出一份英语试卷。

学生水平：${config.levelText}
出题难度要求：${config.difficulty}
${config.topic ? `文章话题偏好：${config.topic}` : '文章话题自选，要求有趣、贴近学生生活或有知识性。'}
${config.adjust ? `难度微调：${config.adjust}` : ''}

需要以下题型：
${sections}

严格按以下 JSON 格式输出（不要 markdown 代码块，不要任何解释文字，只输出 JSON）：
{
  "title": "试卷标题",
  "sections": [
    {
      "type": "reading",
      "name": "阅读理解",
      "instruction": "阅读短文，选择最佳答案。",
      "passage": "英文短文（阅读理解/判断题约120-250词，随水平调整；完形填空的空用 [1] [2] 编号标出；vocab 类型无 passage 可省略此字段）",
      "questions": [
        {
          "question": "题干（英文）",
          "options": ["选项A", "选项B", "选项C", "选项D"],
          "answer": 0,
          "explanation": "中文解析，说明为什么选这个答案"
        }
      ]
    }
  ]
}

规则：
1. answer 是正确选项在 options 数组中的下标（0-3）。
2. true_false 类型的 options 固定为 ["True", "False"]，answer 为 0 或 1。
3. 完形填空的 passage 中用 [1]、[2] 标空，questions 按空的顺序排列，question 字段写 "第 1 空" 等。
4. 词汇、句式复杂度必须严格匹配学生水平，不要超纲。
5. 解析用中文，简明扼要，指出关键依据。
6. 输出必须是合法 JSON：字符串内不得出现未转义的英文双引号，文章中的对话请用单引号（如 'Hello'）。`
}

export async function generatePaper(config, settings, backend = 'cli') {
  if (backend === 'cli') {
    const resp = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ prompt: buildPrompt(config), model: settings.model || undefined }),
    })
    if (!resp.ok) throw new Error(`本地服务请求失败（${resp.status}）`)
    const data = await resp.json()
    if (!data.ok) throw new Error(data.error || 'claude 调用失败')
    return parsePaper(data.text)
  }
  // 浏览器直连 Anthropic API
  const resp = await fetch(`${settings.baseUrl.replace(/\/$/, '')}/v1/messages`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': settings.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: settings.apiModel || 'claude-sonnet-5',
      max_tokens: 8000,
      messages: [{ role: 'user', content: buildPrompt(config) }],
    }),
  })
  if (!resp.ok) {
    const text = await resp.text().catch(() => '')
    throw new Error(`API 请求失败（${resp.status}）：${text.slice(0, 300)}`)
  }
  const data = await resp.json()
  const raw = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('')
  return parsePaper(raw)
}

export function parsePaper(raw) {
  // 容错：去掉可能的 ```json 包裹，截取首尾大括号
  let text = raw.trim().replace(/^```(?:json)?/i, '').replace(/```$/, '').trim()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('AI 返回内容中未找到 JSON')
  text = text.slice(start, end + 1)

  let paper
  try {
    paper = JSON.parse(text)
  } catch {
    // 常见问题：字符串值里有未转义的双引号（如文中对话）或裸换行，修复后重试
    paper = JSON.parse(repairJson(text))
  }
  if (!Array.isArray(paper.sections)) throw new Error('试卷格式不完整')
  return paper
}

// 逐字符扫描：字符串内部的 " 若后面跟的不是 , } ] : 等定界符，视为内容引号并转义；
// 字符串内的裸换行转成 \n。
function repairJson(text) {
  let out = ''
  let inStr = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if (!inStr) {
      if (c === '"') inStr = true
      out += c
      continue
    }
    if (c === '\\') { out += c + (text[i + 1] ?? ''); i++; continue }
    if (c === '\n') { out += '\\n'; continue }
    if (c === '"') {
      let j = i + 1
      while (j < text.length && /[ \t\r\n]/.test(text[j])) j++
      const next = text[j]
      if (next === undefined || ',}]:'.includes(next)) { inStr = false; out += c }
      else out += '\\"'
      continue
    }
    out += c
  }
  return out
}
