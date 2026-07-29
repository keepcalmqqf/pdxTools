"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { message } from "react-message-popup";

type EncodeMode = "encodeURI" | "encodeURIComponent" | "escape";
type DecodeMode = "decodeURI" | "decodeURIComponent" | "unescape";

const ENCODE_MODES = [
  {
    value: "encodeURI",
    label: "encodeURI",
    description: "编码 URL，但不编码 URL 中的特殊字符，如 / ? : @ & = + $ #",
  },
  {
    value: "encodeURIComponent",
    label: "encodeURIComponent",
    description: "编码 URL 中的所有特殊字符",
  },
  {
    value: "escape",
    label: "escape (已废弃)",
    description: "将字符串编码为 Unicode 转义序列",
  },
];

const DECODE_MODES = [
  {
    value: "decodeURI",
    label: "decodeURI",
    description: "解码由 encodeURI 创建的统一资源标识符（URI）",
  },
  {
    value: "decodeURIComponent",
    label: "decodeURIComponent",
    description: "解码由 encodeURIComponent 编码的 URI 组件",
  },
  {
    value: "unescape",
    label: "unescape (已废弃)",
    description: "解码 escape 方法编码的字符串",
  },
];

export default function URLDecodeEncode() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [encodeMode, setEncodeMode] = useState<EncodeMode>("encodeURIComponent");
  const [decodeMode, setDecodeMode] = useState<DecodeMode>("decodeURIComponent");

  const handleEncode = () => {
    try {
      let result = "";
      switch (encodeMode) {
        case "encodeURI":
          result = encodeURI(input);
          break;
        case "encodeURIComponent":
          result = encodeURIComponent(input);
          break;
        case "escape":
          result = escape(input);
          break;
      }
      setOutput(result);
    } catch (error) {
      message.error("编码失败：" + (error as Error).message);
    }
  };

  const handleDecode = () => {
    try {
      let result = "";
      switch (decodeMode) {
        case "decodeURI":
          result = decodeURI(input);
          break;
        case "decodeURIComponent":
          result = decodeURIComponent(input);
          break;
        case "unescape":
          result = unescape(input);
          break;
      }
      setOutput(result);
    } catch (error) {
      message.error("解码失败：" + (error as Error).message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    message.success("复制成功");
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  const handleSwap = () => {
    setInput(output);
    setOutput(input);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Select value={encodeMode} onValueChange={(v) => setEncodeMode(v as EncodeMode)}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="选择编码方式" />
          </SelectTrigger>
          <SelectContent>
            {ENCODE_MODES.map((mode) => (
              <SelectItem key={mode.value} value={mode.value}>
                <div>
                  <div>{mode.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {mode.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={decodeMode} onValueChange={(v) => setDecodeMode(v as DecodeMode)}>
          <SelectTrigger className="w-full sm:w-[250px]">
            <SelectValue placeholder="选择解码方式" />
          </SelectTrigger>
          <SelectContent>
            {DECODE_MODES.map((mode) => (
              <SelectItem key={mode.value} value={mode.value}>
                <div>
                  <div>{mode.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {mode.description}
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">输入</span>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={handleEncode}>
                编码
              </Button>
              <Button variant="outline" size="sm" onClick={handleDecode}>
                解码
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                清空
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="在此输入需要编码或解码的文本"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={15}
            className="text-base"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">输出</span>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={handleSwap}>
                交换
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                disabled={!output}
              >
                复制
              </Button>
            </div>
          </div>
          <Textarea value={output} readOnly rows={15} className="text-base" />
        </div>
      </div>

      <div className="text-sm text-muted-foreground space-y-2">
        <p>说明：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            encodeURI/decodeURI：用于编码完整的 URL，不会编码 URL
            中的功能字符（如 :/?=&#）
          </li>
          <li>
            encodeURIComponent/decodeURIComponent：用于编码 URL
            参数，会编码所有特殊字符
          </li>
          <li>
            escape/unescape：已废弃的编码方法，仅用于兼容旧代码，不推荐使用
          </li>
        </ul>
      </div>
    </div>
  );
}