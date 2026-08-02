import { useEffect, useState } from "react";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";
import { getHousehold } from "../../services/firestore";

export default function HouseholdCard() {
const { householdId } = useAuth();
const { showToast } = useToast();
const [household, setHousehold] = useState(null);

  useEffect(() => {
    if (!householdId) return;

    async function loadHousehold() {
      const data = await getHousehold(householdId);
      setHousehold(data);
    }

    loadHousehold();
  }, [householdId]);

  async function copyCode() {
    if (!household?.inviteCode) return;

    await navigator.clipboard.writeText(
      household.inviteCode
    );

    showToast({
        title: "Invite Code Copied",
        message: "Copied to clipboard.",
    });
  }

  return (
    <Card>

      <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">
        Household
      </p>

      <h3 className="mt-2 text-2xl font-black">
        {household?.name ?? "Loading..."}
      </h3>

      <div className="mt-8">

        <p className="text-slate-400">
          Invite Code
        </p>

        <p className="mt-2 text-4xl font-black tracking-[0.3em]">
          {household?.inviteCode ?? "------"}
        </p>

      </div>

      <Button
        className="mt-8 w-full"
        onClick={copyCode}
      >
        Copy Invite Code
      </Button>

    </Card>
  );
}