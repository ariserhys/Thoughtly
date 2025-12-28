import { Sparkles } from "lucide-react-native";
import React, { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";
import { Colors, Spacing, Typography } from "../lib/constants";

export function EmptyState() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const floatY = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    floatY.value = withRepeat(
      withTiming(-8, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    rotate.value = withRepeat(
      withDelay(
        500,
        withTiming(10, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          { backgroundColor: isDark ? "#1F1F23" : "#F3F4F6" },
          iconStyle,
        ]}
      >
        <Sparkles size={32} color={colors.accent} />
      </Animated.View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Your mind is clear
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Tap + to capture your first thought
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.xl,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.base,
    textAlign: "center",
    lineHeight: 22,
  },
});
