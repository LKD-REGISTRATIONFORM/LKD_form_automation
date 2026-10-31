import { router } from "expo-router";

import HomeScreen from "../screens/HomeScreen";

export default function HomeRoute() {
  return <HomeScreen onNewCustomer={() => router.push("/customer-form")} />;
}
