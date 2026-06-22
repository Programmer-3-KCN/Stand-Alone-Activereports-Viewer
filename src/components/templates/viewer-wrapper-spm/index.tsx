import { Core } from "@grapecity/activereports";
import { Viewer, Props as ViewerProps } from "@grapecity/activereports-react";
import { FC, ReactElement, useCallback, useEffect, useRef, useState } from "react";

import { ICMD } from "@/src/app/report/surat-perintah-muat/form-spm/page";
import { GETIsCetakDokumen, PATCHUpdateCetakPrinter } from "@/src/utils";

Core.setLicenseKey(
  "BOARD4ALL,wifier,B4C850C346AF477#B0iiWu3Waz9WZ4hXRgAicldXZpZFdy3GclJFIv5mapdlI0IiTisHL3JyS7gDSiojIDJCLi86bpNnblRHeFBCI73mUpRHb55EIv5mapdlI0IiTisHL3JCNGZDRiojIDJCLi86bpNnblRHeFBCIQFETPBCIv5mapdlI0IiTisHL3JyMDBjQiojIDJCLiUmcvNEIv5mapdlI0IiTisHL3JSV8cTQiojIDJCLi86bpNnblRHeFBCI4JXYoNEbhl6YuFmbpZEIv5mapdlI0IiTisHL3JSSGljQiojIDJCLiITMuYHITpEIkFWZyB7UiojIOJyes4nIZRVV9IiOiMkIsISM6ByUKN7dllmVhRXYEJiOi8kI1xSfi24QRpkI0IyQiwiIzYFITpEdy3GclJVZ6lGdjFkI0IiTisHL3JCTBF5UiojIDJCLiUTMuYHITpEIkFWZyB7UiojIOJyebpjIkJHUiwSZzxWYmpjIsZXRiwSflVnc4pjIyNHZisnOiwmbBJCLiEDMwAjMxASMwEDMyIDMyIiOiQncDJCLioXai9CbsFGNkJXYvJGQyVWaml6diojIh94QiwiI7cDNGFkN4MzQwUDODRjQiojIklkI1pjIEJye&QfiADNyQUM6cjMiojIIJCLi4TPnZUOQ3kMqFmeJ9WbYVkb7BVTtZEM6wWY5QjWxITZzNnTGtiVUp5arlje4IlMo3kcBhnVCdXVQJ5MjtmSClENXlXVjZVeQdFOJBjWHFUUyUVYu5kNwMTaxNHUplnbjNlctljN6t6coF6bEp6U8A5YJtSa62WRSR4SJRGem9UUvQ6TYJjVCRXbWdEbHxERphlSDpkQGZGZkNnNMhmUycjc6VHMTFGOItWV4kmMOpXWspXNYlzZzMFNxt4b5clVpFXdUJmdFV6MmhkQz3kQBlEZ6UjZHJ7RZF6QGhVYkNVW9E7QPB7MroHVk5WQ0BFbzN5ZYJVUGZjePllS8EWSwQ5VFp7SxRzKvtydEZFRyhEbyJTdhp7U43Sb63ST0pFTaFnNsdWQ5Q5QEZDN4BHZ0RGeyB7bS56YoFEcwQzNKJGb5AVcLp7dj3UdO3Sbz5mNPx6S5hzMvZkWiojITJCL35VfiIVV84kI0IyQiwiIvJHcgMjVgIXZ7VWaWZGZQN6RiojIOJyes4nIJBjMSJiOiMkIsIibvl6cuVGd8VEIgQXZlh6U8VGbGBybtpWaXJiOi8kI1xSfiUTSOFlI0qyii",
);

export interface IViewerWrapperSPM extends ViewerProps {
  decoded: ICMD | null;
  reportParam: object;
  reportUri: string;
  visiblePrint: boolean;
}

const ViewerWrapperSPM: FC<IViewerWrapperSPM> = ({ decoded, reportParam, reportUri, visiblePrint, ...props }): ReactElement => {
  // eslint-disable-next-line
  const ref = useRef<any>(null);
  const [isPrint, setIsPrint] = useState(false);
  const [hasPrinted, setHasPrinted] = useState(false);
  const isPrintingRef = useRef(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.Viewer.open(reportUri, reportParam);
    // eslint-disable-next-line
  }, []);

  const cetakApi = useCallback(async () => {
    try {
      await PATCHUpdateCetakPrinter({ entitas: decoded?.entitas, param1: decoded?.param1, param2: "T", param3: "1" }, decoded?.token);
    } catch (error) {
      alert("Gagal edit cetak api " + error);
      throw error;
    }
  }, [decoded]);

  const handlePrint = useCallback(
    async (e: Event) => {
      e.stopImmediatePropagation();
      e.preventDefault();

      if (isPrintingRef.current) {
        return;
      }

      const ok = confirm("Apakah anda yakin ingin mencetak dokumen?");
      if (!ok) {
        return;
      }

      const isAdmin = decoded?.userId?.toUpperCase() === "ADMINISTRATOR";

      isPrintingRef.current = true;
      setHasPrinted(true);

      const printBtn = document.querySelector("#main_toolbar_Item_16") as HTMLElement | null;
      let originalContent = "";
      if (printBtn) {
        originalContent = printBtn.innerHTML;
        if (!document.getElementById("__print-spinner-style__")) {
          const style = document.createElement("style");
          style.id = "__print-spinner-style__";
          style.textContent = "@keyframes __pspn__{to{transform:rotate(360deg)}}";
          document.head.appendChild(style);
        }
        printBtn.innerHTML = `<span style="display:inline-block;margin-top:8px;width:22px;height:22px;border:2px solid rgba(0,0,0,0.2);border-top-color:#333;border-radius:50%;animation:__pspn__ 0.7s linear infinite;vertical-align:middle;"></span>`;
        printBtn.style.pointerEvents = "none";
        printBtn.style.opacity = "0.6";
      }

      try {
        await cetakApi();

        const message = { action: "refreshData" };

        if (window.parent !== window) {
          window.parent.postMessage(message, "*");
        }

        if (window.opener) {
          window.opener.postMessage(message, "*");
        }
      } catch (_error) {
        // error already handled in cetakApi
      } finally {
        isPrintingRef.current = false;
        if (printBtn) {
          printBtn.innerHTML = originalContent;
          printBtn.style.pointerEvents = "";
          printBtn.style.opacity = "";
        }
        if (!isAdmin) {
          setIsPrint(false);
        }
      }

      ref.current?.Viewer.print();
    },
    [cetakApi, decoded, ref],
  );

  const handlePrintRef = useRef(handlePrint);
  useEffect(() => {
    handlePrintRef.current = handlePrint;
  }, [handlePrint]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) {
      return;
    }

    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.closest("#main_toolbar_Item_16")) {
        handlePrintRef.current(e);
      }
    };

    host.addEventListener("click", handler, true);
    return () => host.removeEventListener("click", handler, true);
  }, []);

  useEffect(() => {
    const asyncExecute = async () => {
      const res = await GETIsCetakDokumen({ entitas: decoded?.entitas, param1: decoded?.param1, param2: "T" }, decoded?.token);
      // console.log("res", res);
      if (res.length === 0 || decoded?.userId.toUpperCase() === "ADMINISTRATOR") {
        setIsPrint(true);
      }
    };
    asyncExecute();
    // eslint-disable-next-line
  }, []);

  const shouldHidePrint = !isPrint && hasPrinted;

  return (
    <div id="viewer-host" ref={hostRef}>
      {!visiblePrint && (
        <style>
          {`
         #main_toolbar_Item_16 {
            ${isPrint && !shouldHidePrint ? "" : "display: none !important;"}
          }
          `}
        </style>
      )}
      <Viewer {...props} ref={ref} />
    </div>
  );
};

export default ViewerWrapperSPM;
