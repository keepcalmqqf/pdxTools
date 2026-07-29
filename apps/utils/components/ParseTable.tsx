import React from "react";
import { FixedSizeList as List } from "react-window";
import { Button } from "./ui/button";

type ParseTableProps = {
  source: "BD09" | "GCJ02";
  parseLngLatList: number[][];
};
export default function ParseTable(props: ParseTableProps) {
  const { source, parseLngLatList } = props;

  const handleDownload = () => {
    const text = `百度经度,百度纬度,高德经度,高德纬度\n${parseLngLatList
      .join("\n")
      .replaceAll(/\[|\]/gi, "")}`;

    const blob = new Blob([text], { type: "text/csv;charset=utf-8" });

    const url = window.URL.createObjectURL(blob);
    let downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `${Date.now()}.csv`; // 导出的文件名
    downloadLink.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full">
      <Button className="btn btn-primary h-8 min-h-8" onClick={handleDownload}>
        下载
      </Button>
      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          {source === "BD09" ? (
            <div className="h-[50px] flex justify-start items-center text-sm">
              <div className="w-[25%]">百度经度</div>
              <div className="w-[25%]">百度纬度</div>
              <div className="w-[25%]">高德经度</div>
              <div className="w-[25%]">高德纬度</div>
            </div>
          ) : (
            <div className="h-[50px] flex justify-start items-center text-sm">
              <div className="w-[25%]">高德经度</div>
              <div className="w-[25%]">高德纬度</div>
              <div className="w-[25%]">百度经度</div>
              <div className="w-[25%]">百度纬度</div>
            </div>
          )}
          <List
            itemCount={parseLngLatList.length}
            itemSize={50}
            height={500}
            width={"100%"}
          >
            {({ index, style }: { index: any; style: any }) => (
              <div style={style} className="flex justify-start items-center text-sm">
                <div className="w-[25%] break-all">{parseLngLatList[index][0]}</div>
                <div className="w-[25%] break-all">{parseLngLatList[index][1]}</div>
                <div className="w-[25%] break-all">{parseLngLatList[index][2]}</div>
                <div className="w-[25%] break-all">{parseLngLatList[index][3]}</div>
              </div>
            )}
          </List>
        </div>
      </div>
    </div>
  );
}
