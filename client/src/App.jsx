// Router
import { Outlet } from "react-router-dom";

// Apollo Imports
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Component Imports
import Nav from "./components/Nav";

// Connecting to Apollo
const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  console.log("Token from localStorage:", token);
  if (token) {
    console.log(`Bearer ${token}`);
  }
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Nav />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
export { client };
