import type { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/admin/auth-forms";
import { ProfileForm } from "@/components/admin/settings-forms";
import { AdminHeader, Badge, Card } from "@/components/admin/ui";
import { listAdminUsers } from "@/lib/admin/queries";
import { requireAdmin } from "@/lib/auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

// Admin screens read the session cookie, so they are allowed to block.
export const instant = false;

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const admin = await requireAdmin();
  const supabase = await createSupabaseServerClient();
  const team = await listAdminUsers(supabase);

  return (
    <>
      <AdminHeader title="Account" description="Your profile, password and the people who can manage the site." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Profile">
          <ProfileForm displayName={admin.displayName} email={admin.email} />
        </Card>
        <Card title="Change password" description="Use at least 10 characters.">
          <UpdatePasswordForm />
        </Card>
        <Card
          title="Team"
          description={"Add another admin from your computer: npm run create-admin -- email password \"Name\" admin"}
          className="lg:col-span-2"
          bodyClassName="p-0"
        >
          <ul className="divide-y divide-line">
            {team.map((member) => (
              <li key={member.user_id} className="flex items-center gap-3 px-5 py-3.5">
                <div className="grid size-9 place-items-center rounded-full bg-surface text-[14px] font-semibold">
                  {(member.display_name || member.email).slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium">
                    {member.display_name || member.email}
                    {member.user_id === admin.id ? <span className="text-fg-3"> (you)</span> : null}
                  </p>
                  <p className="truncate text-[12px] text-fg-3">
                    {member.email} · since {formatDate(member.created_at, { month: "short", year: "numeric" })}
                  </p>
                </div>
                <Badge tone={member.role === "owner" ? "blue" : "gray"} className="capitalize">
                  {member.role}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
