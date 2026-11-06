"use server";

import { SettingsContent } from '@/components/settings/settings-content';
import { createClient } from '@/utils/supabase/server';
import { getSubscriptionAccessState } from '@/lib/subscription-access';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: subscription } = user
    ? await supabase
        .from('subscriptions')
        .select('subscription_plan, subscription_status')
        .eq('user_id', user.id)
        .maybeSingle()
    : { data: null };

  const subscriptionState = getSubscriptionAccessState(subscription);
  const isProPlan = subscriptionState.hasProAccess;
  const subscriptionStatus = subscription?.subscription_status ?? '';

  return (
    <div className="w-full">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
        </div>
      }>
        <SettingsContent 
          user={user} 
          isProPlan={isProPlan}
          subscriptionStatus={subscriptionStatus}
        />
      </Suspense>
    </div>
  );
}