import React, { forwardRef } from "react";
import {
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/useTheme";
import { Colors, Radius, Spacing, Typography } from "../../lib/constants";

const AnimatedView = Animated.createAnimatedComponent(View);

interface InputProps extends RNTextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = forwardRef<RNTextInput, InputProps>(
  ({ label, error, style, containerClassName, onFocus, onBlur, ...props }, ref) => {
    const { isDark } = useTheme();
    const colors = isDark ? Colors.dark : Colors.light;
    const focusProgress = useSharedValue(0);

    const handleFocus = (e: any) => {
      focusProgress.value = withSpring(1, { damping: 15 });
      onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      focusProgress.value = withSpring(0, { damping: 15 });
      onBlur?.(e);
    };

    const animatedBorderStyle = useAnimatedStyle(() => {
      const borderColor = interpolateColor(
        focusProgress.value,
        [0, 1],
        [colors.border, colors.accent]
      );
      return { borderColor };
    });

    return (
      <View style={styles.container}>
        {label && (
          <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
        )}
        <AnimatedView
          style={[
            styles.inputWrapper,
            { backgroundColor: colors.bgSecondary },
            animatedBorderStyle,
            error && { borderColor: "#EF4444" },
          ]}
        >
          <RNTextInput
            ref={ref}
            style={[
              styles.input,
              { color: colors.textPrimary },
              style,
            ]}
            placeholderTextColor={colors.textMuted}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />
        </AnimatedView>
        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = "Input";

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    fontSize: Typography.sizes.sm,
    fontWeight: "500",
    marginBottom: Spacing.xs,
  },
  inputWrapper: {
    borderRadius: Radius.lg,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  input: {
    fontSize: Typography.sizes.base,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  error: {
    color: "#EF4444",
    fontSize: Typography.sizes.xs,
    marginTop: Spacing.xs,
  },
});
