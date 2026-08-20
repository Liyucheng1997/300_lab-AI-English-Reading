import { useState } from 'react'

// 设置弹层：本地开发可走 claude CLI；线上版默认直连本机 claude -p 反代。
export default function Settings({ settings, claudeStatus, onSave, onClose }) {
  const [form, setForm] = useState(settings)
  const cliOk = !!claudeStatus?.ok

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>设置</h2>
        <p className="small">
          本地 Claude CLI：{cliOk
            ? <span className="badge ok">可用 · {claudeStatus.version}</span>
            : <span className="badge bad">不可用</span>}
        </p>
        {cliOk && (
          <>
            <p className="muted small">
              出题通过本机已登录的 <b>Claude Code CLI</b>（<code>claude -p</code>）完成，无需 API Key。
            </p>
            <div className="field mt">
              <label>模型（可选）</label>
              <input
                type="text" value={form.model} placeholder="留空使用 CLI 默认模型，如 claude-sonnet-5"
                onChange={e => setForm({ ...form, model: e.target.value.trim() })}
              />
            </div>
          </>
        )}
        <p className="muted small mt">
          {cliOk ? '以下反代配置在本地 CLI 不可用时生效。' : '未检测到开发服务器的 Claude CLI，将使用下面的地址。'}
          默认调用本机 <b>claude -p 反代</b>；API Key 未启用鉴权时填 <code>unused</code>。
          配置只保存在当前浏览器（localStorage）。
        </p>
        <div className="field mt">
          <label>反代 / Anthropic API Key</label>
          <input
            type="password" value={form.apiKey} placeholder="unused"
            onChange={e => setForm({ ...form, apiKey: e.target.value.trim() })}
          />
        </div>
        <div className="field mt">
          <label>反代 / API 地址</label>
          <input
            type="text" value={form.baseUrl} placeholder="http://localhost:8787"
            onChange={e => setForm({ ...form, baseUrl: e.target.value.trim() })}
          />
        </div>
        <div className="field mt">
          <label>反代 / API 模型</label>
          <input
            type="text" value={form.apiModel} placeholder="haiku"
            onChange={e => setForm({ ...form, apiModel: e.target.value.trim() })}
          />
        </div>
        <div className="row spread">
          <button onClick={onClose}>取消</button>
          <button className="primary" onClick={() => { onSave(form); onClose() }}>保存</button>
        </div>
      </div>
    </div>
  )
}
