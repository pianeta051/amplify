import useSWRMutation from "swr/mutation";
import { Job, JobFilters, createJob, editJob } from "../../services/jobs";
import { JobFormValues } from "../../components/JobForm/JobForm";
import { extractErrorCode } from "../../services/error";
import { useSWRConfig } from "swr";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "./useJobs";
import { uploadFile } from "../../services/files";

export const useCreateJob = () => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    Job,
    Error,
    readonly [string],
    { formValues: JobFormValues; image: File | null }
  >(
    ["add-job"],
    async ([_operation], { arg: { formValues, image } }) => {
      // Create the job
      const job = await createJob(formValues);
      // Upload the image
      let imageUrl: string | undefined;
      if (image) {
        imageUrl = await uploadFile(image, `job-${job.id}/job-image.jpg`);
      }
      // Update the job to set the image
      await editJob(job.id, { ...formValues, imageUrl });

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
