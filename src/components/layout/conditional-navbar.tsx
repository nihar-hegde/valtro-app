"use client";

import { Header } from "./header";

export function ConditionalNavbar() {
	// Use unified header everywhere - it adapts to auth state automatically
	return <Header />;
}
