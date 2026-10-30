import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { COLORS } from "../constants/colors";

// Defines the additional information collected for each customer.
export type AdditionalDetailsData = {
  religion: string; // Customer's religion.
  occupation: string; // Standard or occupation.
  aadhaar: string; // Twelve-digit Aadhaar number.
  signature: string; // Customer's typed signature.
};

// Defines the data and update callback received from the parent.
type Props = {
  data: AdditionalDetailsData; // Current values of additional fields.
  onChange: (field: keyof AdditionalDetailsData, value: string) => void; // Updates one field.
};

// Reusable input field for additional customer information.
function Field({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType = "default",
  maxLength,
}: {
  label: string; // Text displayed above the input.
  value: string; // Current value of the field.
  placeholder: string; // Hint displayed when the field is empty.
  onChangeText: (value: string) => void; // Handles user input.
  keyboardType?: "default" | "numeric"; // Selects the appropriate keyboard.
  maxLength?: number; // Limits the number of characters.
}) {
  return (
    <View style={styles.field}>
      {/* Displays the input label. */}
      <Text style={styles.label}>{label}</Text>

      {/* Collects and displays the current field value. */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8796A5"
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize="words"
        style={styles.input}
      />
    </View>
  );
}

// Renders religion, occupation, Aadhaar, and signature fields.
export default function AdditionalDetails({ data, onChange }: Props) {
  return (
    <View>
      {/* Introduces the additional information section. */}
      <Text style={styles.sectionTitle}>Additional Details</Text>

      {/* Collects the customer's religion. */}
      <Field
        label="Religion"
        value={data.religion}
        placeholder="Enter religion"
        onChangeText={(value) => onChange("religion", value)}
      />

      {/* Collects the customer's standard or occupation. */}
      <Field
        label="Standard / Occupation"
        value={data.occupation}
        placeholder="Enter standard or occupation"
        onChangeText={(value) => onChange("occupation", value)}
      />

      {/* Collects Aadhaar as text to preserve leading zeros. */}
      <Field
        label="Aadhaar Number"
        value={data.aadhaar}
        placeholder="Enter 12-digit Aadhaar number"
        keyboardType="numeric"
        maxLength={12}
        onChangeText={(value) =>
          onChange("aadhaar", value.replace(/\D/g, "").slice(0, 12))
        }
      />

      {/* Collects the customer's typed signature. */}
      <Field
        label="Signature (Type Full Name) *"
        value={data.signature}
        placeholder="Enter name as signature"
        onChangeText={(value) => onChange("signature", value)}
      />

      {/* Explains that this prototype uses a typed signature. */}
      <Text style={styles.helperText}>
        Please type the customer's full name as their signature.
      </Text>
    </View>
  );
}

// Defines the appearance of the additional information fields.
const styles = StyleSheet.create({
  // Styles the section heading.
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 18,
  },

  // Adds spacing between input fields.
  field: {
    marginBottom: 18,
  },

  // Styles labels displayed above each input.
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
  },

  // Applies the shared design to all text inputs.
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
    color: COLORS.text,
  },

  // Styles the explanatory text below the signature field.
  helperText: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginTop: -8,
    marginBottom: 18,
  },
});
