import { BlurView } from "expo-blur";
import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { useTheme } from "../../hooks/useTheme";
import { Colors, Radius } from "../../lib/constants";

interface SquircleCardProps extends ViewProps {
  blur?: boolean;
  intensity?: number;
  variant?: "elevated" | "flat" | "glass";
  children: React.ReactNode;
}

export function SquircleCard({
  blur = false,
  intensity = 50,
  variant = "elevated",
  children,
  style,
  ...props
}: SquircleCardProps) {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const cardStyle = [
    styles.base,
    {
      backgroundColor:
        variant === "glass"
          ? isDark
            ? "rgba(23, 23, 23, 0.7)"
            : "rgba(255, 255, 255, 0.7)"
          : colors.bgPrimary,
      borderColor: colors.border,
    },
    variant === "elevated" && styles.elevated,
    variant === "flat" && styles.flat,
    style,
  ];

  if (blur && variant === "glass") {
    return (
      <BlurView
        intensity={intensity}
        tint={isDark ? "dark" : "light"}
        style={[cardStyle, styles.blurContainer]}
        {...props}
      >
        <View style={styles.content}>{children}</View>
      </BlurView>
    );
  }

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.squircle,
    padding: 16,
    overflow: "hidden",
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  flat: {
    borderWidth: 1,
  },
  blurContainer: {
    overflow: "hidden",
  },
  content: {
    flex: 1,
  },
});
