import { gql } from "@apollo/client";

export const HEALTH_AND_ME = gql`
  query HealthAndMe {
    health
    me {
      id
      email
      createdAt
    }
  }
`;
