// 词汇量评估结果：估算词汇量、水平定位、各档掌握度
export default function AssessResult({ result, onNext, onRetest }) {
  const { size, level, perBand } = result
  return (
    <div className="card">
      <h2>评估结果</h2>
      <div className="row mt" style={{ alignItems: 'baseline', gap: 16 }}>
        <span className="vocab-size">≈ {size.toLocaleString()}</span>
        <span className="muted">估算词汇量（词）</span>
      </div>
      <div className="row mt">
        <span className="badge">对应水平：{level.grade}</span>
        <span className="badge ok">CEFR {level.cefr}</span>
      </div>

      <h3>各频段掌握情况</h3>
      <div className="band-bars">
        {perBand.map(({ band, p, tested }) => (
          <div key={band.id} className={`band-bar ${tested ? '' : 'untested'}`}>
            <span>{band.label}</span>
            <div className="track"><div className="fill" style={{ width: `${p * 100}%` }} /></div>
            <span className="muted">{tested ? `${Math.round(p * 100)}%` : p === 1 ? '未测' : '—'}</span>
          </div>
        ))}
      </div>
      <p className="muted small">灰色为未直接测到的频段（按测试路径推断）。结果仅供出题定位参考。</p>

      <div className="row mt">
        <button className="primary big" onClick={onNext}>按此水平出题 →</button>
        <button onClick={onRetest}>重新测试</button>
      </div>
    </div>
  )
}
