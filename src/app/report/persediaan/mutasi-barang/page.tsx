"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { FC, ReactElement, Suspense } from "react";

import { IViewerWrapper } from "@/src/components/templates/viewer-wrapper";
const ViewerWrapper = dynamic<IViewerWrapper>(async () => (await import("@/src/components/templates/viewer-wrapper")).default, { ssr: false });

const ReportContent: FC = (): ReactElement => {
  const searchParams = useSearchParams();
  const entitasParam = searchParams.get("entitas");
  const tokenParam = searchParams.get("token");
  const hiddenPrintParam = searchParams.get("hiddenPrint");

  const params = Array.from({ length: 16 }, (_, i) => {
    const paramValue = searchParams.get(`param${i + 1}`);
    return paramValue ? { Name: `param${i + 1}`, Value: [paramValue] } : null;
  }).filter(Boolean);

  const parameter = {
    ReportParams: [
      entitasParam ? { Name: "entitas", Value: [entitasParam] } : null,
      tokenParam ? { Name: "token", Value: [tokenParam] } : null,
      ...params,
    ].filter(Boolean),
  };

  const hiddenPrint = hiddenPrintParam === "false" ? false : true;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ViewerWrapper hiddenPrint={hiddenPrint} reportParam={parameter} reportUri="/assets/report/persediaan/mutasi_barang.rdlx-json" />
    </div>
  );
};

const ReportPage: FC = (): ReactElement => (
  <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
    <ReportContent />
  </Suspense>
);

export default ReportPage;
