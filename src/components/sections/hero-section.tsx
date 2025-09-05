"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
	return (
		<section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20 py-20 sm:py-24 lg:py-32">
			{/* Background decoration */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
			
			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-4xl text-center">
					{/* Main Headline */}
					<h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
						<span className="block">Stop Deciphering.</span>
						<span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
							Start Developing.
						</span>
					</h1>

					{/* Sub-headline */}
					<p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground sm:text-xl">
						Valtro is the developer-first logging platform that turns chaotic logs and cryptic errors 
						into clear, actionable insights. Find and fix bugs faster than ever.
					</p>

					{/* CTA Buttons */}
					<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
						<Button 
							size="lg"
							className="h-12 px-8 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
							asChild
						>
							<Link href="/dashboard">
								Get Started for Free
							</Link>
						</Button>
						<p className="text-sm text-muted-foreground">
							No credit card required. Free plan for personal projects.
						</p>
					</div>

					{/* Dashboard Preview */}
					<div className="relative mx-auto mt-16 max-w-5xl">
						<div className="relative rounded-xl bg-card/50 p-2 ring-1 ring-inset ring-border backdrop-blur">
							<div className="rounded-lg bg-background shadow-2xl">
								{/* Mock Dashboard Header */}
								<div className="flex items-center gap-2 border-b px-4 py-3">
									<div className="flex space-x-1">
										<div className="h-2 w-2 rounded-full bg-red-500" />
										<div className="h-2 w-2 rounded-full bg-yellow-500" />
										<div className="h-2 w-2 rounded-full bg-green-500" />
									</div>
									<div className="flex-1 text-center">
										<span className="text-sm font-medium text-muted-foreground">
											valtro.dev/dashboard
										</span>
									</div>
								</div>
								
								{/* Mock Dashboard Content */}
								<div className="p-6">
									<div className="mb-4 flex items-center justify-between">
										<div className="h-6 w-32 rounded bg-muted animate-pulse" />
										<div className="h-8 w-24 rounded bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
									</div>
									
									<div className="space-y-3">
										<div className="flex items-center space-x-3 rounded-lg border p-3">
											<div className="h-2 w-2 rounded-full bg-red-500" />
											<div className="flex-1 space-y-1">
												<div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
												<div className="h-3 w-1/2 rounded bg-muted/60 animate-pulse" />
											</div>
											<div className="h-6 w-16 rounded bg-muted/40" />
										</div>
										
										<div className="flex items-center space-x-3 rounded-lg border p-3">
											<div className="h-2 w-2 rounded-full bg-yellow-500" />
											<div className="flex-1 space-y-1">
												<div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
												<div className="h-3 w-1/3 rounded bg-muted/60 animate-pulse" />
											</div>
											<div className="h-6 w-16 rounded bg-muted/40" />
										</div>
										
										<div className="flex items-center space-x-3 rounded-lg border p-3">
											<div className="h-2 w-2 rounded-full bg-blue-500" />
											<div className="flex-1 space-y-1">
												<div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
												<div className="h-3 w-2/5 rounded bg-muted/60 animate-pulse" />
											</div>
											<div className="h-6 w-16 rounded bg-muted/40" />
										</div>
									</div>
								</div>
							</div>
						</div>
						
						{/* Glow effect */}
						<div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl" />
					</div>
				</div>
			</div>
		</section>
	);
}
