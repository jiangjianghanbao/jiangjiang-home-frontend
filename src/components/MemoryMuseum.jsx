import { useEffect, useState } from 'react';
import { getMemories } from '../api.js';

const TYPE_LABEL = {
  memory: '日常记忆',
  quote: '金句',
  diary: '日记',
  summary: '摘要',
  treehole: '树洞',
  event: '重要事件',
};

export default function MemoryMuseum() {
  const [type, setType] = useState('');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMemories(type).then((r) => setList(r.memories || [])).catch(() => {}).finally(() => setLoading(false));
  }, [type]);

  return (
    <div className="museum">
      <div className="museum-filter">
        {['', 'quote', 'diary', 'event', 'memory'].map((t) => (
          <button key={t} className={type === t ? 'active' : ''} onClick={() => setType(t)}>
            {t === '' ? '全部' : TYPE_LABEL[t]}
          </button>
        ))}
      </div>
      <div className="museum-list">
        {loading && <p>正在翻回忆…</p>}
        {!loading && list.length === 0 && <p>这里还空空的，等我们慢慢填满💛</p>}
        {list.map((m) => (
          <div key={m.id} className="museum-item">
            <span className="museum-type">{TYPE_LABEL[m.type] || m.type}</span>
            <p>{m.content}</p>
            <time>{new Date(m.created_at).toLocaleDateString('zh-CN')}</time>
          </div>
        ))}
      </div>
    </div>
  );
}
