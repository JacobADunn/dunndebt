import { useEffect, useState } from "react";

import Card from "../ui/Card";
import Button from "../ui/Button";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import {
  getHousehold,
  getHouseholdMembers,
} from "../../services/firestore";

export default function HouseholdCard({
  onRename,
}) {
  const { householdId } = useAuth();
  const { showToast } = useToast();

  const [household, setHousehold] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    if (!householdId) return;

    async function load() {
      const householdData =
        await getHousehold(householdId);

      const memberData =
        await getHouseholdMembers(
          householdId
        );

      setHousehold(householdData);
      setMembers(memberData);
    }

    load();
  }, [householdId]);

  async function copyInviteCode() {
    if (!household?.inviteCode) return;

    await navigator.clipboard.writeText(
      household.inviteCode
    );

    showToast({
      title: "Invite Code Copied",
      message:
        "Invite code copied to clipboard.",
    });
  }

  return (
    <section className="space-y-6">

      <div>

        <h2 className="text-3xl font-black sm:text-4xl lg:text-5xl">
          Household
        </h2>

        <p className="mt-2 text-base text-slate-400 sm:text-lg">
          Share bills, debt and progress with
          your family.
        </p>

      </div>

      <Card>

        {/* Header */}

        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

          <div>

            <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
              Household
            </p>

            <h3 className="mt-3 text-3xl font-black">
              {household?.name ??
                "Loading..."}
            </h3>

            <div className="mt-4 inline-flex items-center gap-3 rounded-xl bg-slate-800 px-4 py-3">

              <span className="text-xl">
                👥
              </span>

              <div>

                <p className="font-bold">
                  {members.length}{" "}
                  {members.length === 1
                    ? "Member"
                    : "Members"}
                </p>

                <p className="text-sm text-slate-400">
                  Connected to this household
                </p>

              </div>

            </div>

          </div>

          <Button
            variant="secondary"
            onClick={onRename}
          >
            Rename Household
          </Button>

        </div>

        {/* Divider */}

        <div className="my-8 border-t border-slate-800" />

        {/* Invite Code */}

        <div className="text-center">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            Invite Code
          </p>

          <h2 className="mt-5 break-all text-5xl font-black tracking-[0.35em] text-sky-400">
            {household?.inviteCode ??
              "------"}
          </h2>

          <p className="mx-auto mt-5 max-w-md text-slate-400">
            Share this code with someone to
            join your household.
          </p>

          <Button
            className="mx-auto mt-8 w-full max-w-sm"
            onClick={copyInviteCode}
          >
            Copy Invite Code
          </Button>

        </div>

        {/* Future Member List */}

        <div className="mt-10 border-t border-slate-800 pt-8">

          <p className="mb-5 text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            Household Members
          </p>

          <div className="space-y-3">

            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between rounded-xl bg-slate-800 px-5 py-4"
              >
                <div>

                  <p className="font-semibold text-white">
                    {member.email}
                  </p>

                  <p className="text-sm text-slate-400">
                    Household Member
                  </p>

                </div>

                <div className="text-emerald-400">
                  ✓
                </div>

              </div>
            ))}

          </div>

        </div>

      </Card>

    </section>
  );
}