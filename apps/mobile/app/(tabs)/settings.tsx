import Constants from "expo-constants";
import { StyleSheet, Text, View } from "react-native";

const devUserId =
  process.env.EXPO_PUBLIC_DEV_USER_ID ??
  "00000000-0000-4000-8000-000000000001";

const graphqlUrl =
  process.env.EXPO_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql";

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Dev user ID</Text>
        <Text style={styles.mono}>{devUserId}</Text>
        <Text style={styles.label}>GraphQL URL</Text>
        <Text style={styles.mono}>{graphqlUrl}</Text>
        <Text style={styles.label}>Expo version</Text>
        <Text style={styles.value}>
          {Constants.expoConfig?.version ?? "1.0.0"}
        </Text>
      </View>
      <Text style={styles.note}>
        Auth is deferred. Production will use Clerk or Supabase.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#16213e",
    padding: 24,
    paddingTop: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#eee",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    gap: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
    marginTop: 8,
  },
  mono: {
    fontSize: 13,
    color: "#4ecca3",
    fontFamily: "monospace",
  },
  value: {
    fontSize: 15,
    color: "#eee",
  },
  note: {
    fontSize: 13,
    color: "#888",
    lineHeight: 20,
  },
});
