"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { FC, ReactElement, Suspense } from "react";

import { IViewerWrapper } from "@/src/components/templates/viewer-wrapper";
const ViewerWrapper = dynamic<IViewerWrapper>(async () => (await import("@/src/components/templates/viewer-wrapper")).default, { ssr: false });

const ReportContent: FC = (): ReactElement => {
  const searchParams = useSearchParams();
  const cmdParam = searchParams.get("cmd");
  const hiddenPrintParam = searchParams.get("hiddenPrint");

  // const params = Array.from({ length: 4 }, (_, i) => {
  //   const paramValue = searchParams.get(`param${i + 1}`);
  //   return paramValue ? { Name: `param${i + 1}`, Value: [paramValue] } : null;
  // }).filter(Boolean);

  const parameter = {
    ReportParams: [
      cmdParam ? { Name: "cmd", Value: [cmdParam] } : null,
      // ...params,
    ].filter(Boolean),
  };

  const hiddenPrint = hiddenPrintParam === "false" ? false : true;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ViewerWrapper hiddenPrint={hiddenPrint} reportParam={parameter} reportUri="/assets/report/surat-perintah-muat/form_spm.rdlx-json" />
    </div>
  );
};

const ReportPage: FC = (): ReactElement => (
  <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
    <ReportContent />
  </Suspense>
);

export default ReportPage;
