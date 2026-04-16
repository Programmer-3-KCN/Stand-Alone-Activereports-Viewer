"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { FC, ReactElement, Suspense } from "react";

import { IViewerWrapperSPM } from "@/src/components/templates/viewer-wrapper-spm";
const ViewerWrapperSPM = dynamic<IViewerWrapperSPM>(async () => (await import("@/src/components/templates/viewer-wrapper-spm")).default, {
  ssr: false,
});

export interface ICMD {
  entitas: string;
  param1: string;
  token: string;
  userId: string;
}

const ReportContent: FC = (): ReactElement => {
  const searchParams = useSearchParams();
  const cmdParam = searchParams.get("cmd");
  const hiddenPrintParam = searchParams.get("hiddenPrint");

  // const params = Array.from({ length: 4 }, (_, i) => {
  //   const paramValue = searchParams.get(`param${i + 1}`);
  //   return paramValue ? { Name: `param${i + 1}`, Value: [paramValue] } : null;
  // }).filter(Boolean);

  let decodedCmdObject: ICMD | null = null;

  if (cmdParam) {
    try {
      decodedCmdObject = JSON.parse(atob(cmdParam));
    } catch (error) {
      console.error("Failed To Decode:", error);
    }
  }

  console.log("Decoded:", decodedCmdObject);

  const parameter = {
    ReportParams: [
      cmdParam ? { Name: "cmd", Value: [cmdParam] } : null,
      // ...params,
    ].filter(Boolean),
  };

  const hiddenPrint = hiddenPrintParam === "false" ? false : true;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ViewerWrapperSPM
        decoded={decodedCmdObject}
        hiddenPrint={hiddenPrint}
        reportParam={parameter}
        reportUri="/assets/report/surat-perintah-muat/form_spm.rdlx-json"
      />
    </div>
  );
};

const ReportPage: FC = (): ReactElement => (
  <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
    <ReportContent />
  </Suspense>
);

export default ReportPage;
