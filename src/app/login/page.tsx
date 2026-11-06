import { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Sign In | ResuSync - AI Resume Builder",
  description: "Sign in to your ResuSync account to access your resumes, ATS analytics, and job match reports.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const errorCode = params?.error;

  return <AuthScreen initialMode="login" errorCode={errorCode} />;
}
