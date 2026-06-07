import { GameBoard } from './components/GameBoard';
import { ResultScreen } from './components/ResultScreen';
import { StartScreen } from './components/StartScreen';
import { PUZZLE_PIECES } from './data/pieces';
import { useFlicker } from './hooks/useFlicker';
import { useGameAudio } from './hooks/useGameAudio';
import { useGameStore } from './store/gameStore';

export default function App() {
  const phase = useGameStore((s) => s.phase);
  const completedCount = useGameStore((s) => s.completedCount);
  const startGame = useGameStore((s) => s.startGame);
  const resetToIntro = useGameStore((s) => s.resetToIntro);

  useFlicker();
  useGameAudio();

  return (
    <div className="app">
      {phase === 'intro' && <StartScreen onStart={startGame} />}
      {phase === 'playing' && <GameBoard />}
      {(phase === 'won' || phase === 'lost') && (
        <ResultScreen
          won={phase === 'won'}
          completedCount={completedCount}
          total={PUZZLE_PIECES.length}
          onRetry={startGame}
          onHome={resetToIntro}
        />
      )}
    </div>
  );
}
