import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { headers } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";
import Provider from "./_components/SessionProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Do it!",
  description: "Your minimal todo list",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider headers={headers()}>
          <Provider>
            <main className="overflow-none flex h-screen justify-center">
              <div className="flex h-full w-full flex-col border-x border-slate-400 md:max-w-2xl lg:max-w-4xl">
                {children}
              </div>
            </main>
          </Provider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
