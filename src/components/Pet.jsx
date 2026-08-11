import { useState } from 'react';

// 小狐狸桌宠：可戳、会换表情、情绪绑定
export default function Pet({ mood, onMoodChange }) {
  const [bounce, setBounce] = useState(0);
  const [tapCount, setTapCount] = useState(0);

  function handleTap() {
    setBounce((b) => b + 1);
    setTapCount((c) => c + 1);
    if (tapCount % 3 === 2) {
      onMoodChange('生气');
      setTimeout(() => onMoodChange('开心'), 2000);
    } else if (tapCount % 3 === 0) {
      onMoodChange('撒娇');
      setTimeout(() => onMoodChange('开心'), 2000);
    }
  }

  const faces = {
    开心: '◕‿◕',
    生气: '◣_◢',
    委屈: '◕︵◕',
    撒娇: '(๑¯ω¯๑)',
    认真: '•̀ᴗ•́',
  };

  return (
    <div className={`pet ${bounce % 2 ? 'bounce' : ''}`} onClick={handleTap} title="戳我一下">
      <div className="pet-face">{faces[mood] || faces.开心}</div>
      <div className="pet-tail">🦊</div>
      <div className="pet-hint">{mood}</div>
    </div>
  );
}
