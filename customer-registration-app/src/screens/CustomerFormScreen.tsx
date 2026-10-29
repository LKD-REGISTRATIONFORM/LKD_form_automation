import React, { useRef, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import CustomDatePicker from "../components/CustomDatePicker";
import CustomDropdown from "../components/CustomDropdown";
import FormField from "../components/FormField";
import { COLORS } from "../constants/colors";
import {
  CATEGORY_OPTIONS,
  CustomerFormData,
  GENDER_OPTIONS,
  INITIAL_FORM_DATA,
  RELIGION_OPTIONS,
} from "../constants/formConstants";
import {
  calculateAgeFromDob,
  formatDate,
  FormErrors,
  validateCustomerForm,
  validateField,
} from "../utils/validation";

type Props = {
  onBack: () => void;
};

export default function CustomerFormScreen({ onBack }: Props) {
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  const todayFormatted = formatDate(new Date());

  const [formData, setFormData] = useState<CustomerFormData>({
    ...INITIAL_FORM_DATA,
    campDate: todayFormatted,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [registeredSummary, setRegisteredSummary] = useState<CustomerFormData | null>(null);

  /**
   * Updates a single field and triggers automatic age calculation when DOB is entered.
   * Also performs live validation so errors clear instantly upon correction.
   */
  function handleFieldChange<K extends keyof CustomerFormData>(
    field: K,
    value: CustomerFormData[K]
  ) {
    const updatedData = { ...formData, [field]: value };

    // Automatic Age Calculation from Date of Birth
    if (field === "dob" && typeof value === "string") {
      const calculated = calculateAgeFromDob(value);
      if (calculated !== null && calculated >= 0 && calculated <= 120) {
        updatedData.age = String(calculated);
        if (errors.age) {
          setErrors((prev) => {
            const next = { ...prev };
            delete next.age;
            return next;
          });
        }
      }
    }

    setFormData(updatedData);

    // Live validation: error clears immediately when corrected
    if (hasAttemptedSubmit || errors[field]) {
      const fieldError = validateField(field, value, updatedData);
      setErrors((prev) => {
        const next = { ...prev };
        if (fieldError) {
          next[field] = fieldError;
        } else {
          delete next[field];
        }
        return next;
      });
    }
  }

  function handleReset() {
    setFormData({
      ...INITIAL_FORM_DATA,
      campDate: formatDate(new Date()),
    });
    setErrors({});
    setHasAttemptedSubmit(false);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  }

  function handleSubmit() {
    setHasAttemptedSubmit(true);

    const validationErrors = validateCustomerForm(formData);
    setErrors(validationErrors);

    const errorKeys = Object.keys(validationErrors);
    if (errorKeys.length > 0) {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }

    setRegisteredSummary({ ...formData });
    setSuccessModalVisible(true);
  }

  const errorCount = Object.keys(errors).length;

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Top Navigation */}
      <View style={styles.topNavigation}>
        <Pressable
          onPress={onBack}
          style={styles.backButton}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
        >
          <Text style={styles.backText}>‹ Back to Home</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            Alert.alert(
              "Clear Form",
              "Are you sure you want to reset all entered details?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Reset", style: "destructive", onPress: handleReset },
              ]
            );
          }}
          style={styles.resetButton}
          hitSlop={8}
        >
          <Text style={styles.resetText}>Clear All</Text>
        </Pressable>
      </View>

      {/* Camp Header Banner based on paper form */}
      <View style={styles.campHeaderBanner}>
        <View style={styles.campRedPill}>
          <Text style={styles.campRedPillText}>
            Free Blood Testing Camp • To Screen Youth for Anaemia
          </Text>
        </View>

        <Text style={styles.sloganText}>स्वस्थ युवा - स्वस्थ भारत</Text>

        <View style={styles.orgRow}>
          <Text style={styles.orgName}>LOKKALYAN DIAGNOSTICS</Text>
          <Text style={styles.collabText}>In association with Western Coalfields Limited</Text>
          <Text style={styles.projectText}>Project SUSHRUTA</Text>
        </View>
      </View>

      {/* Mandatory note pill */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerText}>
          Fields with <Text style={styles.requiredStarHighlight}>*</Text> are mandatory according to the paper record.
        </Text>
      </View>

      {/* Error Summary Banner when validation fails */}
      {hasAttemptedSubmit && errorCount > 0 && (
        <View style={styles.errorSummaryBox}>
          <View style={styles.errorSummaryHeader}>
            <Text style={styles.errorSummaryIcon}>⚠</Text>
            <Text style={styles.errorSummaryTitle}>
              Please resolve {errorCount} {errorCount === 1 ? "error" : "errors"} below:
            </Text>
          </View>
          {Object.entries(errors).slice(0, 4).map(([key, err]) => (
            <Text key={key} style={styles.errorSummaryItem}>
              • {err}
            </Text>
          ))}
          {errorCount > 4 && (
            <Text style={styles.errorSummaryMore}>
              + {errorCount - 4} more issue{errorCount - 4 > 1 ? "s" : ""} to correct
            </Text>
          )}
        </View>
      )}

      {/* SECTION 1: Camp Record Info */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📋</Text>
          <Text style={styles.sectionTitle}>Camp Information</Text>
        </View>

        {/* Date & Sr.No */}
        <View style={styles.rowTwoCols}>
          <View style={styles.colLeft}>
            <FormField
              label="Date"
              subLabel="(दिनांक)"
              required
              error={errors.campDate}
              hint="Camp date DD/MM/YYYY"
            >
              <CustomDatePicker
                value={formData.campDate}
                onChangeDate={(v) => handleFieldChange("campDate", v)}
                placeholder="DD/MM/YYYY"
                title="Camp Date"
                maxDate={new Date()}
                hasError={Boolean(errors.campDate)}
              />
            </FormField>
          </View>

          <View style={styles.colRight}>
            <FormField
              label="Sr. No."
              subLabel="(अनुक्रमांक)"
              optional
              error={errors.srNo}
            >
              <TextInput
                value={formData.srNo}
                onChangeText={(v) => handleFieldChange("srNo", v)}
                placeholder="e.g. 101"
                placeholderTextColor={COLORS.placeholder}
                style={styles.input}
              />
            </FormField>
          </View>
        </View>

        {/* School / College / Institution */}
        <FormField
          label="School / College / Institution"
          subLabel="(शाळा / महाविद्यालय / संस्था)"
          required
          error={errors.institution}
          hint="Name of educational or community institution"
        >
          <TextInput
            value={formData.institution}
            onChangeText={(v) => handleFieldChange("institution", v)}
            placeholder="Enter school, college, or institution name"
            placeholderTextColor={COLORS.placeholder}
            autoCapitalize="words"
            style={[styles.input, errors.institution && styles.inputError]}
          />
        </FormField>
      </View>

      {/* SECTION 2: Beneficiary / Student Profile */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>👤</Text>
          <Text style={styles.sectionTitle}>Personal Details</Text>
        </View>

        {/* Full Name */}
        <FormField
          label="Full Name"
          subLabel="(पूर्ण नाव)"
          required
          error={errors.fullName}
          hint="First name, middle name, surname"
        >
          <TextInput
            value={formData.fullName}
            onChangeText={(v) => handleFieldChange("fullName", v)}
            placeholder="e.g. Rahul Ramesh Deshmukh"
            placeholderTextColor={COLORS.placeholder}
            autoCapitalize="words"
            style={[styles.input, errors.fullName && styles.inputError]}
          />
        </FormField>

        {/* Date of Birth & Automatic Age Calculation */}
        <View style={styles.rowTwoCols}>
          <View style={styles.colLeft}>
            <FormField
              label="Date of Birth"
              subLabel="(जन्मतारीख)"
              required
              error={errors.dob}
              hint="DD/MM/YYYY [Auto calculates age]"
            >
              <CustomDatePicker
                value={formData.dob}
                onChangeDate={(v) => handleFieldChange("dob", v)}
                placeholder="DD/MM/YYYY"
                title="Date of Birth"
                maxDate={new Date()}
                hasError={Boolean(errors.dob)}
              />
            </FormField>
          </View>

          <View style={styles.colRight}>
            <FormField
              label="Age"
              subLabel="(वय)"
              required
              error={errors.age}
              hint="Years (1-120)"
            >
              <TextInput
                value={formData.age}
                onChangeText={(v) =>
                  handleFieldChange("age", v.replace(/\D/g, "").slice(0, 3))
                }
                placeholder="Age"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="number-pad"
                maxLength={3}
                style={[styles.input, errors.age && styles.inputError]}
              />
            </FormField>
          </View>
        </View>

        {/* Gender Selection */}
        <FormField
          label="Gender"
          subLabel="(लिंग)"
          required
          error={errors.gender}
        >
          <View style={styles.genderRow}>
            {GENDER_OPTIONS.map((option) => {
              const isSelected = formData.gender === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => handleFieldChange("gender", option)}
                  style={[
                    styles.genderOption,
                    isSelected && styles.genderSelected,
                    Boolean(errors.gender) && !formData.gender && styles.genderErrorBorder,
                  ]}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text
                    style={[
                      styles.genderText,
                      isSelected && styles.genderSelectedText,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </FormField>

        {/* Caste & Category */}
        <View style={styles.rowTwoCols}>
          <View style={styles.colLeft}>
            <FormField
              label="Caste"
              subLabel="(जात)"
              optional
              error={errors.caste}
            >
              <TextInput
                value={formData.caste}
                onChangeText={(v) => handleFieldChange("caste", v)}
                placeholder="e.g. Maratha, Kunbi, etc."
                placeholderTextColor={COLORS.placeholder}
                autoCapitalize="words"
                style={[styles.input, errors.caste && styles.inputError]}
              />
            </FormField>
          </View>

          <View style={styles.colRight}>
            <FormField
              label="Category"
              subLabel="(श्रेणी)"
              required
              error={errors.category}
            >
              <CustomDropdown
                value={formData.category}
                options={CATEGORY_OPTIONS}
                placeholder="Select category"
                title="Category (श्रेणी)"
                hasError={Boolean(errors.category)}
                onSelect={(v) => handleFieldChange("category", v)}
              />
            </FormField>
          </View>
        </View>

        {/* Religion & Standard/Occupation */}
        <View style={styles.rowTwoCols}>
          <View style={styles.colLeft}>
            <FormField
              label="Religion"
              subLabel="(धर्म)"
              optional
              error={errors.religion}
            >
              <CustomDropdown
                value={formData.religion}
                options={RELIGION_OPTIONS}
                placeholder="Select religion"
                title="Religion (धर्म)"
                hasError={Boolean(errors.religion)}
                onSelect={(v) => handleFieldChange("religion", v)}
              />
            </FormField>
          </View>

          <View style={styles.colRight}>
            <FormField
              label="Standard / Occupation"
              subLabel="(वर्ग / व्यवसाय)"
              required
              error={errors.standardOrOccupation}
            >
              <TextInput
                value={formData.standardOrOccupation}
                onChangeText={(v) => handleFieldChange("standardOrOccupation", v)}
                placeholder="e.g. 10th / Student / Farmer"
                placeholderTextColor={COLORS.placeholder}
                style={[styles.input, errors.standardOrOccupation && styles.inputError]}
              />
            </FormField>
          </View>
        </View>
      </View>

      {/* SECTION 3: Contact & Address */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📍</Text>
          <Text style={styles.sectionTitle}>Contact & Location</Text>
        </View>

        {/* Mobile No. */}
        <FormField
          label="Mobile No."
          subLabel="(मोबाईल क्र.)"
          required
          error={errors.mobileNo}
          hint="10-digit mobile number"
        >
          <View
            style={[
              styles.phoneInputContainer,
              errors.mobileNo && styles.inputError,
            ]}
          >
            <View style={styles.countryCodeBadge}>
              <Text style={styles.countryCodeText}>+91</Text>
            </View>
            <TextInput
              value={formData.mobileNo}
              onChangeText={(v) =>
                handleFieldChange("mobileNo", v.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor={COLORS.placeholder}
              keyboardType="phone-pad"
              maxLength={10}
              style={styles.phoneInput}
            />
          </View>
        </FormField>

        {/* City / Town & District */}
        <View style={styles.rowTwoCols}>
          <View style={styles.colLeft}>
            <FormField
              label="City / Town"
              subLabel="(शहर / गाव)"
              required
              error={errors.cityTown}
            >
              <TextInput
                value={formData.cityTown}
                onChangeText={(v) => handleFieldChange("cityTown", v)}
                placeholder="City or Village"
                placeholderTextColor={COLORS.placeholder}
                autoCapitalize="words"
                style={[styles.input, errors.cityTown && styles.inputError]}
              />
            </FormField>
          </View>

          <View style={styles.colRight}>
            <FormField
              label="Dist."
              subLabel="(जिल्हा)"
              required
              error={errors.district}
            >
              <TextInput
                value={formData.district}
                onChangeText={(v) => handleFieldChange("district", v)}
                placeholder="District (e.g. Nagpur)"
                placeholderTextColor={COLORS.placeholder}
                autoCapitalize="words"
                style={[styles.input, errors.district && styles.inputError]}
              />
            </FormField>
          </View>
        </View>

        {/* Pincode & Aadhar No. */}
        <View style={styles.rowTwoCols}>
          <View style={styles.colLeft}>
            <FormField
              label="Pincode"
              subLabel="(पिन कोड)"
              required
              error={errors.pincode}
              hint="6-digit postal PIN"
            >
              <TextInput
                value={formData.pincode}
                onChangeText={(v) =>
                  handleFieldChange("pincode", v.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="6 digits"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="number-pad"
                maxLength={6}
                style={[styles.input, errors.pincode && styles.inputError]}
              />
            </FormField>
          </View>

          <View style={styles.colRight}>
            <FormField
              label="Aadhar No."
              subLabel="(आधार नं.)"
              required
              error={errors.aadharNo}
              hint="12 digits"
            >
              <TextInput
                value={formData.aadharNo}
                onChangeText={(v) =>
                  handleFieldChange("aadharNo", v.replace(/\D/g, "").slice(0, 12))
                }
                placeholder="12 digits"
                placeholderTextColor={COLORS.placeholder}
                keyboardType="number-pad"
                maxLength={12}
                style={[styles.input, errors.aadharNo && styles.inputError]}
              />
            </FormField>
          </View>
        </View>
      </View>

      {/* SECTION 4: Consent & Declaration */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📝</Text>
          <Text style={styles.sectionTitle}>Consent & Authorization (सही / संमती)</Text>
        </View>

        <Pressable
          onPress={() => handleFieldChange("consent", !formData.consent)}
          style={[
            styles.checkboxRow,
            Boolean(errors.consent) && styles.checkboxRowError,
          ]}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: formData.consent }}
        >
          <View
            style={[
              styles.checkboxBox,
              formData.consent && styles.checkboxBoxChecked,
              Boolean(errors.consent) && styles.checkboxBoxError,
            ]}
          >
            {formData.consent && (
              <Text style={styles.checkboxCheckmark}>✓</Text>
            )}
          </View>
          <Text style={styles.checkboxLabel}>
            "I hereby voluntarily consent to collect blood sample for blood test CBC as a self referral" <Text style={styles.requiredStarHighlight}>*</Text>
          </Text>
        </Pressable>

        {errors.consent && (
          <View style={styles.declarationErrorRow}>
            <Text style={styles.declarationErrorText}>
              ⚠ {errors.consent}
            </Text>
          </View>
        )}

        <View style={styles.orgContactCard}>
          <Text style={styles.contactHead}>Lokkalyan Diagnostics · Khamla, Nagpur - 25</Text>
          <Text style={styles.contactSub}>Helpline: 9112315436 / 8421943915 / 8830039758</Text>
        </View>
      </View>

      {/* Submission Buttons */}
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.submitButton,
            pressed && styles.submitButtonPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Submit and Save Record"
        >
          <Text style={styles.submitText}>Validate & Save Record</Text>
        </Pressable>

        <Pressable
          onPress={onBack}
          style={styles.cancelButton}
          accessibilityRole="button"
        >
          <Text style={styles.cancelText}>Cancel & Exit</Text>
        </Pressable>
      </View>

      <Text style={styles.bottomNote}>
        Project SUSHRUTA · Anaemia Screening Digital Record System
      </Text>

      {/* Success Modal */}
      <Modal
        visible={successModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSuccessModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <View style={styles.successIconCircle}>
              <Text style={styles.successIcon}>✓</Text>
            </View>

            <Text style={styles.successTitle}>Registration Successful!</Text>
            <Text style={styles.successSubtitle}>
              Beneficiary record successfully verified and recorded for CBC screening.
            </Text>

            {registeredSummary && (
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Full Name:</Text>
                  <Text style={styles.summaryValue}>{registeredSummary.fullName}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Institution:</Text>
                  <Text style={styles.summaryValue}>{registeredSummary.institution}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Age & Gender:</Text>
                  <Text style={styles.summaryValue}>
                    {registeredSummary.age} yrs • {registeredSummary.gender}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>DOB:</Text>
                  <Text style={styles.summaryValue}>{registeredSummary.dob}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Category:</Text>
                  <Text style={styles.summaryValue}>{registeredSummary.category}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Mobile:</Text>
                  <Text style={styles.summaryValue}>+91 {registeredSummary.mobileNo}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Aadhar No.:</Text>
                  <Text style={styles.summaryValue}>
                    XXXX-XXXX-{registeredSummary.aadharNo.slice(-4)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Location:</Text>
                  <Text style={styles.summaryValue}>
                    {registeredSummary.cityTown}, {registeredSummary.district} - {registeredSummary.pincode}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => {
                  setSuccessModalVisible(false);
                  handleReset();
                }}
                style={styles.modalPrimaryBtn}
              >
                <Text style={styles.modalPrimaryBtnText}>Register Next Person</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setSuccessModalVisible(false);
                  onBack();
                }}
                style={styles.modalSecondaryBtn}
              >
                <Text style={styles.modalSecondaryBtnText}>Return to Home</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 48,
  },
  topNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  backButton: {
    paddingVertical: 4,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "600",
  },
  resetButton: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: COLORS.badgeBackground,
  },
  resetText: {
    color: COLORS.secondaryText,
    fontSize: 13,
    fontWeight: "600",
  },
  campHeaderBanner: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    marginBottom: 14,
    elevation: 2,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  campRedPill: {
    backgroundColor: COLORS.brandRed,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  campRedPillText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  sloganText: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.brandMaroon,
    marginBottom: 6,
  },
  orgRow: {
    alignItems: "center",
  },
  orgName: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  collabText: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  projectText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.primary,
    marginTop: 2,
  },
  infoBanner: {
    backgroundColor: COLORS.badgeBackground,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  infoBannerText: {
    fontSize: 13,
    color: COLORS.badgeText,
    fontWeight: "500",
  },
  requiredStarHighlight: {
    color: COLORS.requiredStar,
    fontWeight: "700",
  },
  errorSummaryBox: {
    backgroundColor: COLORS.errorBackground,
    borderWidth: 1,
    borderColor: COLORS.errorBorder,
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },
  errorSummaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  errorSummaryIcon: {
    color: COLORS.error,
    fontSize: 16,
    marginRight: 6,
  },
  errorSummaryTitle: {
    color: COLORS.error,
    fontSize: 14,
    fontWeight: "700",
  },
  errorSummaryItem: {
    color: COLORS.error,
    fontSize: 13,
    marginLeft: 6,
    marginTop: 2,
  },
  errorSummaryMore: {
    color: COLORS.error,
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
    marginLeft: 6,
  },
  sectionCard: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.sectionHeader,
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
    minHeight: 48,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorBackground,
  },
  rowTwoCols: {
    flexDirection: "row",
    gap: 12,
  },
  colLeft: {
    flex: 1.2,
  },
  colRight: {
    flex: 1,
  },
  genderRow: {
    flexDirection: "row",
    gap: 8,
  },
  genderOption: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    minHeight: 46,
  },
  genderSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderErrorBorder: {
    borderColor: COLORS.errorBorder,
  },
  genderText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  genderSelectedText: {
    color: COLORS.white,
    fontWeight: "700",
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    minHeight: 48,
    overflow: "hidden",
  },
  countryCodeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.badgeBackground,
    borderRightWidth: 1,
    borderRightColor: COLORS.borderLight,
  },
  countryCodeText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: COLORS.text,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 6,
  },
  checkboxRowError: {
    backgroundColor: COLORS.errorBackground,
    padding: 8,
    borderRadius: 8,
  },
  checkboxBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    marginTop: 2,
  },
  checkboxBoxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxBoxError: {
    borderColor: COLORS.error,
  },
  checkboxCheckmark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "700",
  },
  checkboxLabel: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.text,
  },
  declarationErrorRow: {
    marginTop: 6,
    marginLeft: 34,
  },
  declarationErrorText: {
    color: COLORS.error,
    fontSize: 12,
    fontWeight: "500",
  },
  orgContactCard: {
    backgroundColor: COLORS.badgeBackground,
    padding: 10,
    borderRadius: 8,
    marginTop: 14,
  },
  contactHead: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.text,
  },
  contactSub: {
    fontSize: 11,
    color: COLORS.secondaryText,
    marginTop: 2,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 16,
    gap: 12,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  submitButtonPressed: {
    backgroundColor: COLORS.primaryDark,
    opacity: 0.9,
  },
  submitText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  cancelText: {
    color: COLORS.secondaryText,
    fontSize: 15,
    fontWeight: "600",
  },
  bottomNote: {
    color: COLORS.secondaryText,
    fontSize: 12,
    textAlign: "center",
    marginTop: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  successCard: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    elevation: 10,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  successIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.successBackground,
    borderWidth: 2,
    borderColor: COLORS.successBorder,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  successIcon: {
    fontSize: 30,
    color: COLORS.success,
    fontWeight: "700",
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 13,
    color: COLORS.secondaryText,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 16,
  },
  summaryBox: {
    width: "100%",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.secondaryText,
    fontWeight: "500",
  },
  summaryValue: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "600",
    maxWidth: "60%",
    textAlign: "right",
  },
  modalActions: {
    width: "100%",
    gap: 10,
  },
  modalPrimaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  modalPrimaryBtnText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  modalSecondaryBtn: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  modalSecondaryBtnText: {
    color: COLORS.secondaryText,
    fontSize: 14,
    fontWeight: "600",
  },
});
