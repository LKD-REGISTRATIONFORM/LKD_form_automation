import React, { useRef, useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
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
import { FORM_STRINGS } from "../constants/strings";
import {
  calculateAgeFromDob,
  formatDate,
  FormErrors,
  validateCustomerForm,
  validateField,
} from "../utils/validation";
import { styles } from "./CustomerFormScreen.styles";

type Props = {
  onBack: () => void;
};

export default function CustomerFormScreen({ onBack }: Props) {
  const scrollViewRef = useRef<React.ElementRef<typeof ScrollView>>(null);

  const todayFormatted = formatDate(new Date());

  const [formData, setFormData] = useState<CustomerFormData>({
    ...INITIAL_FORM_DATA,
    camp_date: todayFormatted,
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
    if (field === "date_of_birth" && typeof value === "string") {
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
      camp_date: formatDate(new Date()),
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
          accessibilityLabel={FORM_STRINGS.backAccessibilityLabel}
        >
          <Text style={styles.backText}>{FORM_STRINGS.backButton}</Text>
        </Pressable>

        <Pressable
          onPress={() => {
            Alert.alert(
              FORM_STRINGS.clearAlertTitle,
              FORM_STRINGS.clearAlertMessage,
              [
                { text: FORM_STRINGS.clearAlertCancel, style: "cancel" },
                {
                  text: FORM_STRINGS.clearAlertConfirm,
                  style: "destructive",
                  onPress: handleReset,
                },
              ]
            );
          }}
          style={styles.resetButton}
          hitSlop={8}
        >
          <Text style={styles.resetText}>{FORM_STRINGS.clearAllButton}</Text>
        </Pressable>
      </View>

      {/* Camp Header Banner based on paper form */}
      <View style={styles.campHeaderBanner}>
        <View style={styles.campRedPill}>
          <Text style={styles.campRedPillText}>{FORM_STRINGS.campPillText}</Text>
        </View>

        <Text style={styles.sloganText}>{FORM_STRINGS.campSlogan}</Text>

        <View style={styles.orgRow}>
          <Text style={styles.orgName}>{FORM_STRINGS.orgName}</Text>
          <Text style={styles.collabText}>{FORM_STRINGS.orgCollab}</Text>
          <Text style={styles.projectText}>{FORM_STRINGS.orgProject}</Text>
        </View>
      </View>

      {/* Mandatory note pill */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerText}>
          {FORM_STRINGS.mandatoryNotePrefix}
          <Text style={styles.requiredStarHighlight}>*</Text>
          {FORM_STRINGS.mandatoryNoteSuffix}
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
          {Object.entries(errors)
            .slice(0, 4)
            .map(([key, err]) => (
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
          <Text style={styles.sectionTitle}>{FORM_STRINGS.section1Title}</Text>
        </View>

        {/* Date & Sr.No */}
        <View style={styles.rowTwoCols}>
          <View style={styles.colLeft}>
            <FormField
              label={FORM_STRINGS.dateLabel}
              subLabel={FORM_STRINGS.dateSubLabel}
              required
              error={errors.camp_date}
            >
              <CustomDatePicker
                value={formData.camp_date}
                onChangeDate={(v) => handleFieldChange("camp_date", v)}
                placeholder={FORM_STRINGS.dobPlaceholder}
                title={FORM_STRINGS.datePickerTitle}
                maxDate={new Date()}
                hasError={Boolean(errors.camp_date)}
              />
            </FormField>
          </View>

          <View style={styles.colRight}>
            <FormField
              label={FORM_STRINGS.srNoLabel}
              subLabel={FORM_STRINGS.srNoSubLabel}
              optional
              error={errors.sr_no}
            >
              <TextInput
                value={formData.sr_no}
                onChangeText={(v) => handleFieldChange("sr_no", v)}
                placeholder={FORM_STRINGS.srNoPlaceholder}
                placeholderTextColor={COLORS.placeholder}
                style={styles.input}
              />
            </FormField>
          </View>
        </View>

        {/* School / College / Institution */}
        <FormField
          label={FORM_STRINGS.institutionLabel}
          subLabel={FORM_STRINGS.institutionSubLabel}
          required
          error={errors.institution}
          hint={FORM_STRINGS.institutionHint}
        >
          <TextInput
            value={formData.institution}
            onChangeText={(v) => handleFieldChange("institution", v)}
            placeholder={FORM_STRINGS.institutionPlaceholder}
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
          <Text style={styles.sectionTitle}>{FORM_STRINGS.section2Title}</Text>
        </View>

        {/* Full Name */}
        <FormField
          label={FORM_STRINGS.fullNameLabel}
          subLabel={FORM_STRINGS.fullNameSubLabel}
          required
          error={errors.full_name}
          hint={FORM_STRINGS.fullNameHint}
        >
          <TextInput
            value={formData.full_name}
            onChangeText={(v) => handleFieldChange("full_name", v)}
            placeholder={FORM_STRINGS.fullNamePlaceholder}
            placeholderTextColor={COLORS.placeholder}
            autoCapitalize="words"
            style={[styles.input, errors.full_name && styles.inputError]}
          />
        </FormField>

        {/* Date of Birth & Automatic Age Calculation */}
        <View style={styles.rowTwoCols}>
          <View style={styles.colLeft}>
            <FormField
              label={FORM_STRINGS.dobLabel}
              subLabel={FORM_STRINGS.dobSubLabel}
              required
              error={errors.date_of_birth}
            >
              <CustomDatePicker
                value={formData.date_of_birth}
                onChangeDate={(v) => handleFieldChange("date_of_birth", v)}
                placeholder={FORM_STRINGS.dobPlaceholder}
                title={FORM_STRINGS.dobPickerTitle}
                maxDate={new Date()}
                hasError={Boolean(errors.date_of_birth)}
              />
            </FormField>
          </View>

          <View style={styles.colRight}>
            <FormField
              label={FORM_STRINGS.ageLabel}
              subLabel={FORM_STRINGS.ageSubLabel}
              required
              error={errors.age}
            >
              <TextInput
                value={formData.age}
                onChangeText={(v) =>
                  handleFieldChange("age", v.replace(/\D/g, "").slice(0, 3))
                }
                placeholder={FORM_STRINGS.agePlaceholder}
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
          label={FORM_STRINGS.genderLabel}
          subLabel={FORM_STRINGS.genderSubLabel}
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
              label={FORM_STRINGS.casteLabel}
              subLabel={FORM_STRINGS.casteSubLabel}
              required
              error={errors.caste}
            >
              <TextInput
                value={formData.caste}
                onChangeText={(v) => handleFieldChange("caste", v)}
                placeholder={FORM_STRINGS.castePlaceholder}
                placeholderTextColor={COLORS.placeholder}
                autoCapitalize="words"
                style={[styles.input, errors.caste && styles.inputError]}
              />
            </FormField>
          </View>

          <View style={styles.colRight}>
            <FormField
              label={FORM_STRINGS.categoryLabel}
              subLabel={FORM_STRINGS.categorySubLabel}
              required
              error={errors.category}
            >
              <CustomDropdown
                value={formData.category}
                options={CATEGORY_OPTIONS}
                placeholder={FORM_STRINGS.categoryPlaceholder}
                title={FORM_STRINGS.categoryPickerTitle}
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
              label={FORM_STRINGS.religionLabel}
              subLabel={FORM_STRINGS.religionSubLabel}
              required
              error={errors.religion}
            >
              <CustomDropdown
                value={formData.religion}
                options={RELIGION_OPTIONS}
                placeholder={FORM_STRINGS.religionPlaceholder}
                title={FORM_STRINGS.religionPickerTitle}
                hasError={Boolean(errors.religion)}
                onSelect={(v) => handleFieldChange("religion", v)}
              />
            </FormField>
          </View>

          <View style={styles.colRight}>
            <FormField
              label={FORM_STRINGS.standardOrOccupationLabel}
              subLabel={FORM_STRINGS.standardOrOccupationSubLabel}
              required
              error={errors.standard_occupation}
            >
              <TextInput
                value={formData.standard_occupation}
                onChangeText={(v) => handleFieldChange("standard_occupation", v)}
                placeholder={FORM_STRINGS.standardOrOccupationPlaceholder}
                placeholderTextColor={COLORS.placeholder}
                style={[styles.input, errors.standard_occupation && styles.inputError]}
              />
            </FormField>
          </View>
        </View>
      </View>

      {/* SECTION 3: Contact & Address */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📍</Text>
          <Text style={styles.sectionTitle}>{FORM_STRINGS.section3Title}</Text>
        </View>

        {/* Mobile No. */}
        <FormField
          label={FORM_STRINGS.mobileNoLabel}
          subLabel={FORM_STRINGS.mobileNoSubLabel}
          required
          error={errors.mobile_no}
          hint={FORM_STRINGS.mobileNoHint}
        >
          <View
            style={[
              styles.phoneInputContainer,
              errors.mobile_no && styles.inputError,
            ]}
          >
            <View style={styles.countryCodeBadge}>
              <Text style={styles.countryCodeText}>{FORM_STRINGS.countryCode}</Text>
            </View>
            <TextInput
              value={formData.mobile_no}
              onChangeText={(v) =>
                handleFieldChange("mobile_no", v.replace(/\D/g, "").slice(0, 10))
              }
              placeholder={FORM_STRINGS.mobileNoPlaceholder}
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
              label={FORM_STRINGS.cityTownLabel}
              subLabel={FORM_STRINGS.cityTownSubLabel}
              required
              error={errors.city_town}
            >
              <TextInput
                value={formData.city_town}
                onChangeText={(v) => handleFieldChange("city_town", v)}
                placeholder={FORM_STRINGS.cityTownPlaceholder}
                placeholderTextColor={COLORS.placeholder}
                autoCapitalize="words"
                style={[styles.input, errors.city_town && styles.inputError]}
              />
            </FormField>
          </View>

          <View style={styles.colRight}>
            <FormField
              label={FORM_STRINGS.districtLabel}
              subLabel={FORM_STRINGS.districtSubLabel}
              required
              error={errors.district}
            >
              <TextInput
                value={formData.district}
                onChangeText={(v) => handleFieldChange("district", v)}
                placeholder={FORM_STRINGS.districtPlaceholder}
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
              label={FORM_STRINGS.pincodeLabel}
              subLabel={FORM_STRINGS.pincodeSubLabel}
              required
              error={errors.pincode}
              hint={FORM_STRINGS.pincodeHint}
            >
              <TextInput
                value={formData.pincode}
                onChangeText={(v) =>
                  handleFieldChange("pincode", v.replace(/\D/g, "").slice(0, 6))
                }
                placeholder={FORM_STRINGS.pincodePlaceholder}
                placeholderTextColor={COLORS.placeholder}
                keyboardType="number-pad"
                maxLength={6}
                style={[styles.input, errors.pincode && styles.inputError]}
              />
            </FormField>
          </View>

          <View style={styles.colRight}>
            <FormField
              label={FORM_STRINGS.aadharNoLabel}
              subLabel={FORM_STRINGS.aadharNoSubLabel}
              required
              error={errors.aadhaar_number}
              hint={FORM_STRINGS.aadharNoHint}
            >
              <TextInput
                value={formData.aadhaar_number}
                onChangeText={(v) =>
                  handleFieldChange("aadhaar_number", v.replace(/\D/g, "").slice(0, 12))
                }
                placeholder={FORM_STRINGS.aadharNoPlaceholder}
                placeholderTextColor={COLORS.placeholder}
                keyboardType="number-pad"
                maxLength={12}
                style={[styles.input, errors.aadhaar_number && styles.inputError]}
              />
            </FormField>
          </View>
        </View>
      </View>

      {/* SECTION 4: Consent & Declaration */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>📝</Text>
          <Text style={styles.sectionTitle}>{FORM_STRINGS.section4Title}</Text>
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
            {FORM_STRINGS.consentDeclaration}{" "}
            <Text style={styles.requiredStarHighlight}>*</Text>
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
          <Text style={styles.contactHead}>{FORM_STRINGS.orgAddress}</Text>
          <Text style={styles.contactSub}>{FORM_STRINGS.orgHelpline}</Text>
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
          accessibilityLabel={FORM_STRINGS.submitAccessibilityLabel}
        >
          <Text style={styles.submitText}>{FORM_STRINGS.submitButton}</Text>
        </Pressable>

        <Pressable
          onPress={onBack}
          style={styles.cancelButton}
          accessibilityRole="button"
        >
          <Text style={styles.cancelText}>{FORM_STRINGS.cancelExitButton}</Text>
        </Pressable>
      </View>

      <Text style={styles.bottomNote}>{FORM_STRINGS.bottomFooter}</Text>

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

            <Text style={styles.successTitle}>{FORM_STRINGS.successTitle}</Text>
            <Text style={styles.successSubtitle}>
              {FORM_STRINGS.successSubtitle}
            </Text>

            {registeredSummary && (
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{FORM_STRINGS.summaryFullNameLabel}</Text>
                  <Text style={styles.summaryValue}>{registeredSummary.full_name}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{FORM_STRINGS.summaryInstitutionLabel}</Text>
                  <Text style={styles.summaryValue}>{registeredSummary.institution}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{FORM_STRINGS.summaryAgeGenderLabel}</Text>
                  <Text style={styles.summaryValue}>
                    {registeredSummary.age} yrs • {registeredSummary.gender}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{FORM_STRINGS.summaryDobLabel}</Text>
                  <Text style={styles.summaryValue}>{registeredSummary.date_of_birth}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{FORM_STRINGS.summaryCategoryLabel}</Text>
                  <Text style={styles.summaryValue}>{registeredSummary.category}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{FORM_STRINGS.summaryMobileLabel}</Text>
                  <Text style={styles.summaryValue}>
                    {FORM_STRINGS.countryCode} {registeredSummary.mobile_no}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{FORM_STRINGS.summaryAadharLabel}</Text>
                  <Text style={styles.summaryValue}>
                    XXXX-XXXX-{registeredSummary.aadhaar_number.slice(-4)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{FORM_STRINGS.summaryLocationLabel}</Text>
                  <Text style={styles.summaryValue}>
                    {registeredSummary.city_town}, {registeredSummary.district} - {registeredSummary.pincode}
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
                <Text style={styles.modalPrimaryBtnText}>{FORM_STRINGS.registerNextButton}</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setSuccessModalVisible(false);
                  onBack();
                }}
                style={styles.modalSecondaryBtn}
              >
                <Text style={styles.modalSecondaryBtnText}>{FORM_STRINGS.returnHomeButton}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
