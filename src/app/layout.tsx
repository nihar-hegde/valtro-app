import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConditionalNavbar } from "@/components/layout/conditional-navbar";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Valtro",
	description: "Valtro. A modern, open-source logging platform.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<QueryProvider>
						<ConditionalNavbar />
						{children}
						<Toaster />
					</QueryProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
