import { Sparkles } from "lucide-react-native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "../hooks/useTheme";
import { Colors, Spacing, Typography } from "../lib/constants";

export function EmptyState() {
  const { isDark } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isDark ? "#1F1F23" : "#F3F4F6" },
        ]}
      >
        <Sparkles size={32} color={colors.accent} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary }]}>
        Your mind is clear
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>
        Tap + to capture your first thought
      </Text>
    </View>
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
