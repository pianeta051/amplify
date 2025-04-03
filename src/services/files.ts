import { Storage } from "aws-amplify";

export const uploadFile = async (file: File, name: string) => {
  const result = await Storage.put(name, file, {
    level: "public",
  });
  return await Storage.get(result.key);
};
