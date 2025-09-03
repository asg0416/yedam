import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "예닮부 - 장전제일교회 부부 공동체",
  description:
    "장전제일교회의 예수님을 닮아가는 부부 공동체, 예닮부에 오신 걸 환영합니다. 주일 예배, 조별모임, 가정예배, 기도모임을 통해 함께 성장하는 신앙 공동체입니다.",
  keywords:
    "예닮부, 장전제일교회, 부부 공동체, 기독교, 교회, 부산 교회, 금정구 교회, 신앙 공동체",
  authors: [{ name: "예닮부" }],
  creator: "예닮부",
  publisher: "장전제일교회",

  openGraph: {
    title: "예닮부 - 장전제일교회 부부 공동체",
    description:
      "장전제일교회의 예수님을 닮아가는 부부 공동체, 예닮부에 오신 걸 환영합니다",
    url: "https://yedam.vercel.app/",
    siteName: "예닮부",
    images: [
      {
        url: "https://static.readdy.ai/image/2eec8f2e3fea9f0e53d55920226e61ae/c2ffb7de0651f6985e610647ce0ff153.jfif",
        width: 1200,
        height: 630,
        alt: "예닮부 단체사진 - 장전제일교회 부부 공동체",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "예닮부 - 장전제일교회 부부 공동체",
    description:
      "장전제일교회의 예수님을 닮아가는 부부 공동체, 예닮부에 오신 걸 환영합니다",
    images: [
      "https://static.readdy.ai/image/2eec8f2e3fea9f0e53d55920226e61ae/c2ffb7de0651f6985e610647ce0ff153.jfif",
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
