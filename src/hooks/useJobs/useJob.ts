import useSWR from "swr";
import { Job, getJob } from "../../services/jobs";
import { extractErrorCode } from "../../services/error";

export const useJob = (jobId?: string) => {
  const {
    data: job,
    error,
    isLoading: loading,
  } = useSWR<Job, Error, readonly [string, string] | null>(
    jobId ? ["job", jobId] : null,
    async ([_operation, jobId]) => getJob(jobId)
  );

  return {
    job,
    error: extractErrorCode(error),
    loading,
  };
};
