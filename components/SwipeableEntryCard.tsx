import * as Haptics from "expo-haptics";
import { Pin, Trash2 } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring
} from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";
import { Colors, Spacing, Typography } from "../lib/constants";
import { Entry } from "../types/entry";
import { SquircleCard } from "./ui";

const SWIPE_THRESHOLD = 80;

interface SwipeableEntryCardProps {
  entry: Entry;
  index: number;
  onPress?: () => void;
  onDelete?: () => void;
  onTogglePin?: () => void;
}

export function SwipeableEntryCard({
  entry,
  index,
  onPress,
  onDelete,
  onTogglePin,
}: SwipeableEntryCardProps) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const translateX = useSharedValue(0);
  const scale = useSharedValue(1);
  const isDeleting = useSharedValue(false);

  const handleDelete = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onDelete?.();
  };

  const handleTogglePin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTogglePin?.();
  };

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      // Only allow swiping left (negative)
      if (e.translationX < 0) {
        translateX.value = Math.max(e.translationX, -120);
      }
    })
    .onEnd((e) => {
      if (e.translationX < -SWIPE_THRESHOLD) {
        // Trigger haptic when threshold crossed
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
        translateX.value = withSpring(-100, { damping: 15 });
      } else {
        translateX.value = withSpring(0, { damping: 15 });
      }
    });

  const tapGesture = Gesture.Tap().onEnd(() => {
    if (translateX.value < -50) {
      // Reset if swiped
      translateX.value = withSpring(0, { damping: 15 });
    } else {
      runOnJS(onPress || (() => { }))();
    }
  });

  const pressGesture = Gesture.LongPress()
    .minDuration(200)
    .onStart(() => {
      scale.value = withSpring(0.98, { damping: 15 });
    })
    .onEnd(() => {
      scale.value = withSpring(1, { damping: 15 });
    });

  const composedGesture = Gesture.Race(
    panGesture,
    Gesture.Simultaneous(tapGesture, pressGesture)
  );

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value },
    ],
  }));

  const deleteButtonStyle = useAnimatedStyle(() => ({
    opacity: Math.min(Math.abs(translateX.value) / 50, 1),
  }));

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

  const preview =
    entry.content.length > 100
      ? entry.content.substring(0, 100) + "..."
      : entry.content;

  return (
    <View style={styles.wrapper}>
      {/* Delete action behind card */}
      <Animated.View style={[styles.deleteAction, deleteButtonStyle]}>
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
          <Trash2 size={24} color="#FFFFFF" />
        </Pressable>
      </Animated.View>

      {/* Main card */}
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={cardAnimatedStyle}>
          <SquircleCard variant="elevated" style={styles.card}>
            <View style={styles.header}>
              <Text style={[styles.time, { color: colors.textMuted }]}>
                {formatDate(entry.updatedAt)}
              </Text>
              <Pressable onPress={handleTogglePin} style={styles.pinButton}>
                <Pin
                  size={16}
                  color={entry.isPinned ? colors.accent : colors.textMuted}
                  fill={entry.isPinned ? colors.accent : "transparent"}
                />
              </Pressable>
            </View>

            <Text style={[styles.content, { color: colors.textPrimary }]}>
              {preview}
            </Text>

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
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: Spacing.md,
    position: "relative",
  },
  deleteAction: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: Spacing.md,
    width: 80,
    backgroundColor: "#EF4444",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    padding: Spacing.md,
  },
  card: {
    backgroundColor: "transparent",
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
  pinButton: {
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
