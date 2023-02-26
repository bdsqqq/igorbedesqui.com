import { Providers } from "./Providers";
const DocumentStuff = () => {
  return (
    <>
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon/favicon-16x16.png"
      />
      <link rel="manifest" href="favicon/site.webmanifest" />
      <link
        rel="mask-icon"
        href="/favicon/safari-pinned-tab.svg"
        color="#0A0A0A"
      />
      <meta name="msapplication-TileColor" content="#0A0A0A" />
      <meta name="theme-color" content="#0A0A0A" />

      <script
        async
        defer
        data-website-id="a0b7ea4d-eb6c-4e04-8450-00228ac796fb"
        src="https://analytics.igorbedesqui.com/umami.js"
      ></script>
    </>
  );
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <DocumentStuff />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
