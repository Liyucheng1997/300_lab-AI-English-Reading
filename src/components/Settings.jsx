import { useState } from 'react'

// API 设置弹层：Key、接口地址（支持中转）、模型
export default function Settings({ settings, onSave, onClose }) {
  const [form, setForm] = useState(settings)
  const set = (k, v) => setForm({ ...form, [k]: v })

  return (
    <div className="modal-mask" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h2>API 设置</h2>
        <p className="muted small">
          Key 仅保存在本机浏览器（localStorage），直接从浏览器调用接口，不经过任何第三方服务器。
        </p>
        <div className="field mt">
          <label>API Key</label>
          <input
            type="password" value={form.apiKey} placeholder="sk-ant-..."
            onChange={e => set('apiKey', e.target.value.trim())}
          />
        </div>
        <div className="field">
          <label>接口地址（可填中转地址）</label>
          <input
            type="text" value={form.baseUrl} placeholder="https://api.anthropic.com"
            onChange={e => set('baseUrl', e.target.value.trim())}
          />
        </div>
        <div className="field">
          <label>模型</label>
          <input
            type="text" value={form.model} placeholder="claude-sonnet-5"
            onChange={e => set('model', e.target.value.trim())}
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
