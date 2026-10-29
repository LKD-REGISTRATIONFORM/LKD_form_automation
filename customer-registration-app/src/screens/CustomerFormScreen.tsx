
import React, { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { COLORS } from "../constants/colors";

type Props = {
  onBack: () => void;
};

export default function CustomerFormScreen({
  onBack,
}: Props) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");

  const [errors, setErrors] = useState<string[]>([]);

  function handleSubmit() {
    const newErrors: string[] = [];

    if (!name.trim()) {
      newErrors.push("Full name is required.");
    }

    if (!age.trim()) {
      newErrors.push("Age is required.");
    } else if (
      !/^\d+$/.test(age) ||
      Number(age) < 1 ||
      Number(age) > 120
    ) {
      newErrors.push("Age must be between 1 and 120.");
    }

    if (!phone.trim()) {
      newErrors.push("Phone number is required.");
    } else if (!/^\d{10}$/.test(phone)) {
      newErrors.push("Enter a valid 10-digit phone number.");
    }

    if (!gender) {
      newErrors.push("Please select a gender.");
    }

    setErrors(newErrors);

    if (newErrors.length > 0) {
      return;
    }

    Alert.alert(
      "Validation Successful",
      "The details are valid. Saving customer records will be added next."
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>‹ Back to Home</Text>
      </Pressable>

      <Text style={styles.heading}>New Customer</Text>

      <Text style={styles.subtitle}>
        Enter the customer details below.
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>Full Name *</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter full name"
          autoCapitalize="words"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Age *</Text>
        <TextInput
          value={age}
          onChangeText={setAge}
          placeholder="Enter age"
          keyboardType="number-pad"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Phone Number *</Text>
        <TextInput
          value={phone}
          onChangeText={(value) =>
            setPhone(value.replace(/\D/g, "").slice(0, 10))
          }
          placeholder="Enter 10-digit phone number"
          keyboardType="phone-pad"
          maxLength={10}
          style={styles.input}
        />
      </View>

      <Text style={styles.label}>Gender *</Text>

      <View style={styles.genderRow}>
        {["Male", "Female", "Other"].map((option) => {
          const selected = gender === option;

          return (
            <Pressable
              key={option}
              onPress={() => setGender(option)}
              style={[
                styles.genderOption,
                selected && styles.genderSelected,
              ]}
            >
              <Text
                style={[
                  styles.genderText,
                  selected && styles.genderSelectedText,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {errors.length > 0 && (
        <View style={styles.errorBox}>
          {errors.map((error) => (
            <Text key={error} style={styles.errorText}>
              • {error}
            </Text>
          ))}
        </View>
      )}

      <Pressable
        onPress={handleSubmit}
        style={styles.submitButton}
      >
        <Text style={styles.submitText}>
          Validate Customer
        </Text>
      </Pressable>

      <Text style={styles.note}>* Required fields</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 20,
    paddingTop: 28,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 24,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: COLORS.text,
  },
  subtitle: {
    color: COLORS.secondaryText,
    marginTop: 6,
    marginBottom: 24,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
  },
  genderRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    marginBottom: 22,
  },
  genderOption: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  genderSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderText: {
    color: COLORS.text,
  },
  genderSelectedText: {
    color: "#FFFFFF",
  },
  errorBox: {
    backgroundColor: "#FEE2E2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 18,
  },
  errorText: {
    color: COLORS.error,
    marginVertical: 3,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  note: {
    color: COLORS.secondaryText,
    fontSize: 12,
    marginTop: 12,
  },
});
