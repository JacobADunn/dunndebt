import { useState } from "react";

import Layout from "./components/layout/Layout";

import Dashboard from "./components/dashboard/Dashboard";
import HealthScore from "./components/dashboard/HealthScore";
import QuickStats from "./components/dashboard/QuickStats";
import ActionRequired from "./components/dashboard/ActionRequired";

import BillsList from "./components/bills/BillsList";
import BillForm from "./components/bills/BillForm";

import CreditCardList from "./components/cards/CreditCardList";
import CreditCardForm from "./components/cards/CreditCardForm";

import Modal from "./components/ui/Modal";
import ConfirmationModal from "./components/ui/ConfirmationModal";

import useFinance from "./hooks/useFinance";

export default function App() {
  const finance = useFinance();

  // ================= Bills =================

  const [showBillForm, setShowBillForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [billToDelete, setBillToDelete] = useState(null);

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

  // ================= Credit Cards =================

  const [showCardForm, setShowCardForm] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardToDelete, setCardToDelete] = useState(null);

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

  return (
    <Layout>

      {/* ================= Dashboard ================= */}

      <div className="pb-20">

        <Dashboard>
          <HealthScore />
          <QuickStats />
          <ActionRequired />
        </Dashboard>

      </div>

      {/* ================= Bills ================= */}

      <div className="pb-20">

        <BillsList
          bills={finance.bills}
          onAddBill={handleAddBill}
          onEditBill={handleEditBill}
          onDeleteBill={setBillToDelete}
          onTogglePaid={finance.toggleBillPaid}
        />

      </div>

      {/* ================= Credit Cards ================= */}

      <div className="pb-20">

        <CreditCardList
          cards={finance.cards}
          onAddCard={handleAddCard}
          onEditCard={handleEditCard}
          onDeleteCard={setCardToDelete}
          onRecordPayment={finance.recordCardPayment}
        />

      </div>

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