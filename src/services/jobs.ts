import { JobFormValues } from "../components/JobForm/JobForm";
import { del, get, post, put } from "./api";

export type Job = {
  id: string;
  name: string;
};

const isJob = (value: unknown): value is Job => {
  if (!value || typeof value !== "object") return false;
  const job = value as Job;
  if (
    !job.id ||
    typeof job.id !== "string" ||
    !job.name ||
    typeof job.name !== "string"
  )
    return false;
  return true;
};

export type JobFilters = {
  addressId?: string;
};

export const createJob = async (formValues: JobFormValues): Promise<Job> => {
  try {
    const response = await post("/jobs", formValues);
    if (!isJob(response.job)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.job;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const editJob = async (
  jobId: string,
  formValues: JobFormValues
): Promise<Job> => {
  try {
    const response = await put(`/jobs/${jobId}`, formValues);
    if (!isJob(response.job)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.job;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const getJob = async (jobId: string): Promise<Job> => {
  // try {
  //   const response = await get(`/jobs/${jobId}`);
  //   if (!isJob(response.job)) {
  //     throw new Error("INTERNAL_ERROR");
  //   }
  //   return response.job;
  // } catch (error) {
  //   throw new Error("INTERNAL_ERROR");
  // }
  return { id: "1", name: "Job 1" };
};

export const getJobs = async (
  filters: JobFilters,
  nextToken?: string
): Promise<{ jobs: Job[]; nextToken?: string }> => {
  //   try {
  //     const response = await get("/jobs", { ...filters, nextToken });
  //     if (!isJob(response.job)) {
  //       throw new Error("INTERNAL_ERROR");
  //     }
  //     return response.job;
  //   } catch (error) {
  //     throw new Error("INTERNAL_ERROR");
  //   }
  try {
    return {
      jobs: [
        { id: "1", name: "Job 1" },
        { id: "2", name: "Job 2" },
      ],
      nextToken: "nextToken",
    };
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const deleteJob = async (jobId: string): Promise<void> => {
  try {
    await del(`/jobs/${jobId}`);
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};
