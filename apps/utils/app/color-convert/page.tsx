"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { message } from "react-message-popup";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";

type ColorFormat = "hex" | "rgb" | "hsl";

interface ColorState {
  hex: string;
  rgb: string;
  hsl: string;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export default function ColorConvert() {
  const [color, setColor] = useState<ColorState>({
    hex: "#000000",
    rgb: "rgb(0, 0, 0)",
    hsl: "hsl(0, 0%, 0%)",
  });
  const [currentFormat, setCurrentFormat] = useState<ColorFormat>("hex");
  const [rgbValues, setRgbValues] = useState<RGBColor>({ r: 0, g: 0, b: 0 });
  const [hslValues, setHslValues] = useState<HSLColor>({ h: 0, s: 0, l: 0 });

  // 转换函数
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "rgb(0, 0, 0)";
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    return `rgb(${r}, ${g}, ${b})`;
  };

  const rgbToHex = (rgb: string): string => {
    const values = rgb.match(/\d+/g);
    if (!values || values.length !== 3) return "#000000";
    const [r, g, b] = values.map(Number);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  };

  const rgbToHsl = (rgb: string): string => {
    const values = rgb.match(/\d+/g);
    if (!values || values.length !== 3) return "hsl(0, 0%, 0%)";
    let [r, g, b] = values.map(Number);
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(
      l * 100
    )}%)`;
  };

  const hslToRgb = (hsl: string): string => {
    const values = hsl.match(/\d+/g);
    if (!values || values.length !== 3) return "rgb(0, 0, 0)";
    let [h, s, l] = values.map(Number);
    h /= 360;
    s /= 100;
    l /= 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
      b * 255
    )})`;
  };

  const handleColorChange = (value: string, format: ColorFormat) => {
    try {
      let newColor = { ...color };
      switch (format) {
        case "hex":
          if (/^#[0-9A-F]{6}$/i.test(value)) {
            newColor = {
              hex: value,
              rgb: hexToRgb(value),
              hsl: rgbToHsl(hexToRgb(value)),
            };
          }
          break;
        case "rgb":
          if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(value)) {
            newColor = {
              hex: rgbToHex(value),
              rgb: value,
              hsl: rgbToHsl(value),
            };
          }
          break;
        case "hsl":
          if (
            /^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(value)
          ) {
            const rgb = hslToRgb(value);
            newColor = {
              hex: rgbToHex(rgb),
              rgb: rgb,
              hsl: value,
            };
          }
          break;
      }
      setColor(newColor);
    } catch (error) {
      console.error("Color conversion error:", error);
    }
  };

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    message.success("复制成功");
  };

  const updateAllFormats = (rgb: RGBColor) => {
    const hex = `#${((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1)}`;
    const rgbStr = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    setColor({
      hex,
      rgb: rgbStr,
      hsl: rgbToHsl(rgbStr),
    });
    setRgbValues(rgb);
  };

  const handleSliderChange = (value: number, component: keyof RGBColor) => {
    const newRgb = { ...rgbValues, [component]: value };
    updateAllFormats(newRgb);
  };

  const handleHSLChange = (value: number, component: keyof HSLColor) => {
    const newHsl = { ...hslValues, [component]: value };
    setHslValues(newHsl);
    const hslStr = `hsl(${newHsl.h}, ${newHsl.s}%, ${newHsl.l}%)`;
    const rgb = hslToRgb(hslStr);
    const rgbValues = rgb.match(/\d+/g)?.map(Number) || [0, 0, 0];
    updateAllFormats({ r: rgbValues[0], g: rgbValues[1], b: rgbValues[2] });
  };

  return (
    <div className="space-y-8 mobile-container">
      <div className="flex flex-col items-center sm:flex-row gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <div
              className="w-32 h-32 rounded-lg shadow-md cursor-pointer hover:ring-2 hover:ring-primary transition-all"
              style={{ backgroundColor: color.hex }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">RGB 值</label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">R</span>
                      <span className="text-sm text-muted-foreground">{rgbValues.r}</span>
                    </div>
                    <Slider
                      value={[rgbValues.r]}
                      max={255}
                      step={1}
                      onValueChange={([value]) => handleSliderChange(value, "r")}
                      className="[&_[role=slider]]:bg-red-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">G</span>
                      <span className="text-sm text-muted-foreground">{rgbValues.g}</span>
                    </div>
                    <Slider
                      value={[rgbValues.g]}
                      max={255}
                      step={1}
                      onValueChange={([value]) => handleSliderChange(value, "g")}
                      className="[&_[role=slider]]:bg-green-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">B</span>
                      <span className="text-sm text-muted-foreground">{rgbValues.b}</span>
                    </div>
                    <Slider
                      value={[rgbValues.b]}
                      max={255}
                      step={1}
                      onValueChange={([value]) => handleSliderChange(value, "b")}
                      className="[&_[role=slider]]:bg-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">HSL 值</label>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">H</span>
                      <span className="text-sm text-muted-foreground">{hslValues.h}°</span>
                    </div>
                    <Slider
                      value={[hslValues.h]}
                      max={360}
                      step={1}
                      onValueChange={([value]) => handleHSLChange(value, "h")}
                      className="[&_[role=slider]]:bg-gradient-to-r from-red-500 via-green-500 to-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">S</span>
                      <span className="text-sm text-muted-foreground">{hslValues.s}%</span>
                    </div>
                    <Slider
                      value={[hslValues.s]}
                      max={100}
                      step={1}
                      onValueChange={([value]) => handleHSLChange(value, "s")}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">L</span>
                      <span className="text-sm text-muted-foreground">{hslValues.l}%</span>
                    </div>
                    <Slider
                      value={[hslValues.l]}
                      max={100}
                      step={1}
                      onValueChange={([value]) => handleHSLChange(value, "l")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="space-y-4 w-full flex-1">
          {Object.entries(color).map(([format, value]) => (
            <div key={format} className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="w-20 shrink-0 uppercase touch-feedback"
                onClick={() => setCurrentFormat(format as ColorFormat)}
              >
                {format}
              </Button>
              <Input
                value={value}
                onChange={(e) =>
                  handleColorChange(e.target.value, format as ColorFormat)
                }
                className={cn(
                  "font-mono text-base",
                  currentFormat === format
                    ? "ring-2 ring-primary"
                    : "bg-muted"
                )}
                readOnly={currentFormat !== format}
              />
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 touch-feedback"
                onClick={() => handleCopy(value)}
              >
                复制
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="text-sm text-muted-foreground space-y-2">
        <p>支持的格式：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>HEX: #RRGGBB（例如：#FF0000）</li>
          <li>RGB: rgb(R, G, B)（例如：rgb(255, 0, 0)）</li>
          <li>HSL: hsl(H, S%, L%)（例如：hsl(0, 100%, 50%)）</li>
        </ul>
      </div>
    </div>
  );
}
