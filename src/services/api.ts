import { API } from "aws-amplify";
/**
 * GENERAL API FUNCTIONS
 */

export const del = async (path: string) => {
  return API.del("dataapi", path, {});
};

export const get = async (
  path: string,
  queryParams: { [param: string]: string | undefined } = {}
) => {
  return API.get("dataapi", path, {
    queryStringParameters: queryParams,
  });
};

export const post = async (
  path: string,
  body: { [param: string]: unknown } = {}
) => {
  return API.post("dataapi", path, {
    body,
  });
};

export const put = async (
  path: string,
  body: { [param: string]: unknown } = {}
) => {
  return API.put("dataapi", path, {
    body,
  });
};
