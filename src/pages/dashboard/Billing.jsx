import React from "react";

export default function Billing() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Billing</h1>

      <p className="text-gray-700 mb-6">
        Manage your subscription, view invoices, and update payment methods.
      </p>

      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">
          Billing tools coming soon — Stripe subscription plans, upgrade options, and payment history.
        </p>
      </div>
    </div>
  );
}
