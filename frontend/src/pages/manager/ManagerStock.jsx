import React from "react";
import Stock from "../admin/Stock";

export default function ManagerStock() {
  // Manager can assign work (that's their job) — not read-only for this page
  return <Stock readOnly={false} />;
}
