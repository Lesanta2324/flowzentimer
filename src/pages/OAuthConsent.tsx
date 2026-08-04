import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type AuthClient = { name?: string; logo_uri?: string };

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<{ client?: AuthClient } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) return setError("Missing authorization_id");
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const oauth = (supabase.auth as unknown as {
        oauth: {
          getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
        };
      }).oauth;
      const { data, error } = await oauth.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) return setError(error.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const oauth = (supabase.auth as unknown as {
      oauth: {
        approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
        denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
      };
    }).oauth;
    const { data, error } = approve
      ? await oauth.approveAuthorization(authorizationId)
      : await oauth.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      return setError(error.message);
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      return setError("No redirect returned by the authorization server.");
    }
    window.location.href = target;
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-8 text-center">
        <img src="/logo.png" alt="FlowZen" className="h-12 w-12 mx-auto mb-4" />
        {error ? (
          <>
            <h1 className="font-heading text-xl font-bold mb-2">Couldn't load this request</h1>
            <p className="text-sm text-muted-foreground">{error}</p>
          </>
        ) : !details ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <h1 className="font-heading text-xl font-bold mb-2">
              Connect {details.client?.name ?? "an app"} to FlowZen
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              This lets {details.client?.name ?? "the app"} read and update your FlowZen profile on your
              behalf. You can revoke access at any time.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" className="rounded-xl" disabled={busy} onClick={() => decide(false)}>
                Deny
              </Button>
              <Button className="rounded-xl" disabled={busy} onClick={() => decide(true)}>
                Approve
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
