"use client";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";

const Header: React.FC<any> = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const TAB_LIST = [
    { name: "逗号分隔链接字符串", path: "/" },
    { name: "eBay图片链接转换", path: "/ebay-image-converter" },
    { name: "批量修改文件后缀名", path: "/file-extension-changer" },
    { name: "地图经纬度转换", path: "/map-convert" },
    { name: "图片预览", path: "/image-preview" },
    { name: "URL Decode&Encode", path: "/url-decode-encode" },
    { name: "颜色值转换", path: "/color-convert" },
    { name: "正则表达式提取文本", path: "/regex-extract-text" },
    { name: "斐波那契回撤", path: "/fibonacci-retracement" },
    { name: "认证标签生成器", path: "/cert-label-generator" },
  ];

  const handleNavClick = (path: string) => {
    router.push(path);
    setIsMenuOpen(false); // 移动端点击后关闭菜单
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 p-4 -mx-5 mb-10 text-sm border-b bg-background/80 backdrop-blur-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          {/* 品牌标识 */}
          <span
            className="font-bold text-base bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent cursor-pointer select-none"
            onClick={() => handleNavClick("/")}
          >
            pdxUtils
          </span>

          {/* 桌面端导航 */}
          <ul className="hidden lg:flex space-x-5">
            {TAB_LIST.map((item) => (
              <li
                key={item.name}
                className={`cursor-pointer transition duration-300 ${
                  pathname === item.path
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => router.push(item.path)}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          {/* 移动端汉堡菜单按钮 */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
            onClick={toggleMenu}
            aria-label="切换菜单"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`block w-5 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-1" : ""
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`block w-5 h-0.5 bg-current transition-all duration-300 mt-1 ${
                  isMenuOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
              ></span>
            </div>
          </button>

          <ThemeToggle />
        </div>
      </div>

      {/* 移动端下拉菜单 */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 z-50 bg-background border-b shadow-lg transition-all duration-300 ${
          isMenuOpen
            ? "opacity-100 visible max-h-[70vh] overflow-y-auto"
            : "opacity-0 invisible max-h-0 overflow-hidden"
        }`}
      >
        <ul className="p-4 space-y-3">
          {TAB_LIST.map((item) => (
            <li
              key={item.name}
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                pathname === item.path
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => handleNavClick(item.path)}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
