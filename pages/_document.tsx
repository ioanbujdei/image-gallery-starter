import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta
            name="description"
            content="Alpha.1 Exhibition"
          />
          {/* Replace this URL with your preferred thumbnail link */}
          <meta property="og:image" content="https://image-gallery-starter-phi-liard.vercel.app/_next/image?url=%2Falpha-logo.png&w=640&q=75" />
          <meta property="og:site_name" content="Alpha.1 Exhibition" />
          <meta
            property="og:description"
            content="Explore the Alpha.1 Exhibition."
          />
          <meta property="og:title" content="Alpha.1 Exhibition" />
          <meta name="twitter:card" content="summary_large_image" />
          {/* Replace this URL with your preferred thumbnail link */}
          <meta name="twitter:image" content="https://image-gallery-starter-phi-liard.vercel.app/_next/image?url=%2Falpha-logo.png&w=640&q=75" />
          <meta name="twitter:title" content="Alpha.1 Exhibition" />
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
