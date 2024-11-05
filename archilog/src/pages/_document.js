import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/images/favicon.ico"/>
        <link
          rel="stylesheet"
          href="https://unpkg.com/@uiw/react-md-editor/dist/mdeditor.css"
        />
      </Head>
      <title>ArchiLog</title>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
