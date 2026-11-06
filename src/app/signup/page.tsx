import { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Create Account | ResuSync - Free AI Resume Builder",
  description: "Create an account on ResuSync to generate ATS-optimized tech resumes and land your dream job.",
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const errorCode = params?.error;

  return <AuthScreen initialMode="signup" errorCode={errorCode} />;
}
