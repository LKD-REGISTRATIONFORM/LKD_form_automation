import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/colors";

type FormFieldProps = {
  label: string;
  subLabel?: string;
  required?: boolean;
  optional?: boolean;
  error?: string | null;
  hint?: string;
  children: React.ReactNode;
};

export default function FormField({
  label,
  subLabel,
  required = false,
  optional = false,
  error,
  hint,
  children,
}: FormFieldProps) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <View style={styles.labelGroup}>
          <Text style={styles.label}>
            {label}
            {required && <Text style={styles.requiredStar}> *</Text>}
          </Text>
          {subLabel && <Text style={styles.subLabel}> {subLabel}</Text>}
        </View>
        {optional && <Text style={styles.optionalTag}>(Optional)</Text>}
      </View>

      {hint && <Text style={styles.hint}>{hint}</Text>}

      <View style={styles.controlWrapper}>{children}</View>

      {error ? (
        <View style={styles.errorRow}>
          <Text style={styles.errorIcon}>⚠</Text>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  labelGroup: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  subLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontWeight: "400",
  },
  requiredStar: {
    color: COLORS.requiredStar,
    fontWeight: "700",
  },
  optionalTag: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontStyle: "italic",
  },
  hint: {
    fontSize: 12,
    color: COLORS.secondaryText,
    marginBottom: 6,
  },
  controlWrapper: {
    marginTop: 2,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    paddingHorizontal: 2,
  },
  errorIcon: {
    color: COLORS.error,
    fontSize: 13,
    marginRight: 4,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
});
