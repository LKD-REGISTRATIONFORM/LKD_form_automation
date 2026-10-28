
import React from "react";
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import ActionCard from "../components/ActionCard";
import { COLORS } from "../constants/colors";

type Props = {
  onNewCustomer: () => void;
};

export default function HomeScreen({
  onNewCustomer,
}: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.appName}>
          Customer Portal
        </Text>

        <Text style={styles.subtitle}>
          Registration & Records
        </Text>

        <Text style={styles.welcome}>
          Welcome!
        </Text>

        <Text style={styles.description}>
          Manage customer information in one place.
        </Text>

        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <ActionCard
          icon="👤"
          title="New Customer"
          description="Register a new customer"
          onPress={onNewCustomer}
        />

        <ActionCard
          icon="📋"
          title="Customer Records"
          description="View and manage saved records"
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Customer records will be implemented next."
            )
          }
        />

        <ActionCard
          icon="🔄"
          title="Sync Status"
          description="Check pending records"
          onPress={() =>
            Alert.alert(
              "Coming Soon",
              "Synchronization will be implemented later."
            )
          }
        />

        <Text style={styles.footer}>
          Customer Registration App · Prototype
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingTop: 30,
    paddingBottom: 32,
  },
  appName: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.secondaryText,
    marginTop: 4,
  },
  welcome: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 32,
  },
  description: {
    fontSize: 14,
    lineHeight: 21,
    color: COLORS.secondaryText,
    marginTop: 8,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 14,
  },
  footer: {
    fontSize: 12,
    color: COLORS.secondaryText,
    textAlign: "center",
    marginTop: 18,
  },
});
