"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { message } from "react-message-popup";

const DEFAULT_STMT = `This device complies with part 15 of the FCC Rules. Operation is subject to the following two conditions:
(1) This device may not cause harmful interference, and
(2) this device must accept any interference received, including interference that may cause undesired operation.`;

const UkcaSvg = () => (
  <svg viewBox="0 0 46 50" xmlns="http://www.w3.org/2000/svg">
    <g
      fill="none"
      stroke="#000"
      strokeWidth="4.5"
      strokeLinejoin="round"
    >
      {/* U */}
      <path d="M 8 6 V 15 A 6 6 0 0 0 20 15 V 6" />
      {/* K */}
      <path d="M 26 6 V 22" />
      <path d="M 37 6 L 26.5 14.5" />
      <path d="M 29 12.5 L 38 22" />
      {/* C */}
      <path d="M 20 30 A 8 8 0 1 0 20 42" />
      {/* A */}
      <path d="M 26 44 L 33.5 28 L 41 44" />
      <path d="M 28.8 38 H 38.2" />
    </g>
  </svg>
);

const CeSvg = () => (
  <svg viewBox="0 0 80 50" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="#000" strokeWidth="6">
      <path d="M 38 8 A 19 19 0 1 0 38 42" />
      <path d="M 74 8 A 19 19 0 1 0 74 42" transform="translate(-4,0)" />
    </g>
    <line x1="46" y1="25" x2="66" y2="25" stroke="#000" strokeWidth="6" />
  </svg>
);

const FcSvg = () => (
  <svg viewBox="0 0 82 50" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 6 h25 v6 h-18 v10 h13 v6 h-13 v16 h-7 z" fill="#000" />
    <g fill="none" stroke="#000">
      <path d="M 63 8 A 19 19 0 1 0 63 42" strokeWidth="6" />
      <path d="M 60.5 17 A 10 10 0 1 0 60.5 33" strokeWidth="5" />
    </g>
  </svg>
);

const WeeeSvg = () => (
  <svg viewBox="0 0 44 56" xmlns="http://www.w3.org/2000/svg">
    <g fill="#000">
      <path d="M8 14 h28 l-4 30 h-20 z" />
      <rect x="12" y="44" width="6" height="6" rx="3" />
      <rect x="26" y="44" width="6" height="6" rx="3" />
      <path d="M4 12 h36 v4 h-36 z" />
      <rect x="18" y="4" width="8" height="8" />
    </g>
    <line x1="2" y1="2" x2="42" y2="52" stroke="#000" strokeWidth="5" />
    <rect x="0" y="53" width="44" height="3" fill="#000" />
  </svg>
);

const RecycleSvg = () => (
  <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
    <g fill="none" stroke="#000" strokeWidth="5">
      <path d="M 46 20 A 20 20 0 1 0 48 32" />
    </g>
    <path d="M 46 8 L 54 24 L 38 22 Z" fill="#000" />
  </svg>
);

const MARKS = [
  { key: "ukca", name: "UKCA", Svg: UkcaSvg },
  { key: "ce", name: "CE", Svg: CeSvg },
  { key: "fc", name: "FCC", Svg: FcSvg },
  { key: "weee", name: "垃圾桶", Svg: WeeeSvg },
  { key: "recycle", name: "循环", Svg: RecycleSvg },
] as const;

type MarkKey = (typeof MARKS)[number]["key"];

export default function CertLabelGeneratorPage() {
  const [model, setModel] = useState("DS038");
  const [mfr, setMfr] = useState(
    "ZHONGSHAN DISHUN ELECTRICAL TECHNOLOGY CO., LTD"
  );
  const [addr, setAddr] = useState(
    "Building D, Dongcheng Technology Park, Dongcheng Road, Dongfeng Town, Zhongshan City, Guangdong Province, China"
  );
  const [stmt, setStmt] = useState(DEFAULT_STMT);
  const [origin, setOrigin] = useState("Country of origin: Made in china");
  const [marks, setMarks] = useState<Record<MarkKey, boolean>>({
    ukca: true,
    ce: true,
    fc: true,
    weee: true,
    recycle: true,
  });
  const [exporting, setExporting] = useState(false);
  const labelRef = useRef<HTMLDivElement>(null);

  const exportPng = async () => {
    if (!labelRef.current || exporting) return;
    setExporting(true);
    try {
      const { snapdom } = await import("@zumer/snapdom");
      await snapdom.download(labelRef.current, {
        format: "png",
        scale: 3,
        backgroundColor: "#ffffff",
        filename: model || "label",
      });
    } catch (err) {
      message.error("导出失败");
    } finally {
      setExporting(false);
    }
  };

  const cellClass =
    "border-[1.5px] border-black px-[14px] py-3 text-[17px] font-bold align-middle break-words whitespace-pre-line";

  return (
    <div className="mobile-container">
      {/* 打印时只保留标签本体 */}
      <style>{`
        @media print {
          nav, .label-panel, .label-page-header { display: none !important; }
          body { background: #fff !important; }
          .label-stage { display: block !important; }
        }
      `}</style>

      <div className="label-page-header mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">
          认证标签生成器
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          填写标签内容，实时预览，支持打印和导出 PNG
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* 左侧：动态填写 */}
        <div className="label-panel w-full lg:w-[340px] shrink-0 bg-background border border-border rounded-lg p-5 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Model（型号）
              </label>
              <Input
                className="text-base"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Manufacturer（制造商）
              </label>
              <Textarea
                className="text-base"
                rows={2}
                value={mfr}
                onChange={(e) => setMfr(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                Address（地址）
              </label>
              <Textarea
                className="text-base"
                rows={3}
                value={addr}
                onChange={(e) => setAddr(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                合规声明文字
              </label>
              <Textarea
                className="text-base"
                rows={6}
                value={stmt}
                onChange={(e) => setStmt(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">
                原产国
              </label>
              <Input
                className="text-base"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground">
                认证标志
              </label>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {MARKS.map((m) => (
                  <label
                    key={m.key}
                    className="flex items-center gap-1.5 text-sm text-foreground cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={marks[m.key]}
                      onChange={(e) =>
                        setMarks((prev) => ({
                          ...prev,
                          [m.key]: e.target.checked,
                        }))
                      }
                    />
                    {m.name}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                className="flex-1 touch-feedback"
                onClick={() => window.print()}
              >
                打印
              </Button>
              <Button
                className="flex-1 touch-feedback bg-green-600 hover:bg-green-700 text-white"
                onClick={exportPng}
                disabled={exporting}
              >
                {exporting ? "导出中..." : "导出 PNG"}
              </Button>
            </div>
          </div>
        </div>

        {/* 右侧：标签预览 */}
        <div className="label-stage flex-1 flex justify-center w-full overflow-x-auto">
          <div
            ref={labelRef}
            className="w-[480px] shrink-0 bg-white text-black border-2 border-black"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            <table className="w-full border-collapse table-fixed">
              <tbody>
                <tr>
                  <td className={`${cellClass} w-[32%]`}>Model</td>
                  <td className={cellClass}>{model}</td>
                </tr>
                <tr>
                  <td className={`${cellClass} w-[32%]`}>Manufacturer</td>
                  <td className={cellClass}>{mfr}</td>
                </tr>
                <tr>
                  <td className={`${cellClass} w-[32%]`}>Address</td>
                  <td className={cellClass}>{addr}</td>
                </tr>
              </tbody>
            </table>
            <div className="border-[1.5px] border-t-0 border-black px-[14px] py-3 text-[15.5px] font-bold leading-snug whitespace-pre-line">
              {stmt}
            </div>
            <div className="border-[1.5px] border-t-0 border-black flex items-center justify-around px-[10px] py-2 min-h-[62px] gap-2 [&>svg]:h-[46px] [&>svg]:w-auto">
              {MARKS.filter((m) => marks[m.key]).map((m) => (
                <m.Svg key={m.key} />
              ))}
            </div>
            <div className="px-[14px] pt-2 pb-[10px] text-[17px] font-bold">
              {origin}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
