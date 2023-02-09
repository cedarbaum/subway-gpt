import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content="Find NYC Subway directions with GPT-3!"
          />
          <meta property="og:site_name" content="twitterbio.com" />
          <meta
            property="og:description"
            content="Find NYC Subway directions with GPT-3!"
          />
          <meta property="og:title" content="SubwayGPT" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="SubwayGPT" />
          <meta
            name="twitter:description"
            content="Find NYC Subway directions with GPT-3!"
          />
        </Head>
        <body className="bg-black">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
