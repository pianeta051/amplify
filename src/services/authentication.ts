import { Auth } from "aws-amplify";
import { CognitoUser } from "amazon-cognito-identity-js";
import * as AdminQueries from "./adminQueries";

type UserAttribute = { Name: string; Value: string };

type UserResponse = {
  Username: string;
  Attributes: UserAttribute[];
};

export type User = {
  id: string;
  email: string;
  name?: string;
};

export type CognitoUserWithAttributes = CognitoUser & {
  attributes?: {
    [key: string]: string;
  };
};

const isAttribute = (value: unknown): value is UserAttribute =>
  typeof value === "object" &&
  value !== null &&
  "Name" in value &&
  "Value" in value &&
  !!(value as UserAttribute)["Name"] &&
  !!(value as UserAttribute)["Value"];

const isUserResponse = (value: unknown): value is UserResponse =>
  typeof value === "object" &&
  value !== null &&
  "Username" in value &&
  "Attributes" in value &&
  Array.isArray((value as UserResponse)["Attributes"]) &&
  (value as UserResponse)["Attributes"].reduce(
    (correct, value) => correct && isAttribute(value),
    true
  );

const findAttributeValue = (user: UserResponse, attribute: string) =>
  user.Attributes.find((att) => att.Name === attribute)?.Value;

export const createUser = async (
  email: string,
  password: string
): Promise<void> => {
  try {
    const response = await AdminQueries.post("/createUser", {
      email: email,
      password: password,
    });
    console.log(response);
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const forgotPassword = async (email: string) => {
  try {
    await Auth.forgotPassword(email, {
      redirectTo: process.env.REACT_APP_HOST || "",
    });
  } catch (error) {
    if (hasCode(error)) {
      if (error.code === "UserNotFoundException") {
        throw new Error("USER_NOT_EXISTS");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};

export const getAuthenticatedUser =
  async (): Promise<CognitoUserWithAttributes | null> => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      return user;
    } catch (error) {
      return null;
    }
  };

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await AdminQueries.get("/listUsers");
    if (
      !response.Users ||
      !Array.isArray(response.Users) ||
      !response.Users.length
    ) {
      return [];
    }
    const users: User[] = response.Users.map((user: unknown): User | null => {
      if (!isUserResponse(user)) {
        return null;
      }
      const id = user.Username;
      const email = findAttributeValue(user, "email");
      const name = findAttributeValue(user, "name");
      if (!id || !email) {
        return null;
      }
      return { id, email, name };
    }).filter((user: User | null) => user !== null);
    return users;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

const hasCode = (
  value: unknown
): value is {
  message: string;
  code: string;
} =>
  typeof value === "object" &&
  (value as Record<string, unknown>).code !== undefined;

export const logIn = async (email: string, password: string) => {
  try {
    const user = await Auth.signIn(email, password);
    return user;
  } catch (error) {
    if (hasCode(error)) {
      if (error?.code === "UserNotFoundException") {
        throw new Error("USER_NOT_EXISTS");
      }
      if (error.code === "NotAuthorizedException") {
        if (error.message === "Password attempts exceeded") {
          throw new Error("TOO_MANY_TRIES");
        }
        throw new Error("INCORRECT_PASSWORD");
      }
    }
    console.log("error signing in", error);
    throw new Error("INTERNAL_ERROR");
  }
};

export const logOut = async () => {
  try {
    await Auth.signOut();
  } catch (e) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const resetPassword = async (
  email: string,
  code: string,
  newPassword: string
) => {
  try {
    await Auth.forgotPasswordSubmit(email, code, newPassword);
  } catch (error) {
    if (hasCode(error)) {
      if (error?.code === "UserNotFoundException") {
        throw new Error("USER_NOT_EXISTS");
      }
      if (error?.code === "InvalidPasswordException") {
        throw new Error("INVALID_PASSWORD");
      }
      if (error?.code === "CodeMismatchException") {
        throw new Error("INVALID_RESET_PASSWORD_LINK");
      }
      if (error?.code === "LimitExceededException") {
        throw new Error("TOO_MANY_TRIES");
      }
    }

    throw new Error("INTERNAL_ERROR");
  }
};

export const setPassword = async (
  user: CognitoUserWithAttributes,
  newPassword: string
) => {
  try {
    const loggedInUser = await Auth.completeNewPassword(user, newPassword);
    return loggedInUser;
  } catch (error) {
    if (hasCode(error)) {
      if (error?.code === "InvalidPasswordException") {
        throw new Error("INVALID_PASSWORD");
      }
    }
    console.log("error signing in", error);
    throw new Error("INTERNAL_ERROR");
  }
};

export const updateName = async (
  user: CognitoUserWithAttributes,
  newName: string
): Promise<CognitoUserWithAttributes> => {
  try {
    await Auth.updateUserAttributes(user, { name: newName });
    const newUser: CognitoUserWithAttributes = user;
    newUser.attributes = {
      ...user.attributes,
      name: newName,
    };
    return newUser;
  } catch (error) {
    throw new Error("INTERNAL_ERROR");
  }
};

export const updatePassword = async (
  user: CognitoUserWithAttributes,
  oldPassword: string,
  newPassword: string
) => {
  try {
    await Auth.changePassword(user, oldPassword, newPassword);
  } catch (error) {
    if (hasCode(error)) {
      if (error.code === "NotAuthorizedException") {
        throw new Error("INCORRECT_PASSWORD");
      }
      if (error.code === "InvalidPasswordException") {
        throw new Error("INVALID_PASSWORD");
      }
      if (error.code === "LimitExceededException") {
        throw new Error("TOO_MANY_TRIES");
      }
    }
    throw new Error("INTERNAL_ERROR");
  }
};
