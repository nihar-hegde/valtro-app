import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function Footer() {
	const footerLinks = {
		Product: [
			{ name: "Features", href: "#features" },
			{ name: "Pricing", href: "#pricing" },
			{ name: "Documentation", href: "#docs" },
			{ name: "API Reference", href: "#api" },
		],
		Resources: [
			{ name: "Blog", href: "/blog" },
			{ name: "Changelog", href: "/changelog" },
			{ name: "Status", href: "/status" },
			{ name: "Support", href: "/support" },
		],
		Legal: [
			{ name: "Privacy Policy", href: "/privacy" },
			{ name: "Terms of Service", href: "/terms" },
			{ name: "Cookie Policy", href: "/cookies" },
			{ name: "Security", href: "/security" },
		],
	};

	return (
		<footer className="border-t bg-muted/20">
			<div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
				<div className="xl:grid xl:grid-cols-3 xl:gap-8">
					{/* Brand section */}
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
								Valtro
							</span>
						</div>
						<p className="max-w-md text-sm text-muted-foreground">
							The clear path through your application&apos;s noise. Modern logging and error monitoring for developers who ship fast.
						</p>
						<div className="flex space-x-4">
							<Link
								href="https://github.com/valtro"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								<span className="sr-only">GitHub</span>
								<Github className="h-5 w-5" />
							</Link>
							<Link
								href="https://twitter.com/valtro"
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								<span className="sr-only">Twitter</span>
								<Twitter className="h-5 w-5" />
							</Link>
						</div>
					</div>

					{/* Links sections */}
					<div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
						<div className="md:grid md:grid-cols-2 md:gap-8">
							<div>
								<h3 className="text-sm font-semibold text-foreground">Product</h3>
								<ul className="mt-4 space-y-3">
									{footerLinks.Product.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												className="text-sm text-muted-foreground hover:text-foreground transition-colors"
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
							<div className="mt-12 md:mt-0">
								<h3 className="text-sm font-semibold text-foreground">Resources</h3>
								<ul className="mt-4 space-y-3">
									{footerLinks.Resources.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												className="text-sm text-muted-foreground hover:text-foreground transition-colors"
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
						<div className="md:grid md:grid-cols-1 md:gap-8">
							<div>
								<h3 className="text-sm font-semibold text-foreground">Legal</h3>
								<ul className="mt-4 space-y-3">
									{footerLinks.Legal.map((item) => (
										<li key={item.name}>
											<Link
												href={item.href}
												className="text-sm text-muted-foreground hover:text-foreground transition-colors"
											>
												{item.name}
											</Link>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>

				{/* Copyright section */}
				<div className="mt-12 border-t pt-8">
					<p className="text-sm text-muted-foreground text-center">
						© 2025 Valtro Inc. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}
