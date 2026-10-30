// React hooks manage search and record display.
import React, { useState } from "react";

// Import the components needed for the records screen.
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Reuse the existing application colours.
import { COLORS } from "../constants/colors";

// Define the customer record fields used by this screen.
type CustomerRecord = {
  id: string;
  name: string;
  phone: string;
  institution: string;
};

// Define the screen's navigation property.
type Props = {
  onBack: () => void;
};

// Customer Records screen.
export default function CustomerRecordsScreen({
  onBack,
}: Props) {
  // Store the current search query.
  const [search, setSearch] = useState("");

  // Temporary records until persistent storage is connected.
  const [records] = useState<CustomerRecord[]>([]);

  // Filter records by name, phone, or institution.
  const filteredRecords = records.filter((record) => {
    const query = search.toLowerCase();

    return (
      record.name.toLowerCase().includes(query) ||
      record.phone.includes(query) ||
      record.institution.toLowerCase().includes(query)
    );
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Return to the home screen. */}
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>‹ Back to Home</Text>
      </Pressable>

      {/* Screen heading. */}
      <Text style={styles.heading}>Customer Records</Text>
      <Text style={styles.subtitle}>
        Search and manage registered customers.
      </Text>

      {/* Search input. */}
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Search name, mobile or institution..."
        placeholderTextColor={COLORS.secondaryText}
        style={styles.searchInput}
      />

      {/* Display matching records or an empty state. */}
      {filteredRecords.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No records found</Text>
          <Text style={styles.emptyText}>
            Registered customers will appear here.
          </Text>
        </View>
      ) : (
        filteredRecords.map((record) => (
          <View key={record.id} style={styles.recordCard}>
            <Text style={styles.recordName}>{record.name}</Text>
            <Text style={styles.recordText}>{record.phone}</Text>
            <Text style={styles.recordText}>
              {record.institution}
            </Text>

            {/* Preview, edit and delete actions will be connected next. */}
            <Text style={styles.pendingText}>
              Record actions coming next.
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

// Maintain the existing blue-and-white visual style.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  heading: {
    color: COLORS.primary,
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    color: COLORS.secondaryText,
    marginTop: 6,
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 13,
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 18,
  },
  emptyCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 22,
    alignItems: "center",
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "700",
  },
  emptyText: {
    color: COLORS.secondaryText,
    marginTop: 8,
    textAlign: "center",
  },
  recordCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  recordName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: "700",
  },
  recordText: {
    color: COLORS.secondaryText,
    marginTop: 5,
  },
  pendingText: {
    color: COLORS.primary,
    marginTop: 12,
    fontSize: 12,
  },
});