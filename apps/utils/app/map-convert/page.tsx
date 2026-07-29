"use client";

import { useRef, useState } from "react";

import { getCoordinate } from "@/lib/index";
import ParseTable from "@/components/ParseTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { message } from "react-message-popup";

export default function Home() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [parseLngLatList, setParseLngLatList] = useState<number[][]>([]);
  const [source, setSource] = useState<"BD09" | "GCJ02">("BD09");
  const targetRef = useRef<"BD09" | "GCJ02">("GCJ02");

  const handleConversion = () => {
    const value = textareaRef.current!.value;
    if (!value) {
      message.error("请输入需要转换的经纬度");
      return;
    }
    if (value.indexOf("，") !== -1) {
      message.error("经纬度格式错误，经纬度之间请用英文逗号隔开");
      return;
    }
    const lngLatList = value.split("\n");

    const result = getCoordinate(source, targetRef.current, lngLatList);

    setParseLngLatList(result);
  };

  const handleChangeTab = (value: string) => {
    const dataType = value?.split(",");
    setSource(dataType?.[0] as "BD09" | "GCJ02");
    targetRef.current = dataType?.[1] as "BD09" | "GCJ02";
    setParseLngLatList([]);
  };

  return (
    <main className="flex flex-col items-center justify-between w-[90%] sm:w-[80%] lg:w-[40%] m-auto py-4 sm:py-6 mobile-container">
      <Tabs
        defaultValue="BD09,GCJ02"
        className="w-full max-w-[400px]"
        onValueChange={handleChangeTab}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="BD09,GCJ02">百度转高德</TabsTrigger>
          <TabsTrigger value="GCJ02,BD09">高德转百度</TabsTrigger>
        </TabsList>
      </Tabs>

      <Textarea
        ref={textareaRef}
        className="my-5 text-base"
        rows={6}
        placeholder="每个地址的经纬度占一行，格式：经度,纬度
        例如：38.76623,116.43213"
      ></Textarea>

      <Button onClick={handleConversion}>
        转换
      </Button>

      {parseLngLatList.length > 0 && (
        <div className="w-full overflow-x-auto">
          <ParseTable source={source} parseLngLatList={parseLngLatList} />
        </div>
      )}
    </main>
  );
}
