import { Search, X } from "lucide-react-native";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../hooks/useTheme";
import { Colors, Radius, Spacing, Typography } from "../lib/constants";

const AnimatedView = Animated.createAnimatedComponent(View);

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Search...",
}: SearchBarProps) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const focusProgress = useSharedValue(0);

  const handleFocus = () => {
    focusProgress.value = withSpring(1, { damping: 15 });
  };

  const handleBlur = () => {
    focusProgress.value = withSpring(0, { damping: 15 });
  };

  const handleClear = () => {
    onChangeText("");
  };

  const animatedStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focusProgress.value,
      [0, 1],
      [colors.border, colors.accent]
    );
    return { borderColor };
  });

  return (
    <AnimatedView
      style={[
        styles.container,
        { backgroundColor: colors.bgSecondary },
        animatedStyle,
      ]}
    >
      <Search size={20} color={colors.textMuted} />
      <TextInput
        style={[styles.input, { color: colors.textPrimary }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        returnKeyType="search"
      />
      {value.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <X size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    gap: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.sizes.base,
    paddingVertical: 4,
  },
  clearButton: {
    padding: 4,
  },
});
