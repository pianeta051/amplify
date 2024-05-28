import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { Job, deleteJob } from "../../services/jobs";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "./useJobs";

export const useDeleteJob = (jobId: string) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    void,
    Error,
    readonly [string, string] | null,
    never,
    Job | null
  >(
    jobId ? ["job", jobId] : null,
    async ([_operation, jobId]) => {
      await deleteJob(jobId);
      await mutate<
        readonly [string, string | undefined, string | undefined],
        {
          jobs: Job[];
          nextToken?: string;
        }
      >(unstable_serialize(keyFunctionGenerator({})), undefined, {
        revalidate: false,
        populateCache: true,
      });
    },
    {
      revalidate: false,
      populateCache: () => null,
    }
  );

  return {
    deleteJob: trigger,
    loading: isMutating,
    error,
  };
};
