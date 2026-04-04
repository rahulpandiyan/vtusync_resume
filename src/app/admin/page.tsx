// Removed getUserId import
import UsersTable from "./components/users-table";
import {
    getTotalUserCount,
    getTotalResumeCount,
    getTotalSubscriptionCount,
    getBaseResumeCount,
    getTailoredResumeCount,
    getProUserCount, // Import new action
    ensureAdmin // Import the new admin check function
} from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CreditCard, FileCheck, FilePlus, Star } from "lucide-react"; // Import Star, remove UsersRound

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminPage() {
    try {
        // Ensure the current user is an admin, redirect if not
        await ensureAdmin();

        // Fetch all stats concurrently
        const [
            totalUsers,
            totalResumes,
            totalSubscriptions,
            baseResumes,
            tailoredResumes,
            proUsers
        ] = await Promise.all([
            getTotalUserCount(),
            getTotalResumeCount(),
            getTotalSubscriptionCount(),
            getBaseResumeCount(),
            getTailoredResumeCount(),
            getProUserCount()
        ]);

        return (
            <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Overview of platform usage and user management.</p>
                </div>

                {/* Stats Section */}
                <section className="mb-10">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Platform Statistics</h2>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {/* Total Users Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Users
                                </CardTitle>
                                <Users className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalUsers.toLocaleString()}</div>
                            </CardContent>
                        </Card>

                        {/* Total Resumes Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Resumes
                                </CardTitle>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalResumes.toLocaleString()}</div>
                            </CardContent>
                        </Card>

                        {/* Base Resumes Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Base Resumes
                                </CardTitle>
                                <FileCheck className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{baseResumes.toLocaleString()}</div>
                            </CardContent>
                        </Card>

                        {/* Tailored Resumes Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Tailored Resumes
                                </CardTitle>
                                <FilePlus className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{tailoredResumes.toLocaleString()}</div>
                            </CardContent>
                        </Card>

                        {/* Pro Users Card */}
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Pro Users
                                </CardTitle>
                                <Star className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{proUsers.toLocaleString()}</div>
                            </CardContent>
                        </Card>

                        {/* Total Subscriptions Card */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    Total Subscriptions
                                </CardTitle>
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{totalSubscriptions.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* User Management Section */}
                <section>
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">User Management</h2>
                    <UsersTable />
                </section>
            </div>
        );
    } catch (error) {
        console.error("Error during AdminPage server rendering:", error);
        return (
            <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <h1 className="text-3xl font-bold text-red-600 mb-4">Admin Panel Error</h1>
                    <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                        <CardHeader>
                            <CardTitle className="text-red-700 dark:text-red-300">Configuration Required</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm text-red-600 dark:text-red-400">
                            <p>
                                The admin panel requires server-side configuration to function properly.
                            </p>
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-lg border border-red-200 dark:border-red-800">
                                <p className="font-mono text-xs mb-2">Required environment variable:</p>
                                <code className="text-xs bg-red-100 dark:bg-red-900 px-2 py-1 rounded">
                                    SUPABASE_SERVICE_ROLE_KEY
                                </code>
                            </div>
                            <p className="text-xs">
                                This key is only available on the server (Vercel) and cannot be set locally for security reasons.
                            </p>
                            <p className="text-xs">
                                <strong>Solution:</strong> Test the admin panel in production where the service role key is configured.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }
}
