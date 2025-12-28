import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { StatusBar } from "expo-status-bar";
import { Moon, Sun } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, { FadeIn } from "react-native-reanimated";
import { EmptyState } from "./components/EmptyState";
import { EntryDetail } from "./components/EntryDetail";
import { NewEntrySheet } from "./components/NewEntrySheet";
import { SearchBar } from "./components/SearchBar";
import { SwipeableEntryCard } from "./components/SwipeableEntryCard";
import { FloatingCapsule } from "./components/ui";
import "./global.css";
import { useEntries } from "./hooks/useEntries";
import { ThemeProvider, useTheme } from "./hooks/useTheme";
import { Colors, Spacing } from "./lib/constants";
import { Entry } from "./types/entry";

function HomeScreen() {
  const { isDark, setTheme } = useTheme();
  const colors = isDark ? Colors.dark : Colors.light;
  const {
    entries,
    isLoading,
    createEntry,
    updateEntry,
    deleteEntry,
    togglePin,
    searchEntries,
  } = useEntries();

  const [searchQuery, setSearchQuery] = useState("");
  const [isNewEntryVisible, setIsNewEntryVisible] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    return searchEntries(searchQuery);
  }, [entries, searchQuery, searchEntries]);

  const handleToggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleSaveEntry = (content: string, tags: string[]) => {
    createEntry({ content, tags });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const renderEntry = ({ item, index }: { item: Entry; index: number }) => (
    <SwipeableEntryCard
      entry={item}
      index={index}
      onPress={() => setSelectedEntry(item)}
      onDelete={() => deleteEntry(item.id)}
      onTogglePin={() => togglePin(item.id)}
    />
  );

  // Show entry detail if one is selected
  if (selectedEntry) {
    // Find the latest version of the entry (it might have been updated)
    const currentEntry = entries.find((e) => e.id === selectedEntry.id);
    if (currentEntry) {
      return (
        <EntryDetail
          entry={currentEntry}
          onClose={() => setSelectedEntry(null)}
          onUpdate={updateEntry}
          onDelete={(id) => {
            deleteEntry(id);
            setSelectedEntry(null);
          }}
          onTogglePin={togglePin}
        />
      );
    }
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.bgSecondary }]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Thoughtly
          </Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            {entries.length} thought{entries.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <Pressable onPress={handleToggleTheme} style={styles.themeButton}>
          {isDark ? (
            <Sun size={22} color={colors.textMuted} />
          ) : (
            <Moon size={22} color={colors.textMuted} />
          )}
        </Pressable>
      </Animated.View>

      {/* Search */}
      <Animated.View
        entering={FadeIn.delay(100).duration(300)}
        style={styles.searchContainer}
      >
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search thoughts..."
        />
      </Animated.View>

      {/* Entry List */}
      {entries.length === 0 && !isLoading ? (
        <EmptyState />
      ) : (
        <FlatList
          data={filteredEntries}
          renderItem={renderEntry}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={
            searchQuery ? (
              <View style={styles.noResults}>
                <Text style={[styles.noResultsText, { color: colors.textMuted }]}>
                  No thoughts match "{searchQuery}"
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {/* FAB */}
      <FloatingCapsule onPress={() => setIsNewEntryVisible(true)} />

      {/* New Entry Sheet */}
      <NewEntrySheet
        visible={isNewEntryVisible}
        onClose={() => setIsNewEntryVisible(false)}
        onSave={handleSaveEntry}
      />
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  themeButton: {
    padding: Spacing.sm,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: 100,
  },
  noResults: {
    paddingVertical: Spacing.xl,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 15,
  },
});
