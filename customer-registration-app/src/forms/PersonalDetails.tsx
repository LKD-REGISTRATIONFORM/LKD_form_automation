// React manages the category dropdown state.
import React, { useState } from "react";

// Import React Native components used in this form.
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Reuse the app-wide colour palette.
import { COLORS } from "../constants/colors";

// Define all personal information fields.
export type PersonalDetailsData = {
  institution: string;
  name: string;
  dob: string;
  gender: string;
  religion: string;
  caste: string;
  category: string;
};

// Define the properties received from the parent screen.
type Props = {
  data: PersonalDetailsData;
  onChange: (
    field: keyof PersonalDetailsData,
    value: string
  ) => void;
};

// Reusable input field for consistent styling.
function Field({
  label,
  value,
  placeholder,
  onChangeText,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
}) {
  return (
    <View style={styles.field}>
      {/* Display the field label. */}
      <Text style={styles.label}>{label}</Text>

      {/* Keep the input value controlled by the parent screen. */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.secondaryText}
        autoCapitalize="words"
        style={styles.textInput}
      />
    </View>
  );
}

// Calculate age from a DD/MM/YYYY date.
function calculateAge(dob: string): string {
  // Match the expected date format.
  const match = dob.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  // Return an empty value when the date is incomplete.
  if (!match) return "";

  // Extract day, month and year.
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  // Create and validate the birth date.
  const birth = new Date(year, month - 1, day);

  if (
    birth.getDate() !== day ||
    birth.getMonth() !== month - 1 ||
    birth.getFullYear() !== year
  ) {
    return "";
  }

  // Calculate the current age.
  const today = new Date();
  let age = today.getFullYear() - year;

  // Subtract one if the birthday has not occurred this year.
  if (
    today.getMonth() < month - 1 ||
    (today.getMonth() === month - 1 &&
      today.getDate() < day)
  ) {
    age--;
  }

  // Return only plausible ages.
  return age >= 0 && age <= 120 ? String(age) : "";
}

// Main personal details component.
export default function PersonalDetails({
  data,
  onChange,
}: Props) {
  // Control whether the category dropdown is visible.
  const [showCategoryOptions, setShowCategoryOptions] =
    useState(false);

  // Calculate age automatically from the entered birth date.
  const age = calculateAge(data.dob);

  // Available social categories for the dropdown.
  const categories = [
    "SC",
    "ST",
    "OBC",
    "NT",
    "SBC",
    "VJ",
    "General",
    "Other",
  ];

  return (
    <View style={styles.container}>
      {/* Section heading. */}
      <Text style={styles.sectionTitle}>Personal Details</Text>

      {/* Full name occupies the complete row. */}
      <Field
        label="Full Name *"
        value={data.name}
        placeholder="Enter full name"
        onChangeText={(value) => onChange("name", value)}
      />

      {/* Date of birth and calculated age share one row. */}
      <View style={styles.twoColumnRow}>
        <View style={styles.column}>
          <Text style={styles.label}>Date of Birth *</Text>

          <TextInput
            value={data.dob}
            onChangeText={(value) => onChange("dob", value)}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={COLORS.secondaryText}
            maxLength={10}
            style={styles.textInput}
          />
        </View>

        <View style={styles.column}>
          <Text style={styles.label}>Calculated Age</Text>

          <View style={styles.ageCard}>
            <Text style={styles.ageValue}>
              {age ? `${age} years` : "—"}
            </Text>
          </View>
        </View>
      </View>

      {/* Category, caste and religion share one row. */}
      <View style={styles.threeColumnRow}>
        {/* Category appears first as a dropdown. */}
        <View style={styles.categoryColumn}>
          <Text style={styles.label}>Category *</Text>

          <Pressable
            accessibilityRole="button"
            onPress={() =>
              setShowCategoryOptions((previous) => !previous)
            }
            style={styles.dropdownButton}
          >
            <Text
              numberOfLines={1}
              style={styles.dropdownButtonText}
            >
              {data.category || "Select"} {"▾"}
            </Text>
          </Pressable>

          {/* Show the category options when opened. */}
          {showCategoryOptions && (
            <View style={styles.dropdown}>
              {categories.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => {
                    onChange("category", option);
                    setShowCategoryOptions(false);
                  }}
                  style={styles.dropdownOption}
                >
                  <Text style={styles.dropdownOptionText}>
                    {option}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* Caste appears second. */}
        <View style={styles.smallColumn}>
          <Text style={styles.label}>Caste</Text>

          <TextInput
            value={data.caste}
            onChangeText={(value) => onChange("caste", value)}
            placeholder="Caste"
            placeholderTextColor={COLORS.secondaryText}
            autoCapitalize="words"
            style={styles.textInput}
          />
        </View>

        {/* Religion appears third. */}
        <View style={styles.smallColumn}>
          <Text style={styles.label}>Religion</Text>

          <TextInput
            value={data.religion}
            onChangeText={(value) => onChange("religion", value)}
            placeholder="Religion"
            placeholderTextColor={COLORS.secondaryText}
            autoCapitalize="words"
            style={styles.textInput}
          />
        </View>
      </View>

      {/* Gender options stay in one compact row. */}
      <Text style={styles.label}>Gender *</Text>

      <View style={styles.genderRow}>
        {["Male", "Female", "Other"].map((option) => {
          // Check whether this option is selected.
          const selected = data.gender === option;

          return (
            <Pressable
              key={option}
              accessibilityRole="button"
              onPress={() => onChange("gender", option)}
              style={[
                styles.genderOption,
                selected && styles.selectedOption,
              ]}
            >
              <Text
                style={[
                  styles.genderText,
                  selected && styles.selectedText,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Institution comes later in the requested form order. */}
      <Field
        label="School / College / Institution"
        value={data.institution}
        placeholder="Enter institution name"
        onChangeText={(value) => onChange("institution", value)}
      />
    </View>
  );
}

// Keep all component styles together and reuse shared colours.
const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 16,
  },
  field: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 7,
  },
  textInput: {
    flex: 1,
    minWidth: 0,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 13,
    color: COLORS.text,
  },
  twoColumnRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 14,
  },
  column: {
    flex: 1,
    minWidth: 0,
  },
  ageCard: {
    minHeight: 43,
    justifyContent: "center",
    paddingHorizontal: 10,
    backgroundColor: "#EAF4F8",
    borderRadius: 10,
  },
  ageValue: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  threeColumnRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  categoryColumn: {
    flex: 1.1,
    minWidth: 0,
    zIndex: 2,
  },
  smallColumn: {
    flex: 1,
    minWidth: 0,
  },
  dropdownButton: {
    minHeight: 43,
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
  },
  dropdownButtonText: {
    color: COLORS.text,
    fontSize: 12,
  },
  dropdown: {
    position: "absolute",
    top: 68,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    zIndex: 10,
    elevation: 5,
  },
  dropdownOption: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  dropdownOptionText: {
    color: COLORS.text,
    fontSize: 12,
  },
  genderRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 18,
    marginTop: 4,
  },
  genderOption: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 9,
    backgroundColor: COLORS.surface,
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderText: {
    color: COLORS.text,
    fontSize: 13,
  },
  selectedText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});