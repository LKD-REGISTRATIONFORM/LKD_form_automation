// React Native components for the contact form.
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Reuse the app's existing colour palette.
import { COLORS } from "../constants/colors";

// Define all contact-related fields.
export type ContactDetailsData = {
  phone: string;
  city: string;
  district: string;
  pincode: string;
  address: string;
};

// Define the component's input and update properties.
type Props = {
  data: ContactDetailsData;
  onChange: (
    field: keyof ContactDetailsData,
    value: string
  ) => void;
};

// Reusable input field to keep styling consistent.
function Field({
  label,
  value,
  placeholder,
  onChangeText,
  keyboardType,
  maxLength,
  multiline = false,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "phone-pad" | "number-pad";
  maxLength?: number;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      {/* Display the field's label. */}
      <Text style={styles.label}>{label}</Text>

      {/* Render the editable input. */}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.secondaryText}
        keyboardType={keyboardType ?? "default"}
        maxLength={maxLength}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[
          styles.input,
          multiline && styles.addressInput,
        ]}
      />
    </View>
  );
}

// Contact details section.
export default function ContactDetails({
  data,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      {/* Section heading. */}
      <Text style={styles.heading}>Contact Details</Text>

      {/* Mobile number occupies the full width. */}
      <Field
        label="Mobile Number *"
        value={data.phone}
        placeholder="Enter 10-digit mobile number"
        keyboardType="phone-pad"
        maxLength={10}
        onChangeText={(value) =>
          onChange("phone", value.replace(/\D/g, "").slice(0, 10))
        }
      />

      {/* City, district and pincode share one row. */}
      <View style={styles.locationRow}>
        <View style={styles.cityColumn}>
          <Field
            label="City *"
            value={data.city}
            placeholder="City"
            onChangeText={(value) => onChange("city", value)}
          />
        </View>

        <View style={styles.districtColumn}>
          <Field
            label="District *"
            value={data.district}
            placeholder="District"
            onChangeText={(value) => onChange("district", value)}
          />
        </View>

        <View style={styles.pincodeColumn}>
          <Field
            label="Pincode *"
            value={data.pincode}
            placeholder="PIN"
            keyboardType="number-pad"
            maxLength={6}
            onChangeText={(value) =>
              onChange(
                "pincode",
                value.replace(/\D/g, "").slice(0, 6)
              )
            }
          />
        </View>
      </View>

      {/* Address stays full width for longer entries. */}
      <Field
        label="Address *"
        value={data.address}
        placeholder="Enter house number, street, area and landmark"
        multiline
        onChangeText={(value) => onChange("address", value)}
      />
    </View>
  );
}

// Shared styles preserve the existing application theme.
const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  heading: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  field: {
    marginBottom: 14,
    minWidth: 0,
  },
  label: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 7,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.text,
    minWidth: 0,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  cityColumn: {
    flex: 1,
    minWidth: 0,
  },
  districtColumn: {
    flex: 1.15,
    minWidth: 0,
  },
  pincodeColumn: {
    flex: 0.8,
    minWidth: 0,
  },
  addressInput: {
    minHeight: 90,
    paddingTop: 12,
  },
});