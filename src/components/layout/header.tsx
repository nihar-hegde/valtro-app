"use client";

import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
	SignedIn,
	SignedOut,
	SignInButton,
	SignUpButton,
	UserButton,
} from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export function Header() {
	const pathname = usePathname();
	const isLandingPage = pathname === "/";

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<div className="mr-6 flex items-center space-x-2">
					<Link href="/" className="flex items-center space-x-2">
						<span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
							Valtro
						</span>
					</Link>
				</div>

				{/* Navigation Menu - Only show on landing page */}
				{isLandingPage && (
					<NavigationMenu className="hidden md:flex">
						<NavigationMenuList>
							<NavigationMenuItem>
								<NavigationMenuLink
									className={cn(navigationMenuTriggerStyle(), "text-sm font-medium")}
									href="#features"
								>
									Features
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									className={cn(navigationMenuTriggerStyle(), "text-sm font-medium")}
									href="#pricing"
								>
									Pricing
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									className={cn(navigationMenuTriggerStyle(), "text-sm font-medium")}
									href="#docs"
								>
									Docs
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				)}

				{/* Spacer */}
				<div className="flex-1" />

				{/* Auth Section */}
				<div className="flex items-center space-x-2">
					<SignedOut>
						<SignInButton>
							<Button variant="ghost" size="sm">
								Login
							</Button>
						</SignInButton>
						<SignUpButton>
							<Button 
								size="sm"
								className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
							>
								Get Started
							</Button>
						</SignUpButton>
					</SignedOut>
					
					<SignedIn>
						<Button variant="ghost" size="sm" asChild>
							<Link href="/dashboard">Dashboard</Link>
						</Button>
						<UserButton
							appearance={{
								elements: {
									avatarBox: "h-8 w-8",
								},
							}}
						/>
					</SignedIn>
				</div>
			</div>
		</header>
	);
}
