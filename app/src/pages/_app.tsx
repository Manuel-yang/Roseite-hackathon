import type { AppProps } from "next/app";
import { ToastContainer } from "react-toastify";

// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import "react-toastify/dist/ReactToastify.css";
import "../styles/globals.css";

// Day.js
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import AppContext from "../contexts";
import Head from "next/head";

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContext>
      <>
        <Head>
          <title>Roseite</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
        <Component {...pageProps} />
        <ToastContainer />
      </>
    </AppContext>
  );
}

export default MyApp;
