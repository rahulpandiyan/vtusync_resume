export interface AuthFormFieldErrors {
  email?: string[];
  password?: string[];
  first_name?: string[];
  last_name?: string[];
}

export interface AuthFormState {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: AuthFormFieldErrors;
}

export const initialAuthFormState: AuthFormState = {
  status: "idle",
};
