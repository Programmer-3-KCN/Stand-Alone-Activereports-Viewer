import { Core, PdfExport } from "@grapecity/activereports";
import { Viewer, Props as ViewerProps } from "@grapecity/activereports-react";
import { createRef, FC, ReactElement, useCallback, useEffect, useState } from "react";

import { ICMD } from "@/src/app/report/surat-perintah-muat/form-spm/page";
import { GETIsCetakDokumen, PATCHUpdateCetakPrinter } from "@/src/helpers";

Core.setLicenseKey(
  "BOARD4ALL,wifier,B4C850C346AF477#B0iiWu3Waz9WZ4hXRgAicldXZpZFdy3GclJFIv5mapdlI0IiTisHL3JyS7gDSiojIDJCLi86bpNnblRHeFBCI73mUpRHb55EIv5mapdlI0IiTisHL3JCNGZDRiojIDJCLi86bpNnblRHeFBCIQFETPBCIv5mapdlI0IiTisHL3JyMDBjQiojIDJCLiUmcvNEIv5mapdlI0IiTisHL3JSV8cTQiojIDJCLi86bpNnblRHeFBCI4JXYoNEbhl6YuFmbpZEIv5mapdlI0IiTisHL3JSSGljQiojIDJCLiITMuYHITpEIkFWZyB7UiojIOJyes4nIZRVV9IiOiMkIsISM6ByUKN7dllmVhRXYEJiOi8kI1xSfi24QRpkI0IyQiwiIzYFITpEdy3GclJVZ6lGdjFkI0IiTisHL3JCTBF5UiojIDJCLiUTMuYHITpEIkFWZyB7UiojIOJyebpjIkJHUiwSZzxWYmpjIsZXRiwSflVnc4pjIyNHZisnOiwmbBJCLiEDMwAjMxASMwEDMyIDMyIiOiQncDJCLioXai9CbsFGNkJXYvJGQyVWaml6diojIh94QiwiI7cDNGFkN4MzQwUDODRjQiojIklkI1pjIEJye&QfiADNyQUM6cjMiojIIJCLi4TPnZUOQ3kMqFmeJ9WbYVkb7BVTtZEM6wWY5QjWxITZzNnTGtiVUp5arlje4IlMo3kcBhnVCdXVQJ5MjtmSClENXlXVjZVeQdFOJBjWHFUUyUVYu5kNwMTaxNHUplnbjNlctljN6t6coF6bEp6U8A5YJtSa62WRSR4SJRGem9UUvQ6TYJjVCRXbWdEbHxERphlSDpkQGZGZkNnNMhmUycjc6VHMTFGOItWV4kmMOpXWspXNYlzZzMFNxt4b5clVpFXdUJmdFV6MmhkQz3kQBlEZ6UjZHJ7RZF6QGhVYkNVW9E7QPB7MroHVk5WQ0BFbzN5ZYJVUGZjePllS8EWSwQ5VFp7SxRzKvtydEZFRyhEbyJTdhp7U43Sb63ST0pFTaFnNsdWQ5Q5QEZDN4BHZ0RGeyB7bS56YoFEcwQzNKJGb5AVcLp7dj3UdO3Sbz5mNPx6S5hzMvZkWiojITJCL35VfiIVV84kI0IyQiwiIvJHcgMjVgIXZ7VWaWZGZQN6RiojIOJyes4nIJBjMSJiOiMkIsIibvl6cuVGd8VEIgQXZlh6U8VGbGBybtpWaXJiOi8kI1xSfiUTSOFlI0qyii",
);

// eslint-disable-next-line
const pdf = PdfExport;

export interface IViewerWrapperSPM extends ViewerProps {
  decoded: ICMD | null;
  reportParam: object;
  reportUri: string;
  visiblePrint: boolean;
}

const ViewerWrapperSPM: FC<IViewerWrapperSPM> = ({ decoded, reportParam, reportUri, visiblePrint, ...props }): ReactElement => {
  // eslint-disable-next-line
  const ref = createRef<any>();
  const [isPrint, setIsPrint] = useState(false);

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

  useEffect(() => {
    let attached = false;

    const interval = setInterval(() => {
      const printBtn = document.querySelector("#main_toolbar_Item_16");
      if (printBtn && !attached) {
        attached = true;

        printBtn.addEventListener(
          "click",
          async (e) => {
            const ok = confirm("Apakah anda yakin ingin mencetak dokumen?");

            if (ok) {
              if (decoded?.userId.toUpperCase() !== "ADMINISTRATOR") {
                setIsPrint(false);
              }

              await cetakApi();

              const message = { action: "refreshData" };

              if (window.parent !== window) {
                window.parent.postMessage(message, "*");
              }

              if (window.opener) {
                window.opener.postMessage(message, "*");
              }
            } else {
              e.stopImmediatePropagation();
              e.preventDefault();
            }
          },
          true,
        );

        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
    // eslint-disable-next-line
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

  if (visiblePrint) {
    return <Viewer {...props} ref={ref} />;
  } else {
    return (
      <>
        <style>
          {`
         #main_toolbar_Item_16 {
            ${isPrint ? "" : "display: none !important;"}
          }
          `}
        </style>
        <Viewer {...props} ref={ref} />
      </>
    );
  }
};

export default ViewerWrapperSPM;
