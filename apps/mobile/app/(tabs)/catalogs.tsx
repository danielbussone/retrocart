import { StyleSheet, Text, View } from "react-native";

export default function CatalogsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Catalogs</Text>
      <Text style={styles.body}>
        No catalogs yet. Create catalog flow ships in a later milestone.
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
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    color: "#aaa",
    lineHeight: 22,
  },
});
