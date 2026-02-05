import { Core, PdfExport } from "@grapecity/activereports";
import { Viewer, Props as ViewerProps } from "@grapecity/activereports-react";
import "@grapecity/activereports/styles/light-blue-ui.css";
import "@grapecity/activereports/styles/light-blue-viewer.css";
import { createRef, FC, ReactElement, useEffect } from "react";

Core.setLicenseKey(
  "BOARD4ALL,wifier,B4C850C346AF477#B0iiWu3Waz9WZ4hXRgAicldXZpZFdy3GclJFIv5mapdlI0IiTisHL3JyS7gDSiojIDJCLi86bpNnblRHeFBCI73mUpRHb55EIv5mapdlI0IiTisHL3JCNGZDRiojIDJCLi86bpNnblRHeFBCIQFETPBCIv5mapdlI0IiTisHL3JyMDBjQiojIDJCLiUmcvNEIv5mapdlI0IiTisHL3JSV8cTQiojIDJCLi86bpNnblRHeFBCI4JXYoNEbhl6YuFmbpZEIv5mapdlI0IiTisHL3JSSGljQiojIDJCLiITMuYHITpEIkFWZyB7UiojIOJyes4nIZRVV9IiOiMkIsISM6ByUKN7dllmVhRXYEJiOi8kI1xSfi24QRpkI0IyQiwiIzYFITpEdy3GclJVZ6lGdjFkI0IiTisHL3JCTBF5UiojIDJCLiUTMuYHITpEIkFWZyB7UiojIOJyebpjIkJHUiwSZzxWYmpjIsZXRiwSflVnc4pjIyNHZisnOiwmbBJCLiEDMwAjMxASMwEDMyIDMyIiOiQncDJCLioXai9CbsFGNkJXYvJGQyVWaml6diojIh94QiwiI7cDNGFkN4MzQwUDODRjQiojIklkI1pjIEJye&QfiADNyQUM6cjMiojIIJCLi4TPnZUOQ3kMqFmeJ9WbYVkb7BVTtZEM6wWY5QjWxITZzNnTGtiVUp5arlje4IlMo3kcBhnVCdXVQJ5MjtmSClENXlXVjZVeQdFOJBjWHFUUyUVYu5kNwMTaxNHUplnbjNlctljN6t6coF6bEp6U8A5YJtSa62WRSR4SJRGem9UUvQ6TYJjVCRXbWdEbHxERphlSDpkQGZGZkNnNMhmUycjc6VHMTFGOItWV4kmMOpXWspXNYlzZzMFNxt4b5clVpFXdUJmdFV6MmhkQz3kQBlEZ6UjZHJ7RZF6QGhVYkNVW9E7QPB7MroHVk5WQ0BFbzN5ZYJVUGZjePllS8EWSwQ5VFp7SxRzKvtydEZFRyhEbyJTdhp7U43Sb63ST0pFTaFnNsdWQ5Q5QEZDN4BHZ0RGeyB7bS56YoFEcwQzNKJGb5AVcLp7dj3UdO3Sbz5mNPx6S5hzMvZkWiojITJCL35VfiIVV84kI0IyQiwiIvJHcgMjVgIXZ7VWaWZGZQN6RiojIOJyes4nIJBjMSJiOiMkIsIibvl6cuVGd8VEIgQXZlh6U8VGbGBybtpWaXJiOi8kI1xSfiUTSOFlI0qyii",
);

// eslint-disable-next-line
const pdf = PdfExport;

export interface IViewerWrapper extends ViewerProps {
  hiddenPrint: boolean;
  reportParam: object;
  reportUri: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const ViewerWrapper: FC<IViewerWrapper> = ({ hiddenPrint, reportParam, reportUri, ...props }): ReactElement => {
  const ref = createRef<any>();
  /* eslint-enable @typescript-eslint/no-explicit-any */

  useEffect(() => {
    ref.current?.Viewer.open(reportUri, reportParam);
    // eslint-disable-next-line
  }, []);

  if (!hiddenPrint) {
    return (
      <>
        <style>
          {`
          #main_toolbar_Item_16 {
              display: none !important;
          }
          `}
        </style>
        <Viewer {...props} ref={ref} />
      </>
    );
  } else {
    return <Viewer {...props} ref={ref} />;
  }
};

export default ViewerWrapper;
