import { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Create Account | ResuSync - Free AI Resume Builder",
  description: "Create your free ResuSync account and generate ATS-optimized tech resumes in minutes.",
};

export default async function AuthSignupPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const errorCode = params?.error;

  return <AuthScreen initialMode="signup" errorCode={errorCode} />;
}
