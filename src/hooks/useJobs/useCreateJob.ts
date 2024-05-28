import useSWRMutation from "swr/mutation";
import { Job, JobFilters, createJob } from "../../services/jobs";
import { JobFormValues } from "../../components/JobForm/JobForm";
import { extractErrorCode } from "../../services/error";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "./useJobs";

export const useCreateJob = () => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    Job,
    Error,
    readonly [string],
    JobFormValues
  >(
    ["add-job"],
    async ([_operation], { arg: formValues }) => {
      const job = await createJob(formValues);
      // Refresh all caches for job lists
      await mutate<
        readonly [string, JobFilters, string | undefined],
        { jobs: Job[]; nextToken?: string } | null
      >(unstable_serialize(keyFunctionGenerator({})), () => undefined, {
        revalidate: true,
        populateCache: false,
      });
      // Update cache for single job now that we know the id
      await mutate<readonly [string, string], Job>(["job", job.id], () => job, {
        revalidate: false,
        populateCache: true,
      });

      return job;
    },
    {
      revalidate: false,
      populateCache: false,
    }
  );

  return {
    createJob: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
