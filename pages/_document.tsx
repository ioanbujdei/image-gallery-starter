import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Alpha.1 Fine Art Exhibition Gallery."
          />
          <meta property="og:site_name" content="Alpha.1 Exhibition" />
          <meta
            property="og:description"
            content="Explore the Alpha.1 Exhibition gallery."
          />
          <meta property="og:title" content="Alpha.1 Exhibition" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Alpha.1 Exhibition" />
          <meta
            name="twitter:description"
            content="Explore the Alpha.1 Exhibition gallery."
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
