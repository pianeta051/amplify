import { JobFormValues } from "../components/JobForm/JobForm";
import { get, post } from "./api";

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
