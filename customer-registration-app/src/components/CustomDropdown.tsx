import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { COLORS } from "../constants/colors";

type CustomDropdownProps = {
  value: string;
  options: readonly string[] | string[];
  placeholder?: string;
  title?: string;
  hasError?: boolean;
  onSelect: (value: string) => void;
};

export default function CustomDropdown({
  value,
  options,
  placeholder = "Select an option",
  title = "Select Option",
  hasError = false,
  onSelect,
}: CustomDropdownProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOptions = options.filter((item) =>
    item.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  function handleSelect(item: string) {
    onSelect(item);
    setModalVisible(false);
    setSearchQuery("");
  }

  function handleClose() {
    setModalVisible(false);
    setSearchQuery("");
  }

  return (
    <>
      <Pressable
        onPress={() => setModalVisible(true)}
        style={[
          styles.trigger,
          hasError && styles.triggerError,
          modalVisible && styles.triggerActive,
        ]}
        accessibilityRole="button"
        accessibilityLabel={value || placeholder}
      >
        <Text
          style={[
            styles.valueText,
            !value && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Text style={styles.chevron}>▾</Text>
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.backdrop} onPress={handleClose} />

          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <Pressable
                onPress={handleClose}
                style={styles.closeButton}
                hitSlop={8}
              >
                <Text style={styles.closeText}>✕</Text>
              </Pressable>
            </View>

            {options.length > 6 && (
              <View style={styles.searchWrapper}>
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search options..."
                  placeholderTextColor={COLORS.placeholder}
                  style={styles.searchInput}
                  clearButtonMode="while-editing"
                />
              </View>
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item}
              keyboardShouldPersistTaps="handled"
              style={styles.list}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const isSelected = item === value;
                return (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    style={({ pressed }) => [
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                      pressed && styles.optionItemPressed,
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {isSelected && (
                      <Text style={styles.checkIcon}>✓</Text>
                    )}
                  </Pressable>
                );
              }}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No matching options found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    backgroundColor: COLORS.inputBackground,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
  },
  triggerError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.errorBackground,
  },
  triggerActive: {
    borderColor: COLORS.borderFocus,
  },
  valueText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  placeholderText: {
    color: COLORS.placeholder,
  },
  chevron: {
    fontSize: 16,
    color: COLORS.secondaryText,
    marginLeft: 8,
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
    maxWidth: 420,
    maxHeight: "80%",
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingTop: 16,
    overflow: "hidden",
    elevation: 8,
    shadowColor: COLORS.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: COLORS.secondaryText,
    fontWeight: "600",
  },
  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
  },
  searchInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  list: {
    maxHeight: 360,
  },
  listContent: {
    paddingVertical: 6,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  optionItemPressed: {
    backgroundColor: COLORS.background,
  },
  optionItemSelected: {
    backgroundColor: COLORS.primaryLight,
  },
  optionText: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
  },
  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  checkIcon: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    color: COLORS.secondaryText,
    fontSize: 14,
  },
});
