import { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Sign In | ResuSync - Free AI Resume Builder",
  description: "Sign in to ResuSync to build ATS-optimized resumes and unlock top tech interview loops.",
};

export default async function AuthLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const errorCode = params?.error;

  return <AuthScreen initialMode="login" errorCode={errorCode} />;
}
