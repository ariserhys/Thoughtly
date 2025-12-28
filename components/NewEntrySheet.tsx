import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Hash, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  SlideInDown
} from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";
import { Colors, Radius, Spacing, Typography } from "../lib/constants";
import { Button } from "./ui";

interface NewEntrySheetProps {
  visible: boolean;
  onClose: () => void;
  onSave: (content: string, tags: string[]) => void;
}

export function NewEntrySheet({ visible, onClose, onSave }: NewEntrySheetProps) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSave = () => {
    if (!content.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave(content.trim(), tags);
    // Reset
    setContent("");
    setTags([]);
    onClose();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(200)}
      style={StyleSheet.absoluteFill}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <BlurView intensity={20} tint={isDark ? "dark" : "light"} style={StyleSheet.absoluteFill} />
      </Pressable>

      {/* Sheet */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <Animated.View
          entering={SlideInDown.springify().damping(18)}
          style={[
            styles.sheet,
            {
              backgroundColor: colors.bgPrimary,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={[styles.sheetTitle, { color: colors.textPrimary }]}>
              New Thought
            </Text>
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={colors.textMuted} />
            </Pressable>
          </View>

          {/* Content Input */}
          <TextInput
            style={[
              styles.contentInput,
              {
                color: colors.textPrimary,
                backgroundColor: colors.bgSecondary,
              },
            ]}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.textMuted}
            value={content}
            onChangeText={setContent}
            multiline
            autoFocus
            textAlignVertical="top"
          />

          {/* Tags Section */}
          <View style={styles.tagsSection}>
            <View style={styles.tagInputRow}>
              <Hash size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.tagInput, { color: colors.textPrimary }]}
                placeholder="Add tag"
                placeholderTextColor={colors.textMuted}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleAddTag}
                returnKeyType="done"
              />
            </View>
            {tags.length > 0 && (
              <View style={styles.tagsList}>
                {tags.map((tag) => (
                  <Pressable
                    key={tag}
                    onPress={() => handleRemoveTag(tag)}
                    style={[
                      styles.tagChip,
                      { backgroundColor: isDark ? "#262626" : "#F3F4F6" },
                    ]}
                  >
                    <Text style={[styles.tagChipText, { color: colors.textMuted }]}>
                      #{tag}
                    </Text>
                    <X size={14} color={colors.textMuted} />
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/* Save Button */}
          <Button
            title="Save Thought"
            variant="primary"
            size="lg"
            onPress={handleSave}
            disabled={!content.trim()}
          />
        </Animated.View>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: Radius.squircle,
    borderTopRightRadius: Radius.squircle,
    padding: Spacing.lg,
    paddingBottom: Spacing["2xl"],
    maxHeight: "80%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.lg,
  },
  sheetTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
  },
  closeButton: {
    padding: Spacing.xs,
  },
  contentInput: {
    fontSize: Typography.sizes.base,
    minHeight: 120,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  tagsSection: {
    marginBottom: Spacing.lg,
  },
  tagInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  tagInput: {
    flex: 1,
    fontSize: Typography.sizes.base,
    paddingVertical: Spacing.xs,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  tagChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.sm,
  },
  tagChipText: {
    fontSize: Typography.sizes.sm,
  },
});
