/** 所有碎片圖層同尺寸，疊於中心 (0,0) 即為完整恐龍 */
export const DINO_DISPLAY_SIZE = 440;

export interface PieceDefinition {
  id: string;
  label: string;
  image: string;
  zIndex: number;
  /** 正確位置（相對棋盤中心，px） */
  targetX: number;
  targetY: number;
  /** 起始散落位置（相對棋盤中心） */
  startX: number;
  startY: number;
  width: number;
  height: number;
  rotation: number;
  targetRotation: number;
}

/** 拼圖碎片定義：座標與吸附邏輯由 JavaScript 控制 */
export const PUZZLE_PIECES: PieceDefinition[] = [
  {
    id: 'body',
    label: '身體',
    image: '/image/body.png',
    zIndex: 1,
    targetX: 0,
    targetY: 0,
    startX: -260,
    startY: 120,
    width: DINO_DISPLAY_SIZE,
    height: DINO_DISPLAY_SIZE,
    rotation: 0,
    targetRotation: 0,
  },
  {
    id: 'tail',
    label: '尾巴',
    image: '/image/tail.png',
    zIndex: 2,
    targetX: 0,
    targetY: 0,
    startX: 280,
    startY: -140,
    width: DINO_DISPLAY_SIZE,
    height: DINO_DISPLAY_SIZE,
    rotation: 0,
    targetRotation: 0,
  },
  {
    id: 'rearfeet',
    label: '後腳',
    image: '/image/rearfeet.png',
    zIndex: 3,
    targetX: 0,
    targetY: 0,
    startX: -280,
    startY: -120,
    width: DINO_DISPLAY_SIZE,
    height: DINO_DISPLAY_SIZE,
    rotation: 0,
    targetRotation: 0,
  },
  {
    id: 'frontfeet',
    label: '前腳',
    image: '/image/frontfeet.png',
    zIndex: 4,
    targetX: 0,
    targetY: 0,
    startX: 260,
    startY: 150,
    width: DINO_DISPLAY_SIZE,
    height: DINO_DISPLAY_SIZE,
    rotation: 0,
    targetRotation: 0,
  },
  {
    id: 'arm1',
    label: '前肢 1',
    image: '/image/arm1.png',
    zIndex: 5,
    targetX: 0,
    targetY: 0,
    startX: -200,
    startY: -180,
    width: DINO_DISPLAY_SIZE,
    height: DINO_DISPLAY_SIZE,
    rotation: 0,
    targetRotation: 0,
  },
  {
    id: 'arm2',
    label: '前肢 2',
    image: '/image/arm2.png',
    zIndex: 6,
    targetX: 0,
    targetY: 0,
    startX: 220,
    startY: -160,
    width: DINO_DISPLAY_SIZE,
    height: DINO_DISPLAY_SIZE,
    rotation: 0,
    targetRotation: 0,
  },
  {
    id: 'head',
    label: '頭部',
    image: '/image/head.png',
    zIndex: 7,
    targetX: 0,
    targetY: 0,
    startX: 180,
    startY: 100,
    width: DINO_DISPLAY_SIZE,
    height: DINO_DISPLAY_SIZE,
    rotation: 0,
    targetRotation: 0,
  },
];

export const DINO_OUTLINE_IMAGE = '/image/dino.png';

export const SNAP_THRESHOLD = 70;
export const GAME_DURATION = 15;

export function getSnapDistance(
  x: number,
  y: number,
  targetX: number,
  targetY: number,
): number {
  return Math.hypot(x - targetX, y - targetY);
}
