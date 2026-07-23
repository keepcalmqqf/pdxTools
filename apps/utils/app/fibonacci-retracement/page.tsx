"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo, useState } from "react";
import { message } from "react-message-popup";
import {
  calcExtensionLevels,
  calcProjectionLevels,
  calcRetracementLevels,
  detectTrend,
  FibLevel,
  ratioFromPrice,
} from "@/lib/fibonacci";

export default function FibonacciRetracement() {
  const [startPrice, setStartPrice] = useState("");
  const [endPrice, setEndPrice] = useState("");
  const [cPrice, setCPrice] = useState("");
  const [customRatio, setCustomRatio] = useState("");
  const [customRatios, setCustomRatios] = useState<number[]>([]);
  const [currentPrice, setCurrentPrice] = useState("");

  const start = parseFloat(startPrice);
  const end = parseFloat(endPrice);
  const c = parseFloat(cPrice);
  const validBase =
    !Number.isNaN(start) && !Number.isNaN(end) && start !== end;

  const retracementLevels = useMemo<FibLevel[]>(() => {
    if (!validBase) return [];
    return calcRetracementLevels(start, end, [
      ...[0, 0.236, 0.382, 0.5, 0.618, 0.786, 1],
      ...customRatios.filter((r) => r >= 0 && r <= 1),
    ].sort((a, b) => a - b));
  }, [start, end, customRatios, validBase]);

  const extensionLevels = useMemo<FibLevel[]>(() => {
    if (!validBase) return [];
    return calcExtensionLevels(start, end, [
      ...[1, 1.272, 1.414, 1.618, 2, 2.618, 3.618, 4.236],
      ...customRatios.filter((r) => r > 1),
    ].sort((a, b) => a - b));
  }, [start, end, customRatios, validBase]);

  const projectionLevels = useMemo<FibLevel[]>(() => {
    if (!validBase || Number.isNaN(c)) return [];
    return calcProjectionLevels(start, end, c, [
      ...[0.618, 1, 1.272, 1.618, 2, 2.618],
      ...customRatios,
    ].sort((a, b) => a - b));
  }, [start, end, c, customRatios, validBase]);

  const addCustomRatio = () => {
    const ratio = parseFloat(customRatio);
    if (Number.isNaN(ratio) || ratio < 0) {
      message.error("请输入有效的比例（如 0.618 或 1.618）");
      return;
    }
    if (customRatios.includes(ratio)) {
      message.error("该比例已存在");
      return;
    }
    setCustomRatios([...customRatios, ratio]);
    setCustomRatio("");
  };

  const handleCopy = (value: number) => {
    navigator.clipboard.writeText(String(formatPrice(value)));
    message.success("复制成功");
  };

  const formatPrice = (price: number) => parseFloat(price.toFixed(4));

  const currentRatio =
    validBase && !Number.isNaN(parseFloat(currentPrice))
      ? ratioFromPrice(start, end, parseFloat(currentPrice))
      : null;

  const renderTable = (levels: FibLevel[]) => {
    if (!validBase) {
      return (
        <p className="text-sm text-muted-foreground">
          请先输入有效的起点价和终点价（两者不能相等）。
        </p>
    );
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 pr-4 font-medium">比例</th>
              <th className="text-left py-2 pr-4 font-medium">价格</th>
              <th className="text-left py-2 pr-4 font-medium">说明</th>
              <th className="text-left py-2 font-medium">操作</th>
            </tr>
          </thead>
          <tbody>
            {levels.map((level) => (
              <tr
                key={level.ratio}
                className="border-b last:border-0 hover:bg-muted/50"
              >
                <td className="py-2 pr-4 font-mono">{level.percent}</td>
                <td className="py-2 pr-4 font-mono">
                  {formatPrice(level.price)}
                </td>
                <td className="py-2 pr-4 text-muted-foreground">
                  {level.label}
                </td>
                <td className="py-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopy(level.price)}
                  >
                    复制
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">
            起点价（{validBase && detectTrend(start, end) === "up" ? "波段低点" : "波段高点"}）
          </label>
          <Input
            type="number"
            placeholder="如 100"
            value={startPrice}
            onChange={(e) => setStartPrice(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">
            终点价（{validBase && detectTrend(start, end) === "up" ? "波段高点" : "波段低点"}）
          </label>
          <Input
            type="number"
            placeholder="如 200"
            value={endPrice}
            onChange={(e) => setEndPrice(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">趋势方向</label>
          <Input
            readOnly
            className="bg-muted"
            value={
              validBase
                ? detectTrend(start, end) === "up"
                  ? "上涨（低 → 高）"
                  : "下跌（高 → 低）"
                : "等待输入"
            }
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Input
          type="number"
          placeholder="自定义比例，如 0.886"
          value={customRatio}
          onChange={(e) => setCustomRatio(e.target.value)}
          className="w-56"
          onKeyDown={(e) => e.key === "Enter" && addCustomRatio()}
        />
        <Button onClick={addCustomRatio}>添加比例</Button>
        {customRatios.length > 0 && (
          <>
            <span className="text-sm text-muted-foreground">
              已添加：
              {customRatios.map((r) => (
                <button
                  key={r}
                  className="ml-1 px-2 py-0.5 rounded bg-muted hover:bg-destructive/20 text-xs font-mono"
                  title="点击移除"
                  onClick={() =>
                    setCustomRatios(customRatios.filter((x) => x !== r))
                  }
                >
                  {r} ✕
                </button>
              ))}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCustomRatios([])}
            >
              清空
            </Button>
          </>
        )}
      </div>

      <Tabs defaultValue="retracement">
        <TabsList>
          <TabsTrigger value="retracement">回撤位</TabsTrigger>
          <TabsTrigger value="extension">扩展位</TabsTrigger>
          <TabsTrigger value="projection">投影位（ABC）</TabsTrigger>
          <TabsTrigger value="reverse">价格反推</TabsTrigger>
        </TabsList>

        <TabsContent value="retracement" className="pt-4">
          {renderTable(retracementLevels)}
        </TabsContent>

        <TabsContent value="extension" className="pt-4">
          {renderTable(extensionLevels)}
        </TabsContent>

        <TabsContent value="projection" className="pt-4 space-y-4">
          <div className="space-y-2 max-w-xs">
            <label className="text-sm font-medium">C 点价格（回调/反弹起点）</label>
            <Input
              type="number"
              placeholder="如 150"
              value={cPrice}
              onChange={(e) => setCPrice(e.target.value)}
            />
          </div>
          {Number.isNaN(c) ? (
            <p className="text-sm text-muted-foreground">
              请输入 C 点价格：已知 A→B 波段（即上方起终点），从 C 点按斐波那契比例投影目标位。
            </p>
          ) : (
            renderTable(projectionLevels)
          )}
        </TabsContent>

        <TabsContent value="reverse" className="pt-4 space-y-4">
          <div className="space-y-2 max-w-xs">
            <label className="text-sm font-medium">当前价格</label>
            <Input
              type="number"
              placeholder="输入价格反推所处比例"
              value={currentPrice}
              onChange={(e) => setCurrentPrice(e.target.value)}
            />
          </div>
          {currentRatio !== null && (
            <div className="text-sm space-y-1">
              <p>
                当前所处比例：
                <span className="font-mono font-medium">
                  {(currentRatio * 100).toFixed(2)}%
                </span>
              </p>
              <p className="text-muted-foreground">
                {currentRatio >= 0 && currentRatio <= 1
                  ? `处于波段内部（${currentRatio <= 0.5 ? "偏起点侧" : "偏终点侧"}）`
                  : currentRatio < 0
                    ? "已跌破/跌破起点，超出波段范围"
                    : "已突破终点，处于扩展区域"}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <div className="text-sm text-muted-foreground space-y-2">
        <p>说明：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>回撤位：价格从终点向起点方向回落 / 反弹可能遇到的支撑与阻力位。</li>
          <li>扩展位：价格突破终点后，按斐波那契比例推算的目标位。</li>
          <li>投影位：以 A→B 波段幅度为基准，从 C 点等比映射的目标位（三点扩展）。</li>
          <li>0.618 / 0.382 / 0.236 来自黄金分割，0.5 / 1 为常用补充位。</li>
        </ul>
      </div>
    </div>
  );
}
