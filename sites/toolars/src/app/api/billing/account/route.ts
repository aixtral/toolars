import { resolveToolarsApiAuthContext } from "@/lib/auth/toolars-api-auth-context";
import { getToolarsBillingAccount, ToolarsBillingProviderError } from "@/lib/billing/billing-account";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";

export const runtime = "nodejs";

export async function GET(request?: Request) {
  const auth = await resolveToolarsApiAuthContext(request);
  let billing;

  if (isFreeTrialMode()) {
    return Response.json(
      {
        auth,
        code: "billing_phase2_parked",
        error: "Billing is parked for Phase 2 free launch"
      },
      { status: 410 }
    );
  }

  try {
    billing = await getToolarsBillingAccount(auth);
  } catch (error) {
    if (error instanceof ToolarsBillingProviderError) {
      return Response.json(
        {
          auth,
          error: "Billing provider unavailable"
        },
        { status: 502 }
      );
    }
    throw error;
  }

  if (!billing) {
    return Response.json(
      {
        auth,
        error: "Authentication required for billing account"
      },
      { status: 401 }
    );
  }

  return Response.json({
    auth,
    billing
  });
}
