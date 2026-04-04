import { debugAdminStatus } from "../actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Shield, ShieldCheck, ShieldX, User, AlertCircle } from "lucide-react";

export default async function AdminDebugPage() {
  const status = await debugAdminStatus();

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Admin Access Debug</h1>
      
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status.isAuthenticated ? (
              <ShieldCheck className="w-6 h-6 text-green-500" />
            ) : (
              <ShieldX className="w-6 h-6 text-red-500" />
            )}
            Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
              <span className="flex items-center gap-2 text-sm font-medium">
                <User className="w-4 h-4" />
                Authenticated
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                status.isAuthenticated 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {status.isAuthenticated ? 'Yes' : 'No'}
              </span>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">User ID</p>
              <p className="text-sm font-mono break-all">{status.userId || 'N/A'}</p>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <p className="text-sm">{status.userEmail || 'N/A'}</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Shield className="w-4 h-4" />
                Is Admin
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                status.isAdmin 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                {status.isAdmin ? 'Yes' : 'No'}
              </span>
            </div>

            <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Profile is_admin value</p>
              <p className="text-sm font-mono">
                {status.profileIsAdmin === null ? 'Not found in profiles table' : String(status.profileIsAdmin)}
              </p>
            </div>

            {status.error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Error
                </p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">{status.error}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            {!status.isAdmin && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-4">
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                  To grant admin access, run this SQL in your Supabase SQL editor:
                </p>
                <pre className="bg-zinc-900 text-zinc-100 p-3 rounded text-xs overflow-x-auto">
{`UPDATE profiles 
SET is_admin = true 
WHERE user_id = '${status.userId}';`}
                </pre>
              </div>
            )}

            <div className="flex gap-3">
              <Link href="/home" className="flex-1">
                <Button variant="outline" className="w-full">
                  Go to Home
                </Button>
              </Link>
              {status.isAdmin && (
                <Link href="/admin" className="flex-1">
                  <Button className="w-full">
                    Go to Admin Panel
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
