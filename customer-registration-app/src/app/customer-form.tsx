import { router } from "expo-router";

import CustomerFormScreen from "../screens/CustomerFormScreen";

export default function CustomerFormRoute() {
  return <CustomerFormScreen onBack={() => router.back()} />;
}
