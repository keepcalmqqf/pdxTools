/**
 * 斐波那契回撤 / 扩展 / 投影计算模块
 *
 * 约定：
 * - 上涨趋势（up）: 起点 start 为波段低点，终点 end 为波段高点
 * - 下跌趋势（down）: 起点 start 为波段高点，终点 end 为波段低点
 * - 回撤位：价格从终点向起点方向回落/反弹到的位置
 * - 扩展位：价格突破终点后继续运行到的位置
 * - 投影位：已知 A、B 两点，从 C 点等比映射出的位置（三点扩展）
 */

export type Trend = "up" | "down";

export interface FibLevel {
  /** 比例，如 0.382 */
  ratio: number;
  /** 显示用的百分比，如 "38.2%" */
  percent: string;
  /** 计算出的价格 */
  price: number;
  /** 该比例的中文含义说明 */
  label: string;
}

/** 常用回撤比例 */
export const RETRACEMENT_RATIOS = [
  0, 0.236, 0.382, 0.5, 0.618, 0.786, 1,
] as const;

/** 常用扩展比例（突破终点后的目标位） */
export const EXTENSION_RATIOS = [
  0, 0.618, 1, 1.272, 1.414, 1.618, 2, 2.618, 3.618, 4.236,
] as const;

/** 常用投影比例（C 点相对 AB 波段的映射） */
export const PROJECTION_RATIOS = [
  0.618, 1, 1.272, 1.618, 2, 2.618,
] as const;

/** 比例含义说明 */
const RATIO_LABELS: Record<string, string> = {
  "0": "起点（0%）",
  "0.236": "弱回撤位（23.6%）",
  "0.382": "常见回撤位（38.2%）",
  "0.5": "半分位（50%，道氏理论）",
  "0.618": "黄金分割位（61.8%）",
  "0.786": "深回撤位（78.6%）",
  "1": "终点 / 完整回撤（100%）",
  "1.272": "扩展位（127.2%）",
  "1.414": "扩展位（141.4%，√2）",
  "1.618": "黄金分割扩展位（161.8%）",
  "2": "双倍扩展位（200%）",
  "2.618": "扩展位（261.8%）",
  "3.618": "扩展位（361.8%）",
  "4.236": "扩展位（423.6%）",
};

export const getRatioLabel = (ratio: number): string =>
  RATIO_LABELS[String(ratio)] ?? `自定义比例（${(ratio * 100).toFixed(1)}%）`;

const formatPercent = (ratio: number): string =>
  `${parseFloat((ratio * 100).toFixed(3))}%`;

/** 根据起终点自动判断趋势方向 */
export const detectTrend = (start: number, end: number): Trend =>
  end >= start ? "up" : "down";

/**
 * 计算回撤位
 * 上涨趋势：回撤价 = end - (end - start) * ratio
 * 下跌趋势：回撤价 = end + (start - end) * ratio
 */
export const calcRetracementLevels = (
  start: number,
  end: number,
  ratios: readonly number[] = RETRACEMENT_RATIOS
): FibLevel[] => {
  const diff = Math.abs(end - start);
  const trend = detectTrend(start, end);
  return ratios.map((ratio) => {
    const price = trend === "up" ? end - diff * ratio : end + diff * ratio;
    return {
      ratio,
      percent: formatPercent(ratio),
      price,
      label: getRatioLabel(ratio),
    };
  });
};

/**
 * 计算扩展位（价格突破终点后的目标位）
 * 上涨趋势：扩展价 = start + (end - start) * ratio（ratio > 1）
 * 下跌趋势：扩展价 = start - (start - end) * ratio（ratio > 1）
 */
export const calcExtensionLevels = (
  start: number,
  end: number,
  ratios: readonly number[] = EXTENSION_RATIOS
): FibLevel[] => {
  const diff = Math.abs(end - start);
  const trend = detectTrend(start, end);
  return ratios.map((ratio) => {
    const price = trend === "up" ? start + diff * ratio : start - diff * ratio;
    return {
      ratio,
      percent: formatPercent(ratio),
      price,
      label: getRatioLabel(ratio),
    };
  });
};

/**
 * 计算投影位（三点扩展 / ABC 投影）
 * 已知 A->B 波段，价格从 C 点出发，目标价 = c + (b - a) * ratio
 */
export const calcProjectionLevels = (
  a: number,
  b: number,
  c: number,
  ratios: readonly number[] = PROJECTION_RATIOS
): FibLevel[] => {
  const diff = b - a;
  return ratios.map((ratio) => ({
    ratio,
    percent: formatPercent(ratio),
    price: c + diff * ratio,
    label: getRatioLabel(ratio),
  }));
};

/** 由起点、终点和比例反推价格 */
export const priceFromRatio = (
  start: number,
  end: number,
  ratio: number
): number => {
  const diff = Math.abs(end - start);
  const trend = detectTrend(start, end);
  return trend === "up" ? start + diff * ratio : start - diff * ratio;
};

/** 由起点、终点和当前价格反推当前所处的回撤/扩展比例 */
export const ratioFromPrice = (
  start: number,
  end: number,
  price: number
): number => {
  const diff = Math.abs(end - start);
  if (diff === 0) return 0;
  const trend = detectTrend(start, end);
  return trend === "up" ? (price - start) / diff : (start - price) / diff;
};

/** 黄金分割比例 φ */
export const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

/** 生成斐波那契数列前 n 项 */
export const fibonacciSequence = (n: number): number[] => {
  if (n <= 0) return [];
  const seq = [0, 1];
  while (seq.length < n) {
    seq.push(seq[seq.length - 1] + seq[seq.length - 2]);
  }
  return seq.slice(0, n);
};

/** 计算第 n 个斐波那契数 */
export const fibonacciNumber = (n: number): number => {
  if (n < 0) return NaN;
  if (n < 2) return n;
  let [a, b] = [0, 1];
  for (let i = 2; i <= n; i++) {
    [a, b] = [b, a + b];
  }
  return b;
};
