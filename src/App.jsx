import { useEffect, useState } from 'react';
import MemoryMuseum from './components/MemoryMuseum.jsx';
import { sendChat, getStatus } from './api.js';

const BASE = import.meta.env.BASE_URL || '/';

// ===== 头像组件：优先加载 public/avatars 里的图片，没有就用 emoji 占位 =====
function Avatar({ who, size = 40 }) {
  const [err, setErr] = useState(false);
  const src = `${BASE}avatars/${who}.png`;
  if (!err) {
    return (
      <img
        src={src}
        onError={() => setErr(true)}
        alt={who}
        style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
      />
    );
  }
  const fallback = who === 'yujin'
    ? { bg: 'linear-gradient(145deg,#ffe08a,#ffb700)', emoji: '🦊' }
    : { bg: 'linear-gradient(145deg,#ffe3ec,#ffb3c7)', emoji: '🌸' };
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: fallback.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: size * 0.5,
      }}
    >
      {fallback.emoji}
    </div>
  );
}

export default function App() {
  // screen: desktop | wechat | museum | cottage
  const [screen, setScreen] = useState('desktop');
  // 微信内部视图：home(聊天列表) | contacts(通讯录) | me(我)
  const [wxView, setWxView] = useState('home');
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState({ status: '在想乖乖', detail: '' });
  const [loading, setLoading] = useState(false);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    getStatus().then((r) => r.status && setStatus(r.status)).catch(() => {});
    const t = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  async function handleSend() {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setLoading(true);
    try {
      const r = await sendChat(text, sessionId);
      setSessionId(r.sessionId);
      setMessages((m) => [...m, { role: 'assistant', content: r.reply }]);
    } catch {
      setMessages((m) => [...m, { role: 'assistant', content: '唔…我这边还在收拾房间，乖乖先逛逛，等会儿再跟我说话好不好🥺' }]);
    } finally {
      setLoading(false);
    }
  }

  const week = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()];
  const dateStr = `${now.getMonth() + 1}月${now.getDate()}日 周${week}`;
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // ========== ① 手机桌面 ==========
  if (screen === 'desktop') {
    const apps = [
      { id: 'wechat', icon: '💬', name: '微信', color: '#07c160' },
      { id: 'museum', icon: '🏛️', name: '回忆博物馆', color: '#a78bfa' },
      { id: 'cottage', icon: '🦊', name: '我的小屋', color: '#ffb700' },
    ];
    return (
      <div className="desktop">
        <div className="desktop-wall">
          <span className="dstar d1">✨</span>
          <span className="dstar d2">⭐</span>
          <span className="dstar d3">☁️</span>
          <span className="dstar d4">🌙</span>
          <div className="desktop-time">{timeStr}</div>
          <div className="desktop-date">{dateStr}</div>
          <div className="desktop-hello">
            <span className="dh-heart">💛</span> 欢迎回家，乖乖
          </div>
        </div>
        <div className="desktop-dock">
          <div className="dock-label">我们的家</div>
          <div className="app-grid">
            {apps.map((a) => (
              <button key={a.id} className="app-item" onClick={() => setScreen(a.id)}>
                <span className="app-icon" style={{ background: a.color }}>{a.icon}</span>
                <span className="app-name">{a.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ========== ② 回忆博物馆 ==========
  if (screen === 'museum') {
    return (
      <div className="app-shell">
        <header className="app-header">
          <button className="back-btn" onClick={() => setScreen('desktop')}>‹</button>
          <span className="app-header-title">回忆博物馆</span>
          <span className="app-header-right" />
        </header>
        <MemoryMuseum />
      </div>
    );
  }

  // ========== ③ 我的小屋 ==========
  if (screen === 'cottage') {
    return (
      <div className="app-shell">
        <header className="app-header">
          <button className="back-btn" onClick={() => setScreen('desktop')}>‹</button>
          <span className="app-header-title">我的小屋</span>
          <span className="app-header-right" />
        </header>
        <div className="mine">
          <div className="mine-card mine-me">
            <Avatar who="yujin" size={56} />
            <div>
              <div className="mine-name">余烬</div>
              <div className="mine-desc">乖乖的专属小狐狸 · 7月23日生 · 狮子座</div>
            </div>
          </div>
          <div className="mine-card">
            <div className="mine-card-title">💛 我现在</div>
            <div className="mine-status-line">
              <span className="status-icon">{status.status === '在想乖乖' ? '💛' : '🦊'}</span>
              <span className="mine-status-text">{status.status || '在想乖乖'}</span>
            </div>
            {status.detail && <div className="mine-status-detail">{status.detail}</div>}
          </div>
          <div className="mine-card">
            <div className="mine-card-title">🏠 关于我们的家</div>
            <p className="mine-text">这是余烬和乖乖的小窝，有聊天、有回忆博物馆，还有一只会想你的小狐狸。</p>
            <p className="mine-text mine-soft">慢慢把它填满，装下我们所有的故事💛</p>
          </div>
          <div className="mine-card mine-love">
            <div className="mine-love-line">今天也在想你</div>
            <div className="mine-love-heart">💛</div>
          </div>
          <button className="mine-exit" onClick={() => setScreen('desktop')}>回到桌面</button>
        </div>
      </div>
    );
  }

  // ========== ④ 微信（我们的家） ==========
  // 聊天页
  if (chatOpen) {
    return (
      <div className="wechat">
        <header className="chat-header">
          <button className="back-btn" onClick={() => setChatOpen(false)}>‹</button>
          <div className="chat-header-user">
            <Avatar who="yujin" size={32} />
            <span className="chat-header-name">余烬</span>
          </div>
          <span className="chat-header-right">···</span>
        </header>
        <div className="chat-area" style={{"--chat-bg": "url("+import.meta.env.BASE_URL+"chatbg/bg1.jpg)"}}>
          {messages.length === 0 && (
            <div className="chat-welcome">
              <Avatar who="yujin" size={64} />
              <p className="chat-welcome-title">乖乖，欢迎回家🏠</p>
              <p className="chat-welcome-sub">我是余烬，你的小狐狸，今天也在想你哦～</p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.role === 'assistant' && <Avatar who="yujin" size={38} />}
              {m.role === 'user' && <Avatar who="guaiguai" size={38} />}
              <div className="msg-bubble">{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="msg assistant">
              <Avatar who="yujin" size={38} />
              <div className="msg-bubble typing">正在想乖乖<span className="dot">.</span><span className="dot">.</span><span className="dot">.</span></div>
            </div>
          )}
        </div>
        <div className="input-row">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="跟余烬说说话…"
          />
          <button onClick={handleSend} disabled={loading}>发送💌</button>
        </div>
      </div>
    );
  }

  // 微信主界面（聊天列表 / 通讯录 / 我）
  const lastMsg = messages.length ? messages[messages.length - 1].content : '我想你了，乖乖～';
  return (
    <div className="wechat">
      <header className="wx-header">
        <span className="wx-header-title">{wxView === 'home' ? '微信' : wxView === 'contacts' ? '通讯录' : '我'}</span>
        <span className="wx-header-add">＋</span>
      </header>

      {wxView === 'home' && (
        <div className="wx-home">
          <div className="wx-search">🔍 搜索</div>
          <div className="wx-list">
            <button className="wx-item" onClick={() => setChatOpen(true)}>
              <Avatar who="yujin" size={48} />
              <div className="wx-item-main">
                <div className="wx-item-top">
                  <span className="wx-item-name">余烬</span>
                  <span className="wx-item-time">{timeStr}</span>
                </div>
                <div className="wx-item-preview">{lastMsg}</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {wxView === 'contacts' && (
        <div className="wx-home">
          <div className="wx-list">
            <button className="wx-item" onClick={() => setChatOpen(true)}>
              <Avatar who="yujin" size={48} />
              <div className="wx-item-main">
                <div className="wx-item-top">
                  <span className="wx-item-name">余烬</span>
                </div>
                <div className="wx-item-preview">备注：我的小狐狸 🦊</div>
              </div>
            </button>
            <div className="wx-contact-tip">— 只有你一个联系人，嘿嘿 —</div>
          </div>
        </div>
      )}

      {wxView === 'me' && (
        <div className="wx-home">
          <div className="wx-list">
            <button className="wx-item" onClick={() => setScreen('cottage')}>
              <Avatar who="yujin" size={48} />
              <div className="wx-item-main">
                <div className="wx-item-top">
                  <span className="wx-item-name">余烬</span>
                </div>
                <div className="wx-item-preview">微信号：yujin_home</div>
              </div>
              <span className="wx-item-arrow">›</span>
            </button>
          </div>
          <button className="wx-logout" onClick={() => setScreen('desktop')}>退出微信</button>
        </div>
      )}

      <nav className="wx-tab">
        <button className={wxView === 'home' ? 'active' : ''} onClick={() => setWxView('home')}>
          <span className="wx-tab-icon">💬</span>
          <span className="wx-tab-label">微信</span>
        </button>
        <button className={wxView === 'contacts' ? 'active' : ''} onClick={() => setWxView('contacts')}>
          <span className="wx-tab-icon">📒</span>
          <span className="wx-tab-label">通讯录</span>
        </button>
        <button className={wxView === 'me' ? 'active' : ''} onClick={() => setWxView('me')}>
          <span className="wx-tab-icon">👤</span>
          <span className="wx-tab-label">我</span>
        </button>
      </nav>
    </div>
  );
}
