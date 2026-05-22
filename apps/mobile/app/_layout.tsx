import { ApolloProvider } from "@apollo/client";
import { Stack } from "expo-router";
import { apolloClient } from "../src/lib/apollo";

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ApolloProvider>
  );
}
