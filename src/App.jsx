import { useState } from "react";
import Layout from "./components/layout/Layout";
import HouseholdCard from "./components/dashboard/HouseholdCard";
import Dashboard from "./components/dashboard/Dashboard";
import HealthScore from "./components/dashboard/HealthScore";
import QuickStats from "./components/dashboard/QuickStats";
import CashFlow from "./components/dashboard/CashFlow";
import CashFlowModal from "./components/dashboard/CashFlowModal";
import ActionRequired from "./components/dashboard/ActionRequired";
import MigrationButton from "./components/debug/MigrationButton";
import BillsList from "./components/bills/BillsList";
import BillForm from "./components/bills/BillForm";
import CreditCardList from "./components/cards/CreditCardList";
import CreditCardForm from "./components/cards/CreditCardForm";
import PaymentModal from "./components/cards/PaymentModal";
import ConfirmationModal from "./components/ui/ConfirmationModal";
import { useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import useFinance from "./hooks/useFinance";
import RenameHouseholdModal from "./components/dashboard/RenameHouseholdModal";
import Modal from "./components/ui/Modal";


import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase"; // adjust path if needed

async function testSecurity() {
  try {
    const snapshot = await getDoc(
      doc(
        db,
        "households",
        "191c85cd-2803-4b01-8c11-8b62796cea10" // your ORIGINAL household id
      )
    );

    console.log(snapshot.data());
  } catch (err) {
    console.error(err);
  }
}


export default function App() {
  const finance = useFinance();
  const { currentUser } = useAuth();
  const [showRenameHousehold, setShowRenameHousehold] =
  useState(false);

  // ================= Bills =================

  const [showBillForm, setShowBillForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [billToDelete, setBillToDelete] = useState(null);

  // ================= Credit Cards =================

  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);
  const [paymentCard, setPaymentCard] = useState(null);

  // ================= Cash Flow =================

  const [showCashFlow, setShowCashFlow] = useState(false);

  // ================= Bill Handlers =================

  const handleAddBill = () => {
    setEditingBill(null);
    setShowBillForm(true);
  };

  const handleEditBill = (bill) => {
    setEditingBill(bill);
    setShowBillForm(true);
  };

  const handleSaveBill = (bill) => {
    if (editingBill) {
      finance.updateBill(bill);
    } else {
      finance.addBill(bill);
    }

    setEditingBill(null);
    setShowBillForm(false);
  };

  // ================= Card Handlers =================

  const handleAddCard = () => {
    setEditingCard(null);
    setShowCardForm(true);
  };

  const handleEditCard = (card) => {
    setEditingCard(card);
    setShowCardForm(true);
  };

  const handleSaveCard = (card) => {
    if (editingCard) {
      finance.updateCard(card);
    } else {
      finance.addCard(card);
    }

    setEditingCard(null);
    setShowCardForm(false);
  };

if (!currentUser) {
  return <Login />;
}

  return (
    <Layout>

      {/* ================= Dashboard ================= */}
      <HouseholdCard onRename={() =>setShowRenameHousehold(true)}/>
        <Dashboard>
          <HealthScore />
            <QuickStats />
            <CashFlow onEdit={() => setShowCashFlow(true)}/>
          <ActionRequired />
        </Dashboard>

      {/* ================= Bills ================= */}

      <section className="mx-auto mt-8 w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        <BillsList
          bills={finance.bills}
          onAddBill={handleAddBill}
          onEditBill={handleEditBill}
          onDeleteBill={setBillToDelete}
          onTogglePaid={finance.toggleBillPaid}
        />

      </section>

      {/* ================= Credit Cards ================= */}

      <section className="mx-auto mt-8 mb-24 w-full max-w-7xl px-4 sm:px-6 lg:px-8">

        <CreditCardList
          cards={finance.cards}
          onAddCard={handleAddCard}
          onEditCard={handleEditCard}
          onDeleteCard={setCardToDelete}
          onRecordPayment={setPaymentCard}
        />

      </section>

      {/* ================= Bill Modal ================= */}

      <Modal
        open={showBillForm}
        title={editingBill ? "Edit Bill" : "Add Bill"}
        size="md"
        onClose={() => {
          setEditingBill(null);
          setShowBillForm(false);
        }}
      >
        <BillForm
          initialData={editingBill}
          onSave={handleSaveBill}
          onCancel={() => {
            setEditingBill(null);
            setShowBillForm(false);
          }}
        />
      </Modal>

      {/* ================= Credit Card Modal ================= */}

      <Modal
        open={showCardForm}
        title={editingCard ? "Edit Credit Card" : "Add Credit Card"}
        size="md"
        onClose={() => {
          setEditingCard(null);
          setShowCardForm(false);
        }}
      >
        <CreditCardForm
          initialData={editingCard}
          onSave={handleSaveCard}
          onCancel={() => {
            setEditingCard(null);
            setShowCardForm(false);
          }}
        />
      </Modal>

      {/* ================= Cash Flow Modal ================= */}

      <Modal
        open={showCashFlow}
        title="Edit Cash Flow"
        size="md"
        onClose={() => setShowCashFlow(false)}
      >
        <CashFlowModal
          initialData={finance.cashFlow}
          onSave={(data) => {
            finance.updateCashFlow(data);
            setShowCashFlow(false);
          }}
          onCancel={() => setShowCashFlow(false)}
        />
      </Modal>

      {/* ================= Rename Household ================= */}

      <Modal
        open={showRenameHousehold}
        title="Rename Household"
        size="sm"
        onClose={() =>
          setShowRenameHousehold(false)
        }
      >
        <RenameHouseholdModal
          onClose={() =>
            setShowRenameHousehold(false)
          }
        />
      </Modal>

      {/* ================= Payment Modal ================= */}

      <PaymentModal
        open={!!paymentCard}
        card={paymentCard}
        onClose={() => setPaymentCard(null)}
        onSave={(payment) => {
          finance.recordCardPayment(
            paymentCard.id,
            payment
          );

          setPaymentCard(null);
        }}
      />

      {/* ================= Delete Bill ================= */}

      <ConfirmationModal
        open={!!billToDelete}
        title="Delete Bill"
        message={
          billToDelete
            ? `Are you sure you want to delete "${billToDelete.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete Bill"
        cancelText="Cancel"
        onCancel={() => setBillToDelete(null)}
        onConfirm={() => {
          finance.deleteBill(billToDelete.id);
          setBillToDelete(null);
        }}
      />

      {/* ================= Delete Credit Card ================= */}

      <ConfirmationModal
        open={!!cardToDelete}
        title="Delete Credit Card"
        message={
          cardToDelete
            ? `Are you sure you want to delete "${cardToDelete.name}"? This action cannot be undone.`
            : ""
        }
        confirmText="Delete Card"
        cancelText="Cancel"
        onCancel={() => setCardToDelete(null)}
        onConfirm={() => {
          finance.deleteCard(cardToDelete.id);
          setCardToDelete(null);
        }}
      />

    </Layout>
  );

}