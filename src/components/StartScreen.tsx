import { startBackgroundMusic } from '../utils/gameSounds';

interface StartScreenProps {
  onStart: () => void;
}

export function StartScreen({ onStart }: StartScreenProps) {
  const handleStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    startBackgroundMusic();
    onStart();
  };

  const handleIntroClick = () => {
    startBackgroundMusic();
  };

  return (
    <section className="screen intro-screen" onClick={handleIntroClick}>
      <div className="intro-vignette" aria-hidden />
      <div className="intro-content">
        <div className="intro-header">
          <p className="chapter">【恐龍展廳】</p>
          <h1>博物館驚魂夜</h1>
        </div>
        <p className="story">
          博物館最深處的史前展廳，電力系統遭到不明破壞。
          身為夜班警衛的你，必須在電力斷斷續續閃爍的短暫空檔，
          將散落的暴龍骨骼拼回中央展示台。
        </p>
        <ul className="rules">
          <li>
            <strong>緊急修復</strong>
            <span>15 秒內將所有骨骼碎片正確拼入展示區</span>
          </li>
          <li>
            <strong>視線阻礙</strong>
            <span>電力會不規則閃爍，亮燈空檔極短</span>
          </li>
          <li>
            <strong>穩定時</strong>
            <span>畫面清晰，可確認碎片位置並精準移動</span>
          </li>
          <li>
            <strong>閃爍時</strong>
            <span>畫面快速明暗切換，需把握瞬間拖曳</span>
          </li>
          <li>
            <strong>通關條件</strong>
            <span>拼完後暴龍張口吐出鑰匙碎片</span>
          </li>
        </ul>
        <button type="button" className="btn-primary" onClick={handleStart}>
          ▶ 進入遊戲
        </button>
      </div>
    </section>
  );
}
