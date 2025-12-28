import * as Haptics from "expo-haptics";
import { Pin, Trash2 } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";
import { Colors, Spacing, Typography } from "../lib/constants";
import { Entry } from "../types/entry";
import { SquircleCard } from "./ui";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface EntryCardProps {
  entry: Entry;
  onPress?: () => void;
  onDelete?: () => void;
  onTogglePin?: () => void;
}

export function EntryCard({
  entry,
  onPress,
  onDelete,
  onTogglePin,
}: EntryCardProps) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const handleDelete = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onDelete?.();
  };

  const handleTogglePin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTogglePin?.();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHrs < 24) return `${diffHrs}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Get preview (first 100 chars)
  const preview =
    entry.content.length > 100
      ? entry.content.substring(0, 100) + "..."
      : entry.content;

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
    >
      <SquircleCard variant="elevated" style={styles.card}>
        {/* Header with Pin & Time */}
        <View style={styles.header}>
          <Text style={[styles.time, { color: colors.textMuted }]}>
            {formatDate(entry.updatedAt)}
          </Text>
          <View style={styles.actions}>
            <Pressable onPress={handleTogglePin} style={styles.actionButton}>
              <Pin
                size={18}
                color={entry.isPinned ? colors.accent : colors.textMuted}
                fill={entry.isPinned ? colors.accent : "transparent"}
              />
            </Pressable>
            <Pressable onPress={handleDelete} style={styles.actionButton}>
              <Trash2 size={18} color={colors.textMuted} />
            </Pressable>
          </View>
        </View>

        {/* Content Preview */}
        <Text style={[styles.content, { color: colors.textPrimary }]}>
          {preview}
        </Text>

        {/* Tags */}
        {entry.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {entry.tags.slice(0, 3).map((tag) => (
              <View
                key={tag}
                style={[
                  styles.tag,
                  { backgroundColor: isDark ? "#262626" : "#F3F4F6" },
                ]}
              >
                <Text style={[styles.tagText, { color: colors.textMuted }]}>
                  #{tag}
                </Text>
              </View>
            ))}
            {entry.tags.length > 3 && (
              <Text style={[styles.moreTag, { color: colors.textMuted }]}>
                +{entry.tags.length - 3}
              </Text>
            )}
          </View>
        )}
      </SquircleCard>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  time: {
    fontSize: Typography.sizes.xs,
    fontWeight: "500",
  },
  actions: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  actionButton: {
    padding: Spacing.xs,
  },
  content: {
    fontSize: Typography.sizes.base,
    lineHeight: 22,
    marginBottom: Spacing.sm,
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  tag: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  tagText: {
    fontSize: Typography.sizes.xs,
  },
  moreTag: {
    fontSize: Typography.sizes.xs,
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
});
