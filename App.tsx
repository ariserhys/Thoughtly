import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";
import { Button, Input, SquircleCard } from "./components/ui";
import { ThemeProvider, useTheme } from "./hooks/useTheme";
import { Colors, Spacing } from "./lib/constants";

function HomeScreen() {
  const { isDark, setTheme, theme } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bgSecondary }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Thoughtly
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            Your brain dump companion
          </Text>
        </View>

        {/* Demo Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            Components
          </Text>

          {/* Elevated Card */}
          <SquircleCard variant="elevated" style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              Elevated Card
            </Text>
            <Text style={[styles.cardText, { color: colors.textMuted }]}>
              With subtle shadow for depth
            </Text>
          </SquircleCard>

          {/* Flat Card */}
          <SquircleCard variant="flat" style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              Flat Card
            </Text>
            <Text style={[styles.cardText, { color: colors.textMuted }]}>
              With border outline
            </Text>
          </SquircleCard>

          {/* Glass Card */}
          <SquircleCard variant="glass" blur style={styles.card}>
            <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
              Glass Card
            </Text>
            <Text style={[styles.cardText, { color: colors.textMuted }]}>
              With blur effect (glassmorphism)
            </Text>
          </SquircleCard>
        </View>

        {/* Input Demo */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            Input
          </Text>
          <Input
            label="What's on your mind?"
            placeholder="Start typing..."
            multiline
          />
        </View>

        {/* Button Demos */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
            Buttons
          </Text>
          <View style={styles.buttonGroup}>
            <Button title="Primary" variant="primary" />
            <Button title="Secondary" variant="secondary" />
            <Button title="Ghost" variant="ghost" />
          </View>
          <View style={styles.buttonGroup}>
            <Button
              title={isDark ? "Light Mode" : "Dark Mode"}
              variant="secondary"
              onPress={toggleTheme}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <HomeScreen />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing["2xl"],
  },
  header: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.md,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: Spacing.xs,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  card: {
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  cardText: {
    fontSize: 15,
  },
  buttonGroup: {
    flexDirection: "row",
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    flexWrap: "wrap",
  },
});
