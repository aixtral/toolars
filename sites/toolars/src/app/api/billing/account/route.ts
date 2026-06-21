import { resolveToolarsAuthContext } from "@/lib/auth/toolars-auth-context";
import { getToolarsBillingAccount, ToolarsBillingProviderError } from "@/lib/billing/billing-account";

export const runtime = "nodejs";

export async function GET(request?: Request) {
  const auth = resolveToolarsAuthContext(request);
  let billing;

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
