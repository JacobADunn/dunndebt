import { useEffect, useState } from "react";

import Button from "../ui/Button";
import Input from "../ui/Input";

import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

import {
  getHousehold,
  updateHouseholdName,
} from "../../services/firestore";

export default function RenameHouseholdModal({
  onClose,
}) {
  const { householdId } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState("");

  useEffect(() => {
    async function load() {
      const household =
        await getHousehold(householdId);

      if (household) {
        setName(household.name);
      }
    }

    if (householdId) {
      load();
    }
  }, [householdId]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) return;

    await updateHouseholdName(
      householdId,
      name
    );

    showToast({
      title: "Household Updated",
      message: "Household renamed successfully.",
    });

    onClose();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Input
        label="Household Name"
        value={name}
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>

        <Button type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
}