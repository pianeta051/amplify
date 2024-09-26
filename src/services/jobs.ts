import { JobFormValues } from "../components/JobForm/JobForm";
import { del, get, post, put } from "./api";
import { isErrorResponse } from "./error";

export type Job = {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
};

const isJob = (value: unknown): value is Job => {
  if (!value || typeof value !== "object") return false;
  const job = value as Job;
  if (
    !job.id ||
    typeof job.id !== "string" ||
    !job.name ||
    typeof job.name !== "string" ||
    !job.date ||
    typeof job.date !== "string" ||
    !job.startTime ||
    typeof job.startTime !== "string" ||
    !job.endTime ||
    typeof job.endTime !== "string"
  )
    return false;
  return true;
};

export type JobFilters = {
  addressId?: string;
  customerId?: string;
  from?: string;
  to?: string;
};

type JobsPaginationArguments = {
  nextToken?: string;
  paginate?: boolean;
};

export const createJob = async (formValues: JobFormValues): Promise<Job> => {
  try {
    const response = await post("/jobs", transformFormValues(formValues));
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
    const response = await put(
      "/jobs/" + jobId,
      transformFormValues(formValues)
    );
    if (!isJob(response.job)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.job;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const getJob = async (jobId: string): Promise<Job> => {
  try {
    const response = await get(`/jobs/${jobId}`);
    if (!isJob(response.job)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.job;
  } catch (error) {
    if (isErrorResponse(error)) {
      const status = error.response.status;
      if (status === 403) {
        throw new Error("UNAUTHORIZED");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const getJobs = async (
  filters: JobFilters,
  order: "asc" | "desc" = "asc",
  { nextToken, paginate }: JobsPaginationArguments = { paginate: true }
): Promise<{ jobs: Job[]; nextToken?: string }> => {
  try {
    const response = await get("/jobs", {
      ...filters,
      nextToken,
      order,
      paginate: paginate === false ? "false" : "true",
    });
    if (!Array.isArray(response.jobs) || !response.jobs.every(isJob)) {
      throw new Error("INTERNAL_ERROR");
    }
    return { jobs: response.jobs, nextToken: response.nextToken };
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

const transformFormValues = (formValues: JobFormValues) => {
  return {
    ...formValues,
    date: formValues.date.format("YYYY-MM-DD"),
    startTime: formValues.startTime.format("HH:mm"),
    endTime: formValues.endTime.format("HH:mm"),
  };
};
