
import React, { useState } from "react";

import HomeScreen from "./src/screens/HomeScreen";
import CustomerFormScreen from "./src/screens/CustomerFormScreen";

export default function App() {
  const [screen, setScreen] = useState<"home" | "form">("home");

  if (screen === "form") {
    return (
      <CustomerFormScreen
        onBack={() => setScreen("home")}
      />
    );
  }

  return (
    <HomeScreen
      onNewCustomer={() => setScreen("form")}
    />
  );
}
