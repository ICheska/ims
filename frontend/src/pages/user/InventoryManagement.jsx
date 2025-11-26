import { useState } from "react";
import StockIn from "./StockIn";
import StockOut from "./StockOut";
import InventoryLogs from "./InventoryLogs";

export default function InventoryManagement() {
  const [tab, setTab] = useState("stockin");

  return (
    <div>
      <h1>Inventory Management</h1>

      <div>
        <button onClick={() => setTab("stockin")}>Stock In</button>
        <button onClick={() => setTab("stockout")}>Stock Out</button>
        <button onClick={() => setTab("logs")}>Inventory Logs</button>
      </div>

      <div>
        {tab === "stockin" && <StockIn />}
        {tab === "stockout" && <StockOut />}
        {tab === "logs" && <InventoryLogs />}
      </div>
    </div>
  );
}
