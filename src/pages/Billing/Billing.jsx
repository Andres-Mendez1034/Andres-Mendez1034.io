import React, { useContext } from "react";
import "./Billing.css";

import CheckoutButton from "../../components/payments/CheckoutButton";
import { AuthContext } from "../../context/AuthContext";

export default function Billing() {
  const { user } = useContext(AuthContext);

  return (
    <div className="billing-page">
      <div className="billing-container">
        <h1>Billing & Subscription</h1>

        <div className="billing-card">
          <h2>Current Plan</h2>

          <p>
            <strong>User:</strong> {user?.email || "Unknown"}
          </p>

          <p>
            <strong>Plan:</strong>{" "}
            {user?.plan || "Free"}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {user?.subscriptionStatus || "Inactive"}
          </p>
        </div>

        <div className="billing-card">
          <h2>Upgrade your plan</h2>

          <p>
            Unlock premium features for your brand and
            influencer campaigns.
          </p>

          <CheckoutButton
            productId="pro_plan"
            text="Upgrade to Pro"
          />
        </div>
      </div>
    </div>
  );
}