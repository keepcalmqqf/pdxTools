"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const REGEX_PATTERNS = [
  {
    label: "数字",
    value: "\\d+",
    description: "匹配连续的数字",
    example: "文本中的123和456都会被匹配到",
  },
  {
    label: "邮箱",
    value: "[\\w.-]+@[\\w.-]+\\.[a-zA-Z]{2,}",
    description: "匹配电子邮件地址",
    example: "example@email.com",
  },
  {
    label: "URL",
    value:
      "https?://[\\w\\-\\.]+\\.[a-zA-Z]{2,}[\\w\\-\\._~:/?#[\\]@!$&'()*+,;=]*",
    description: "匹配网址链接",
    example: "https://example.com",
  },
  {
    label: "手机号码",
    value: "1[3-9]\\d{9}",
    description: "匹配中国大陆手机号码",
    example: "13812345678",
  },
  {
    label: "IP地址",
    value: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b",
    description: "匹配IPv4地址",
    example: "192.168.1.1",
  },
  {
    label: "日期",
    value: "\\d{4}[-/年]\\d{1,2}[-/月]\\d{1,2}日?",
    description: "匹配常见日期格式",
    example: "2024-03-21 或 2024年3月21日",
  },
  {
    label: "中文字符",
    value: "[\\u4e00-\\u9fa5]+",
    description: "匹配连续的中文字符",
    example: "匹配中文内容",
  },
  {
    label: "自定义",
    value: "custom",
    description: "输入自定义正则表达式",
    example: "根据需要自定义匹配模式",
  },
];

// 定义正则表达式标志位选项
const flagOptions = [
  { value: 'g', label: 'g - 全局匹配', description: '查找所有匹配项,而不是在第一个匹配后停止' },
  { value: 'i', label: 'i - 忽略大小写', description: '不区分大小写进行匹配' },
  { value: 'm', label: 'm - 多行匹配', description: '使^和$匹配每一行的开头和结尾' },
  { value: 's', label: 's - 点号匹配所有', description: '允许.匹配换行符' },
  { value: 'u', label: 'u - Unicode模式', description: '启用完整的Unicode支持' },
  { value: 'y', label: 'y - 粘性匹配', description: '仅匹配目标字符串中此正则表达式的lastIndex属性指示的索引' },
]

export default function RegexExtractText() {
  const [text, setText] = useState("");
  const [regex, setRegex] = useState("");
  const [selectedPattern, setSelectedPattern] = useState<string>("\\d+");
  const [flags, setFlags] = useState("g");
  const [result, setResult] = useState<string[]>([]);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handlePatternChange = (value: string) => {
    if (value === "custom") {
      setShowCustomInput(true);
      setRegex("");
    } else {
      setShowCustomInput(false);
      setRegex(value);
    }
    setSelectedPattern(value);
  };

  const handleExtract = () => {
    const pattern = showCustomInput ? regex : selectedPattern;
    if (!pattern) {
      message.error("请输入正则表达式");
      return;
    }

    try {
      const regexObj = new RegExp(pattern, flags);
      const matches = text.match(regexObj);
      if (matches) {
        setResult(matches);
      } else {
        setResult([]);
        message.info("没有找到匹配项");
      }
    } catch (error) {
      message.error("正则表达式格式错误");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.join("\n"));
    message.success("复制成功");
  };

  const handleClear = () => {
    setText("");
    setRegex("");
    setResult([]);
  };

  const currentPattern = REGEX_PATTERNS.find(
    (p) => p.value === selectedPattern
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={selectedPattern} onValueChange={handlePatternChange}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="选择匹配模式" />
            </SelectTrigger>
            <SelectContent>
              {REGEX_PATTERNS.map((pattern) => (
                <SelectItem key={pattern.value} value={pattern.value}>
                  {pattern.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {showCustomInput && (
            <Input
              placeholder="输入自定义正则表达式"
              value={regex}
              onChange={(e) => setRegex(e.target.value)}
              className="flex-1 min-w-0 text-base"
            />
          )}

          <Select
            value={flags}
            onValueChange={(value) => setFlags(value)}
          >
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="选择标志位" />
            </SelectTrigger>
            <SelectContent>
              {flagOptions.map((option) => (
                <SelectItem 
                  key={option.value} 
                  value={option.value}
                >
                  <div>
                    <div>{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {currentPattern && (
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>说明：</strong>
              {currentPattern.description}
            </p>
            <p>
              <strong>示例：</strong>
              {currentPattern.example}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">输入文本</span>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={handleExtract}>
                提取
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                清空
              </Button>
            </div>
          </div>
          <Textarea
            placeholder="在此输入需要提取的文本"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={20}
            className="text-base"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">
              提取结果 ({result.length})
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={result.length === 0}
            >
              复制结果
            </Button>
          </div>
          <Textarea
            value={result.join("\n")}
            readOnly
            rows={20}
            className="text-base"
          />
        </div>
      </div>
    </div>
  );
}
