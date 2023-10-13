import Document, { DocumentContext, Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <meta property="og:url" key="ogurl" />
          <meta property="og:title" content="Roseite" key="ogtitle" />
          <meta property="og:type" content="article" key="ogtype" />
          <meta name="twitter:card" content="summary_large_image" key="twcard" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
