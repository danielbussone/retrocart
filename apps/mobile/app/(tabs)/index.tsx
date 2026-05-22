import { useQuery } from "@apollo/client";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { HEALTH_AND_ME } from "../../src/graphql/queries";

export default function HomeScreen() {
  const { data, loading, error } = useQuery(HEALTH_AND_ME);

  const apiOk = data?.health === "ok";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>RetroCart</Text>
      <Text style={styles.subtitle}>Scaffold — API health</Text>

      {loading && <ActivityIndicator color="#e94560" />}
      {error && (
        <Text style={styles.error}>
          Cannot reach API: {error.message}
        </Text>
      )}
      {!loading && !error && (
        <View style={styles.card}>
          <Text style={styles.label}>API status</Text>
          <Text style={[styles.value, apiOk ? styles.ok : styles.bad]}>
            {apiOk ? "Connected" : "Unexpected response"}
          </Text>
          {data?.me && (
            <>
              <Text style={styles.label}>Signed in as (dev)</Text>
              <Text style={styles.value}>{data.me.email ?? data.me.id}</Text>
            </>
          )}
        </View>
      )}
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
    fontSize: 28,
    fontWeight: "700",
    color: "#eee",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  label: {
    fontSize: 12,
    color: "#888",
    textTransform: "uppercase",
  },
  value: {
    fontSize: 16,
    color: "#eee",
    marginBottom: 8,
  },
  ok: { color: "#4ecca3" },
  bad: { color: "#e94560" },
  error: {
    color: "#e94560",
    marginTop: 12,
  },
});
