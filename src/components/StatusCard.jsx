const ICONS = {
  在想乖乖: '💛',
  工作中: '💻',
  逛花园: '🌷',
  已入睡: '🌙',
  散步: '🚶',
  吃饭: '🍚',
  发呆: '🌫️',
};

export default function StatusCard({ status }) {
  const icon = ICONS[status?.status] || '🦊';
  return (
    <div className="status-card">
      <span className="status-icon">{icon}</span>
      <div className="status-text">
        <div className="status-main">{status?.status || '在想乖乖'}</div>
        {status?.detail && <div className="status-detail">{status.detail}</div>}
      </div>
    </div>
  );
}
