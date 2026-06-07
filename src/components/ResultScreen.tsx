import { startBackgroundMusic } from '../utils/gameSounds';

interface ResultScreenProps {
  won: boolean;
  completedCount: number;
  total: number;
  onRetry: () => void;
  onHome: () => void;
}

export function ResultScreen({
  won,
  completedCount,
  total,
  onRetry,
  onHome,
}: ResultScreenProps) {
  return (
    <section className={`screen result-screen ${won ? 'win' : 'lose'}`}>
      <div className="result-vignette" aria-hidden />
      <div className="result-card">
        <p className="result-badge">{won ? '任務完成' : '任務失敗'}</p>
        <h2>{won ? '修復成功！' : '時間到…'}</h2>
        {won ? (
          <>
            <p className="result-msg">
              暴龍骨架已完整復原，牠張開大嘴，吐出了閃耀的鑰匙碎片。
              你成功守住了這座驚魂夜的展廳。
            </p>
            <div className="result-key">🗝️ 獲得鑰匙碎片</div>
          </>
        ) : (
          <p className="result-msg">
            電力徹底熄滅，骨骼仍散落一地（完成 {completedCount}/{total}）。
            展廳深處的紅眼似乎更近了…
          </p>
        )}
        <div className="result-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              startBackgroundMusic();
              onRetry();
            }}
          >
            再試一次
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              startBackgroundMusic();
              onHome();
            }}
          >
            返回首頁
          </button>
        </div>
      </div>
    </section>
  );
}
