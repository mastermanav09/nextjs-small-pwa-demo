import Layout from "../components/layout/layout";
import "../styles/globals.css";
import { Provider } from "next-auth/client";

// we are sending an extra request using useSession() when we are in /profile page bcoz session has already been checked in serverSideProps, so its useless to make an extra req for the same. Hence, we are using Provider Component.
// Its a recommended optimization.
function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default MyApp;
