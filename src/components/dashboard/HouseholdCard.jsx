import { useEffect, useState } from "react";
import {
  House,
  Pencil,
  Copy,
  LogOut,
  Circle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { getHousehold } from "../../services/firestore";

export default function HouseholdCard({
  onRename,
}) {
  const {
    householdId,
    currentUser,
    logout,
  } = useAuth();

  const { showToast } = useToast();

  const [household, setHousehold] = useState(null);

  useEffect(() => {
    async function load() {
      if (!householdId) return;

      const data = await getHousehold(
        householdId
      );

      setHousehold(data);
    }

    load();
  }, [householdId]);

  async function copyInvite() {
    if (!household?.inviteCode) return;

    await navigator.clipboard.writeText(
      household.inviteCode
    );

    showToast({
      title: "Invite Code Copied",
      message: "Copied to clipboard.",
    });
  }

  const members =
    household?.members?.length
      ? household.members
      : [
          {
            email: currentUser?.email,
          },
        ];

  const names = members
    .map(
      (m) =>
        m.name ??
        m.email.split("@")[0]
    )
    .join(" • ");

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">

      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-5">

        {/* Desktop */}

        <div className="hidden items-start justify-between md:flex">

          {/* Left */}

          <div>

            <button
              onClick={onRename}
              className="
                group
                flex
                items-center
                gap-3
                rounded-xl
                px-2
                py-1
                transition-all
                hover:bg-slate-900
              "
            >

              <House
                size={26}
                className="text-sky-400"
              />

              <h1 className="text-4xl font-black tracking-tight">
                {household?.name}
              </h1>

              <Pencil
                size={17}
                className="
                  text-slate-500
                  opacity-0
                  transition-opacity
                  group-hover:opacity-100
                "
              />

            </button>

            <div className="mt-1 ml-11 flex items-center gap-3 text-sm text-slate-400">

              <span>{names}</span>

              <span>•</span>

              <span>
                {members.length} Member
                {members.length !== 1 && "s"}
              </span>

              <span>•</span>

              <Circle
                size={8}
                fill="currentColor"
                className="animate-pulse text-emerald-400"
              />

              <span>LIVE</span>

            </div>

          </div>

          {/* Right */}

          <div className="flex flex-col items-end gap-3">

            <div className="flex items-center gap-3">

              <button
                onClick={copyInvite}
                className="
                  flex
                  items-center
                  gap-2
                  rounded-lg
                  border
                  border-slate-700
                  bg-slate-900
                  px-3
                  py-2
                  transition-all
                  hover:border-sky-500
                "
              >

                <Copy
                  size={15}
                  className="text-slate-400"
                />

                <span className="font-mono tracking-[0.25em] text-sky-400">
                  {household?.inviteCode}
                </span>

              </button>

              <button
                onClick={logout}
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-slate-400
                  transition-colors
                  hover:text-rose-400
                "
              >

                <LogOut size={16} />

                Log Out

              </button>

            </div>

            <p className="font-mono text-xs text-slate-500">

              Synced just now

            </p>

          </div>

        </div>

        {/* Mobile */}

        <div className="space-y-5 md:hidden">

          <button
            onClick={onRename}
            className="
              group
              flex
              items-center
              gap-3
            "
          >

            <House
              size={22}
              className="text-sky-400"
            />

            <h2 className="text-3xl font-black">
              {household?.name}
            </h2>

            <Pencil
              size={15}
              className="
                opacity-0
                text-slate-500
                group-hover:opacity-100
              "
            />

          </button>

          <p className="text-sm text-slate-400">
            {names}
          </p>

          <div className="flex flex-wrap items-center gap-3">

            <button
              onClick={copyInvite}
              className="
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-slate-700
                px-3
                py-2
              "
            >

              <Copy size={14} />

              <span className="font-mono tracking-[0.2em] text-sky-400">
                {household?.inviteCode}
              </span>

            </button>

            <button
              onClick={logout}
              className="
                flex
                items-center
                gap-2
                text-slate-400
              "
            >

              <LogOut size={16} />

              Log Out

            </button>

          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">

            <Circle
              size={8}
              fill="currentColor"
              className="animate-pulse text-emerald-400"
            />

            LIVE • Synced just now

          </div>

        </div>

      </div>

    </header>
  );
}