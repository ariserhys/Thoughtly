import * as Haptics from "expo-haptics";
import { ArrowLeft, Check, Pin, Trash2 } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";
import { Colors, Radius, Spacing, Typography } from "../lib/constants";
import { Entry, EntryUpdate } from "../types/entry";

interface EntryDetailProps {
  entry: Entry;
  onClose: () => void;
  onUpdate: (id: string, data: EntryUpdate) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

export function EntryDetail({
  entry,
  onClose,
  onUpdate,
  onDelete,
  onTogglePin,
}: EntryDetailProps) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const [content, setContent] = useState(entry.content);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(entry.tags);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const contentChanged = content !== entry.content;
    const tagsChanged = JSON.stringify(tags) !== JSON.stringify(entry.tags);
    setHasChanges(contentChanged || tagsChanged);
  }, [content, tags, entry]);

  const handleSave = () => {
    if (!hasChanges) {
      onClose();
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onUpdate(entry.id, { content, tags });
    onClose();
  };

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDelete(entry.id);
    onClose();
  };

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

  const handleTogglePin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTogglePin(entry.id);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <Animated.View
      entering={SlideInRight.springify().damping(18)}
      style={[styles.container, { backgroundColor: colors.bgSecondary }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={onClose} style={styles.headerButton}>
            <ArrowLeft size={24} color={colors.textPrimary} />
          </Pressable>
          <View style={styles.headerActions}>
            <Pressable onPress={handleTogglePin} style={styles.headerButton}>
              <Pin
                size={22}
                color={entry.isPinned ? colors.accent : colors.textMuted}
                fill={entry.isPinned ? colors.accent : "transparent"}
              />
            </Pressable>
            <Pressable onPress={handleDelete} style={styles.headerButton}>
              <Trash2 size={22} color="#EF4444" />
            </Pressable>
            <Pressable
              onPress={handleSave}
              style={[
                styles.saveButton,
                { backgroundColor: hasChanges ? colors.accent : colors.border },
              ]}
            >
              <Check size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {/* Metadata */}
        <Animated.View entering={FadeIn.delay(100)} style={styles.metadata}>
          <Text style={[styles.metaText, { color: colors.textMuted }]}>
            Created {formatDate(entry.createdAt)}
          </Text>
          {entry.updatedAt !== entry.createdAt && (
            <Text style={[styles.metaText, { color: colors.textMuted }]}>
              · Edited {formatDate(entry.updatedAt)}
            </Text>
          )}
        </Animated.View>

        {/* Content */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TextInput
            style={[
              styles.contentInput,
              { color: colors.textPrimary, backgroundColor: colors.bgPrimary },
            ]}
            value={content}
            onChangeText={setContent}
            multiline
            placeholder="Write your thought..."
            placeholderTextColor={colors.textMuted}
            textAlignVertical="top"
          />

          {/* Tags */}
          <Animated.View entering={FadeIn.delay(200)} style={styles.tagsSection}>
            <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
              Tags
            </Text>
            <View style={styles.tagInputRow}>
              <TextInput
                style={[
                  styles.tagInput,
                  { color: colors.textPrimary, borderColor: colors.border },
                ]}
                placeholder="Add tag..."
                placeholderTextColor={colors.textMuted}
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleAddTag}
                returnKeyType="done"
              />
            </View>
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
                    #{tag} ×
                  </Text>
                </Pressable>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  headerButton: {
    padding: Spacing.sm,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.xs,
  },
  saveButton: {
    padding: Spacing.sm,
    borderRadius: Radius.md,
    marginLeft: Spacing.sm,
  },
  metadata: {
    flexDirection: "row",
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    flexWrap: "wrap",
  },
  metaText: {
    fontSize: Typography.sizes.xs,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  contentInput: {
    fontSize: Typography.sizes.lg,
    lineHeight: 28,
    minHeight: 200,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    marginBottom: Spacing.lg,
  },
  tagsSection: {
    marginTop: Spacing.md,
  },
  sectionLabel: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  tagInputRow: {
    marginBottom: Spacing.md,
  },
  tagInput: {
    fontSize: Typography.sizes.base,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderRadius: Radius.md,
  },
  tagsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  tagChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: Radius.sm,
  },
  tagChipText: {
    fontSize: Typography.sizes.sm,
  },
});
