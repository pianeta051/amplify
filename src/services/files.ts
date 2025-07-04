import { Storage } from "aws-amplify";

export const uploadFile = async (file: File, name: string) => {
  await Storage.put(name, file, {
    level: "public",
  });
};

export const getFileUrl = async (key: string) => Storage.get(key);

export const deleteFile = async (key: string): Promise<void> => {
  await Storage.remove(key, {
    level: "public",
  });
};
