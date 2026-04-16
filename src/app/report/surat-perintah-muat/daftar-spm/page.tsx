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
  const paramLimit = searchParams.get("paramLimit");
  const visiblePrintParam = searchParams.get("visiblePrint");

  const params = Array.from({ length: 16 }, (_, i) => {
    const paramValue = searchParams.get(`param${i + 1}`);
    return paramValue ? { Name: `param${i + 1}`, Value: [paramValue] } : null;
  }).filter(Boolean);

  const parameter = {
    ReportParams: [
      entitasParam ? { Name: "entitas", Value: [entitasParam] } : null,
      tokenParam ? { Name: "token", Value: [tokenParam] } : null,
      paramLimit ? { Name: "paramLimit", Value: [paramLimit] } : null,
      ...params,
    ].filter(Boolean),
  };

  const visiblePrint = visiblePrintParam === "false" ? false : true;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ViewerWrapper visiblePrint={visiblePrint} reportParam={parameter} reportUri="/assets/report/surat-perintah-muat/daftar_spm.rdlx-json" />
    </div>
  );
};

const ReportPage: FC = (): ReactElement => (
  <Suspense fallback={<div className="flex h-screen w-full items-center justify-center">Loading...</div>}>
    <ReportContent />
  </Suspense>
);

export default ReportPage;
