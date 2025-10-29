import { LoadingButton } from "@mui/lab";
import { FC, useState } from "react";
import { getFileUrl } from "../../services/files";
import DownloadIcon from "@mui/icons-material/Download";

type S3DownloadButtonProps = {
  s3Key: string;
  label?: string;
  onDownloadError?: (errorMessage: string) => void;
};

export const S3DownloadButton: FC<S3DownloadButtonProps> = ({
  s3Key,
  label = "Download",
  onDownloadError,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const clickHandler = () => {
    setIsLoading(true);
    getFileUrl(s3Key)
      .then((url) => {
        // open url in a new tab
        const link = document.createElement("a");
        link.href = url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.download = s3Key; // Set the download attribute to suggest a filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsLoading(false);
      })
      .catch((error) => {
        onDownloadError?.(
          error instanceof Error ? error.message : "Error downloading file"
        );
        setIsLoading(false);
      });
  };
  return (
    <LoadingButton
      variant="contained"
      loading={isLoading}
      onClick={clickHandler}
      startIcon={<DownloadIcon />}
    >
      {label}
    </LoadingButton>
  );
};
