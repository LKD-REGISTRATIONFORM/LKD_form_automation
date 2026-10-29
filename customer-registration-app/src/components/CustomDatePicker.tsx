import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { COLORS } from "../constants/colors";
import { formatDate, parseDateString } from "../utils/validation";

type CustomDatePickerProps = {
  value: string; // DD/MM/YYYY
  onChangeDate: (dateStr: string) => void;
  placeholder?: string;
  hasError?: boolean;
  maxDate?: Date;
  minDate?: Date;
  title?: string;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CustomDatePicker({
  value,
  onChangeDate,
  placeholder = "DD/MM/YYYY",
  hasError = false,
  maxDate,
  minDate,
  title = "Select Date",
}: CustomDatePickerProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const initialDate =
    parseDateString(value) ||
    (maxDate && maxDate < new Date() ? maxDate : new Date());
  const [displayYear, setDisplayYear] = useState(initialDate.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(initialDate.getMonth());
  const [showYearPicker, setShowYearPicker] = useState(false);

  function handleManualChange(text: string) {
    const cleaned = text.replace(/\D/g, "").slice(0, 8);
    let formatted = "";

    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    }

    onChangeDate(formatted);
  }

  function openModal() {
    const parsed = parseDateString(value);
    if (parsed) {
      setDisplayYear(parsed.getFullYear());
      setDisplayMonth(parsed.getMonth());
    } else if (maxDate && maxDate < new Date()) {
      setDisplayYear(maxDate.getFullYear());
      setDisplayMonth(maxDate.getMonth());
    } else {
      const now = new Date();
      setDisplayYear(now.getFullYear());
      setDisplayMonth(now.getMonth());
    }
    setShowYearPicker(false);
    setModalVisible(true);
  }

  function prevMonth() {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  }

  function nextMonth() {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  }

  function selectDay(day: number) {
    const selected = new Date(displayYear, displayMonth, day);
    onChangeDate(formatDate(selected));
    setModalVisible(false);
  }

  function selectToday() {
    const today = new Date();
    onChangeDate(formatDate(today));
    setModalVisible(false);
  }

  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(displayYear, displayMonth, 1).getDay();

  const days: Array<{ day: number | null; disabled: boolean; isSelected: boolean }> = [];

  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ day: null, disabled: false, isSelected: false });
  }

  const selectedDate = parseDateString(value);
  for (let d = 1; d <= daysInMonth; d++) {
    const current = new Date(displayYear, displayMonth, d);
    let disabled = false;

    if (maxDate) {
      const max = new Date(maxDate);
      max.setHours(23, 59, 59, 999);
      if (current > max) disabled = true;
    }

    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      if (current < min) disabled = true;
    }

    const isSelected =
      selectedDate !== null &&
      selectedDate.getFullYear() === displayYear &&
      selectedDate.getMonth() === displayMonth &&
      selectedDate.getDate() === d;

    days.push({ day: d, disabled, isSelected });
  }

  const currentYear = new Date().getFullYear();
  const startYear = minDate ? minDate.getFullYear() : 1920;
  const endYear = maxDate ? maxDate.getFullYear() : currentYear + 5;
  const yearsList: number[] = [];
  for (let y = endYear; y >= startYear; y--) {
    yearsList.push(y);
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          hasError && styles.inputError,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={handleManualChange}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          keyboardType="number-pad"
          maxLength={10}
          style={styles.textInput}
        />
        <Pressable
          onPress={openModal}
          style={styles.calendarIconButton}
          hitSlop={6}
          accessibilityLabel="Open calendar date picker"
        >
          <Text style={styles.calendarIcon}>📅</Text>
        </Pressable>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.backdrop}
            onPress={() => setModalVisible(false)}
          />

          <View style={styles.modalCard}>
            <View style={styles.headerRow}>
              <Text style={styles.modalTitle}>{title}</Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.closeBtn}
                hitSlop={6}
              >
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            <View style={styles.navRow}>
              <Pressable
                onPress={prevMonth}
                style={styles.navArrowBtn}
                hitSlop={8}
              >
                <Text style={styles.navArrow}>‹</Text>
              </Pressable>

              <View style={styles.monthYearSelector}>
                <Text style={styles.monthLabel}>
                  {MONTH_NAMES[displayMonth]}
                </Text>
                <Pressable
                  onPress={() => setShowYearPicker(!showYearPicker)}
                  style={styles.yearDropdownBtn}
                >
                  <Text style={styles.yearLabel}>{displayYear} ▾</Text>
                </Pressable>
              </View>

              <Pressable
                onPress={nextMonth}
                style={styles.navArrowBtn}
                hitSlop={8}
              >
                <Text style={styles.navArrow}>›</Text>
              </Pressable>
            </View>

            {showYearPicker ? (
              <ScrollView
                style={styles.yearScroll}
                contentContainerStyle={styles.yearScrollContent}
              >
                {yearsList.map((y) => (
                  <Pressable
                    key={y}
                    onPress={() => {
                      setDisplayYear(y);
                      setShowYearPicker(false);
                    }}
                    style={[
                      styles.yearItem,
                      y === displayYear && styles.yearItemSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.yearItemText,
                        y === displayYear && styles.yearItemTextSelected,
                      ]}
                    >
                      {y}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <>
                <View style={styles.weekdayRow}>
                  {WEEKDAY_NAMES.map((w, index) => (
                    <Text key={index} style={styles.weekdayText}>
                      {w}
                    </Text>
                  ))}
                </View>

                <View style={styles.dayGrid}>
                  {days.map((item, index) => {
                    if (item.day === null) {
                      return <View key={index} style={styles.emptyDayCell} />;
                    }

                    return (
                      <Pressable
                        key={index}
                        disabled={item.disabled}
                        onPress={() => selectDay(item.day!)}
                        style={[
                          styles.dayCell,
                          item.isSelected && styles.dayCellSelected,
                          item.disabled && styles.dayCellDisabled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dayText,
                            item.isSelected && styles.dayTextSelected,
                            item.disabled && styles.dayTextDisabled,
                          ]}
                        >
                          {item.day}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View style={styles.modalFooter}>
                  {(!maxDate || maxDate >= new Date()) &&
                    (!minDate || minDate <= new Date()) && (
                      <Pressable
                        onPress={selectToday}
                        style={styles.todayButton}
                      >
                        <Text style={styles.todayText}>Today</Text>
                      </Pressable>
                    )}
                  <Pressable
                    onPress={() => {
                      onChangeDate("");
                      setModalVisible(false);
                    }}
                    style={styles.clearButton}
                  >
                    <Text style={styles.clearText}>Clear</Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputContainer: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    minHeight: 48,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorBackground,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 12,
  },
  calendarIconButton: {
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarIcon: {
    fontSize: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.modalOverlay,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalCard: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    elevation: 8,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
  },
  closeBtn: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: COLORS.secondaryText,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  navArrowBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  navArrow: {
    fontSize: 24,
    color: COLORS.primary,
    fontWeight: "700",
  },
  monthYearSelector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  yearDropdownBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.badgeBackground,
  },
  yearLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.primary,
  },
  yearScroll: {
    maxHeight: 240,
    marginVertical: 10,
  },
  yearScrollContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  yearItem: {
    width: "28%",
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    backgroundColor: COLORS.surface,
  },
  yearItemSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  yearItemText: {
    fontSize: 14,
    color: COLORS.text,
  },
  yearItemTextSelected: {
    color: COLORS.white,
    fontWeight: "700",
  },
  weekdayRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  weekdayText: {
    width: 38,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.secondaryText,
  },
  dayGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 8,
  },
  emptyDayCell: {
    width: 38,
    height: 38,
    marginVertical: 2,
  },
  dayCell: {
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 19,
    marginVertical: 2,
  },
  dayCellSelected: {
    backgroundColor: COLORS.primary,
  },
  dayCellDisabled: {
    opacity: 0.25,
  },
  dayText: {
    fontSize: 14,
    color: COLORS.text,
  },
  dayTextSelected: {
    color: COLORS.white,
    fontWeight: "700",
  },
  dayTextDisabled: {
    color: COLORS.disabledText,
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.divider,
  },
  todayButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.primaryLight,
  },
  todayText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.primary,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearText: {
    fontSize: 13,
    color: COLORS.secondaryText,
  },
});
