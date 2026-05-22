import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#1a1a2e" },
        headerTintColor: "#eee",
        tabBarStyle: { backgroundColor: "#1a1a2e" },
        tabBarActiveTintColor: "#e94560",
        tabBarInactiveTintColor: "#888",
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="catalogs" options={{ title: "Catalogs" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
