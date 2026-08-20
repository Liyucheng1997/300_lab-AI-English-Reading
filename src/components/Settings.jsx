import { useState } from 'react'

// 设置弹层：本地开发走 claude CLI（无需 Key）；线上版浏览器直连 Anthropic API（Key 只存本机）
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
        {cliOk ? (
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
        ) : (
          <>
            <p className="muted small">
              未检测到本地 claude CLI，将使用浏览器<b>直连 Anthropic API</b> 出题。
              API Key 只保存在你自己的浏览器（localStorage），不会上传到任何服务器。
            </p>
            <div className="field mt">
              <label>API Key</label>
              <input
                type="password" value={form.apiKey} placeholder="sk-ant-..."
                onChange={e => setForm({ ...form, apiKey: e.target.value.trim() })}
              />
            </div>
            <div className="field mt">
              <label>API 地址</label>
              <input
                type="text" value={form.baseUrl} placeholder="https://api.anthropic.com"
                onChange={e => setForm({ ...form, baseUrl: e.target.value.trim() })}
              />
            </div>
            <div className="field mt">
              <label>模型</label>
              <input
                type="text" value={form.apiModel} placeholder="claude-sonnet-5"
                onChange={e => setForm({ ...form, apiModel: e.target.value.trim() })}
              />
            </div>
          </>
        )}
        <div className="row spread">
          <button onClick={onClose}>取消</button>
          <button className="primary" onClick={() => { onSave(form); onClose() }}>保存</button>
        </div>
      </div>
    </div>
  )
}
