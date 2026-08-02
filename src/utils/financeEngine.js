// src/utils/financeEngine.js

// ======================================================
// UTILIZATION
// ======================================================

export function getUtilization(cards = []) {
  const totalBalance = cards.reduce(
    (sum, card) => sum + Number(card.balance || 0),
    0
  );

  const totalLimit = cards.reduce(
    (sum, card) => sum + Number(card.creditLimit || 0),
    0
  );

  if (!totalLimit) return 0;

  return (totalBalance / totalLimit) * 100;
}

// ======================================================
// HEALTH SCORE
// ======================================================

export function calculateHealthScore(
  cards = [],
  bills = [],
  cashFlow = {}
) {
  let score = 0;

  const utilization = getUtilization(cards);

  // ---------------------------
  // Utilization (30 pts)
  // ---------------------------

  if (utilization <= 10) score += 30;
  else if (utilization <= 30) score += 25;
  else if (utilization <= 50) score += 18;
  else if (utilization <= 70) score += 12;
  else if (utilization <= 90) score += 6;

  // ---------------------------
  // Bills (20 pts)
  // ---------------------------

  const today = new Date().getDate();

  const overdueBills = bills.filter(
    (bill) =>
      !bill.isPaid &&
      Number(bill.dueDay) < today
  );

  if (overdueBills.length === 0) {
    score += 20;
  } else if (overdueBills.length === 1) {
    score += 12;
  }

  // ---------------------------
  // Credit Cards (20 pts)
  // ---------------------------

  if (cards.length) {
    const paidCards = cards.filter(
      (card) => card.isPaidThisMonth
    ).length;

    score += Math.round(
      (paidCards / cards.length) * 20
    );
  }

  // ---------------------------
  // Cash Buffer (15 pts)
  // ---------------------------

  const checking = Number(
    cashFlow.checkingBalance || 0
  );

  const remainingBills = bills
    .filter((bill) => !bill.isPaid)
    .reduce(
      (sum, bill) =>
        sum + Number(bill.amount || 0),
      0
    );

  const remainingMinimums = cards
    .filter((card) => !card.isPaidThisMonth)
    .reduce(
      (sum, card) =>
        sum +
        Number(card.minimumPayment || 0),
      0
    );

  const buffer =
    checking -
    remainingBills -
    remainingMinimums;

  if (buffer >= 1000) score += 15;
  else if (buffer >= 500) score += 12;
  else if (buffer >= 250) score += 8;
  else if (buffer >= 0) score += 5;

  // ---------------------------
  // Debt Progress (15 pts)
  // ---------------------------

  const paymentsMade = cards.filter(
    (card) => card.isPaidThisMonth
  ).length;

  if (paymentsMade > 0) {
    score += 15;
  } else {
    score += 8;
  }

  score = Math.round(
    Math.max(0, Math.min(score, 100))
  );

  let label = "Needs Work";
  let color = "text-rose-400";

  if (score >= 90) {
    label = "Excellent";
    color = "text-emerald-400";
  } else if (score >= 75) {
    label = "Great";
    color = "text-green-400";
  } else if (score >= 60) {
    label = "Good";
    color = "text-sky-400";
  } else if (score >= 40) {
    label = "Fair";
    color = "text-amber-400";
  }

  let summary =
    "Your financial health needs attention.";

  if (score >= 90) {
    summary =
      "Outstanding work. You're well on your way to becoming debt free.";
  } else if (score >= 75) {
    summary =
      "You're in a strong position. Stay consistent and keep reducing balances.";
  } else if (score >= 60) {
    summary =
      "You're making good progress. Lowering your utilization will improve your score the fastest.";
  } else if (score >= 40) {
    summary =
      "Your bills are under control, but high balances are limiting your progress.";
  }

  return {
    score,
    label,
    color,
    summary,
    utilization,
    scalePosition: score,
  };
}

// ======================================================
// ATTACK CARD
// ======================================================

export function getAttackCard(
  cards = [],
  strategy = "avalanche"
) {
  const activeCards = cards.filter(
    (card) => Number(card.balance) > 0
  );

  if (!activeCards.length) return null;

  const sorted = [...activeCards];

  if (strategy === "snowball") {
    sorted.sort(
      (a, b) => a.balance - b.balance
    );
  } else {
    sorted.sort((a, b) => {
      if (b.apr !== a.apr) {
        return b.apr - a.apr;
      }

      return b.balance - a.balance;
    });
  }

  const card = sorted[0];

  const monthlyInterest =
    (Number(card.balance) *
      Number(card.apr)) /
    100 /
    12;

  return {
    ...card,

    monthlyInterest,

    recommendedPayment: Math.max(
      Number(card.minimumPayment) + 50,
      Number(card.minimumPayment) * 1.5
    ),

    reason:
      strategy === "snowball"
        ? "Lowest remaining balance under your Snowball strategy."
        : "Highest APR under your Avalanche strategy.",
  };
}

// ======================================================
// TIMELINE
// ======================================================

export function buildTimelineEvents(
  bills = [],
  cards = [],
  cashFlow = {}
) {
  const events = [];

  bills.forEach((bill) => {
    events.push({
      id: `bill-${bill.id}`,
      type: "bill",
      title: bill.name,
      subtitle: `$${Number(
        bill.amount
      ).toFixed(2)}`,
      day: bill.dueDay,
      complete: bill.isPaid,
    });
  });

  cards.forEach((card) => {
    events.push({
      id: `card-${card.id}`,
      type: "card",
      title: card.name,
      subtitle: `$${Number(
        card.minimumPayment
      ).toFixed(2)}`,
      day: card.dueDay,
      complete: card.isPaidThisMonth,
    });
  });

  if (
    cashFlow.weeklyPaycheck &&
    cashFlow.nextPayday
  ) {
    events.push({
      id: "payday",
      type: "payday",
      title: "Payday",
      subtitle: `+$${Number(
        cashFlow.weeklyPaycheck
      ).toFixed(2)}`,
      weekday: cashFlow.nextPayday,
      complete: false,
    });
  }

  return events.sort(
    (a, b) => (a.day || 99) - (b.day || 99)
  );
}

// ======================================================
// DEBT PROJECTION
// ======================================================

export function projectDebtFreeDate(
  cards = [],
  extraPayment = 0
) {
  const totalDebt = cards.reduce(
    (sum, card) =>
      sum + Number(card.balance || 0),
    0
  );

  const monthlyPayment =
    cards.reduce(
      (sum, card) =>
        sum +
        Number(card.minimumPayment || 0),
      0
    ) + Number(extraPayment);

  if (monthlyPayment <= 0)
    return null;

  const months = Math.ceil(
    totalDebt / monthlyPayment
  );

  const date = new Date();

  date.setMonth(
    date.getMonth() + months
  );

  return {
    months,
    projectedDate:
      date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      }),
  };
}