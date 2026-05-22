import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

const graphqlUrl =
  process.env.EXPO_PUBLIC_GRAPHQL_URL ?? "http://localhost:4000/graphql";

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: graphqlUrl,
    headers: {
      "X-Dev-User-Id":
        process.env.EXPO_PUBLIC_DEV_USER_ID ??
        "00000000-0000-4000-8000-000000000001",
    },
  }),
  cache: new InMemoryCache(),
});
