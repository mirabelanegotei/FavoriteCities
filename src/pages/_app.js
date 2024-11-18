import "@/styles/globals.css";
import Layout from "./components/Layout";
import Head from "next/head";
import { SessionProvider, useSession } from "next-auth/react";

export default function App({ Component, pageProps }) {
  return (
  <SessionProvider session={pageProps.session}>
    <Head>
      <title>Favorite Cities</title>
    </Head>
    <AppContent Component={Component} pageProps={pageProps} />
  </SessionProvider>)
}

const AppContent = ({ Component, pageProps }) => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
};