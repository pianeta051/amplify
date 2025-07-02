import { Job } from "aws-sdk/clients/codepipeline";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { JobFormValues } from "../../components/JobForm/JobForm";
import { EditJobParameters, JobFilters, editJob } from "../../services/jobs";
import { unstable_serialize } from "swr/infinite";
import { keyFunctionGenerator } from "./useJobs";
import { extractErrorCode } from "../../services/error";
import { deleteFile, uploadFile } from "../../services/files";

export const useEditJob = (jobId: string) => {
  const { mutate } = useSWRConfig();
  const { trigger, isMutating, error } = useSWRMutation<
    Job,
    Error,
    readonly [string, string] | null,
    { formValues: JobFormValues; image: File | null; deleteImage: boolean }
  >(
    jobId ? ["job", jobId] : null,
    async (
      [_operation, jobId],
      { arg: { formValues, image, deleteImage } }
    ) => {
      const editParams: EditJobParameters = { ...formValues };
      const imageKey = `jobs/${jobId}/job-image.jpg`;
      if (image) {
        await uploadFile(image, imageKey);
        editParams.imageKey = imageKey;
      } else if (deleteImage) {
        await deleteFile(imageKey);
        editParams.imageKey = undefined;
      }
      const job = editJob(jobId, editParams);
      await mutate<
        readonly [string, JobFilters, string | undefined],
        {
          items: Job[];
          nextToken?: string;
        } | null
      >(
        // Temporary solution: https://github.com/vercel/swr/issues/1156
        unstable_serialize(keyFunctionGenerator({})),
        () => undefined,
        {
          revalidate: true,
          populateCache: false,
        }
      );
      return job;
    },
    {
      revalidate: false,
      populateCache: true,
    }
  );

  return {
    editJob: trigger,
    loading: isMutating,
    error: extractErrorCode(error),
  };
};
