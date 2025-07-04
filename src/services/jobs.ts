import { JobFormValues } from "../components/JobForm/JobForm";
import { del, get, post, put } from "./api";
import { isErrorResponse } from "./error";
import { getFileUrl } from "./files";

export type JobAssignation = {
  sub: string;
  name?: string;
  email: string;
  color?: string;
};

export type Job = {
  id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  assignedTo?: JobAssignation;
  imageUrl?: string;
};

export type JobResponse = Omit<Job, "imageUrl"> & {
  imageKey?: string;
};

const isJobAssignation = (value: unknown): value is JobAssignation => {
  if (!value || typeof value !== "object") return false;
  const jobAssignation = value as JobAssignation;
  if (
    !jobAssignation.sub ||
    typeof jobAssignation.sub !== "string" ||
    (jobAssignation.name && typeof jobAssignation.name !== "string") ||
    (jobAssignation.color && typeof jobAssignation.color !== "string") ||
    !jobAssignation.email ||
    typeof jobAssignation.email !== "string"
  )
    return false;
  return true;
};

const isJobResponse = (value: unknown): value is JobResponse => {
  if (!value || typeof value !== "object") return false;
  const job = value as JobResponse;
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
    typeof job.endTime !== "string" ||
    (job.assignedTo &&
      !isJobAssignation(job.assignedTo) &&
      typeof job.assignedTo !== "string") ||
    !(typeof job.imageKey === "string" || job.imageKey === undefined)
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
    if (!isJobResponse(response.job)) {
      throw new Error("INTERNAL_ERROR");
    }
    return response.job;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export type EditJobParameters = Omit<JobFormValues, "imageUrl"> & {
  imageKey?: string;
};

export const editJob = async (
  jobId: string,
  formValues: EditJobParameters
): Promise<Job> => {
  try {
    const response = await put(
      "/jobs/" + jobId,
      transformFormValues(formValues)
    );
    if (!isJobResponse(response.job)) {
      throw new Error("INTERNAL_ERROR");
    }
    if (response.job.imageKey) {
      const imageUrl = await getFileUrl(response.job.imageKey);
      response.job.imageUrl = imageUrl;
      response.job.imageKey = undefined;
    }

    return response.job;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const getJob = async (jobId: string): Promise<Job> => {
  try {
    const response = await get(`/jobs/${jobId}`);
    if (!isJobResponse(response.job)) {
      throw new Error("INTERNAL_ERROR");
    }
    if (response.job.imageKey) {
      const imageUrl = await getFileUrl(response.job.imageKey);
      response.job.imageUrl = imageUrl;
      response.job.imageKey = undefined;
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
    if (!Array.isArray(response.jobs) || !response.jobs.every(isJobResponse)) {
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
