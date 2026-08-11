import { useEffect, useState } from 'react';
import Pet from './components/Pet.jsx';
import StatusCard from './components/StatusCard.jsx';
import MemoryMuseum from './components/MemoryMuseum.jsx';
import { sendChat, getStatus } from './api.js';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState({ status: '在想乖乖', detail: '' });
  const [tab, setTab] = useState('chat'); // chat | memory
  const [petMood, setPetMood] = useState('开心');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getStatus().then((r) => r.status && setStatus(r.status)).catch(() => {});
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    setPetMood('认真');
    try {
      const r = await sendChat(text, sessionId);
      setSessionId(r.sessionId);
      setMessages((m) => [...m, { role: 'assistant', content: r.reply }]);
      setPetMood('开心');
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: '唔…我这边有点卡，乖乖再说一次好不好🥺' }]);
      setPetMood('委屈');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="phone-shell">
      <header className="top-bar">
        <StatusCard status={status} />
        <div className="tabs">
          <button className={tab === 'chat' ? 'active' : ''} onClick={() => setTab('chat')}>聊天</button>
          <button className={tab === 'memory' ? 'active' : ''} onClick={() => setTab('memory')}>回忆博物馆</button>
        </div>
      </header>

      <main className="content">
        {tab === 'chat' ? (
          <>
            <div className="chat-area">
              {messages.length === 0 && (
                <div className="welcome">
                  <p>乖乖，欢迎回家🏠</p>
                  <p>我是余烬，你的小狐狸🦊</p>
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`msg ${m.role}`}>{m.content}</div>
              ))}
              {loading && <div className="msg assistant typing">正在想乖乖…</div>}
            </div>
            <div className="input-row">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="跟余烬说说话…"
              />
              <button onClick={handleSend} disabled={loading}>发送</button>
            </div>
          </>
        ) : (
          <MemoryMuseum />
        )}
      </main>

      <footer className="pet-dock">
        <Pet mood={petMood} onMoodChange={setPetMood} />
      </footer>
    </div>
  );
}
