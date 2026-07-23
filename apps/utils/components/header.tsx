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
  ];

  const handleNavClick = (path: string) => {
    router.push(path);
    setIsMenuOpen(false); // 移动端点击后关闭菜单
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="p-4 shadow-lg bg-background -mx-5 mb-10 text-sm border-b relative">
      <div className="flex justify-between items-center">
        {/* 桌面端导航 */}
        <ul className="hidden md:flex space-x-6">
          {TAB_LIST.map((item) => (
            <li
              key={item.name}
              className={`cursor-pointer transition duration-300 ${
                pathname === item.path && "text-yellow-300"
              } ${"text-foreground hover:text-yellow-600"}`}
              onClick={() => router.push(item.path)}
            >
              {item.name}
            </li>
          ))}
        </ul>

        {/* 移动端汉堡菜单按钮 */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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

      {/* 移动端下拉菜单 */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-background border-b shadow-lg transition-all duration-300 ${
          isMenuOpen
            ? "opacity-100 visible max-h-96"
            : "opacity-0 invisible max-h-0"
        }`}
      >
        <ul className="p-4 space-y-3">
          {TAB_LIST.map((item) => (
            <li
              key={item.name}
              className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                pathname === item.path
                  ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300"
                  : "text-foreground hover:bg-gray-100 dark:hover:bg-gray-800"
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
