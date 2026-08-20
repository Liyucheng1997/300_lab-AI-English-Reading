// Vite 插件：在开发服务器内提供两个接口，出题走本地 Claude Code CLI（claude -p）。
//   GET  /api/health   -> 检测本机 claude CLI 是否可用
//   POST /api/generate -> { prompt, model? } -> 调 claude -p 返回 { ok, text }

import { spawn } from 'node:child_process'

const GENERATE_TIMEOUT_MS = 5 * 60 * 1000

function runClaude(args, input, timeoutMs) {
  return new Promise(resolve => {
    // shell: true 以便解析 Windows 上的 claude.cmd 垫片
    const child = spawn('claude', args, { shell: true, windowsHide: true })
    let stdout = ''
    let stderr = ''
    let done = false
    const finish = result => {
      if (!done) { done = true; resolve(result) }
    }
    const timer = setTimeout(() => {
      child.kill()
      finish({ ok: false, error: `claude 执行超时（${Math.round(timeoutMs / 1000)}s）` })
    }, timeoutMs)

    child.stdout.on('data', d => { stdout += d.toString('utf8') })
    child.stderr.on('data', d => { stderr += d.toString('utf8') })
    child.on('error', err => { clearTimeout(timer); finish({ ok: false, error: err.message }) })
    child.on('close', code => {
      clearTimeout(timer)
      if (code === 0) finish({ ok: true, text: stdout })
      else finish({ ok: false, error: stderr.trim() || `claude 退出码 ${code}` })
    })

    if (input != null) {
      child.stdin.write(input, 'utf8')
      child.stdin.end()
    } else {
      child.stdin.end()
    }
  })
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', c => chunks.push(c))
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')) }
      catch (e) { reject(e) }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, obj) {
  res.statusCode = status
  res.setHeader('content-type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(obj))
}

let healthCache = null

export function claudeApi() {
  return {
    name: 'claude-api',
    configureServer(server) {
      server.middlewares.use('/api/health', async (req, res) => {
        if (!healthCache) {
          const r = await runClaude(['--version'], null, 20000)
          healthCache = r.ok
            ? { ok: true, version: r.text.trim() }
            : { ok: false, error: r.error }
        }
        sendJson(res, 200, healthCache)
      })

      server.middlewares.use('/api/generate', async (req, res) => {
        if (req.method !== 'POST') return sendJson(res, 405, { ok: false, error: 'POST only' })
        let body
        try { body = await readBody(req) }
        catch { return sendJson(res, 400, { ok: false, error: '请求体不是有效 JSON' }) }
        if (!body.prompt) return sendJson(res, 400, { ok: false, error: '缺少 prompt' })

        const args = ['-p', '--output-format', 'text']
        if (body.model) args.push('--model', body.model)
        // prompt 走 stdin，避免命令行长度与转义问题（含中文/引号）
        const r = await runClaude(args, body.prompt, GENERATE_TIMEOUT_MS)
        sendJson(res, 200, r)
      })
    },
  }
}
