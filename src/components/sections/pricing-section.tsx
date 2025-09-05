import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
	const plans = [
		{
			name: "Hobby",
			description: "For personal projects",
			price: "Free",
			period: "forever",
			features: [
				"1 User",
				"7-day log retention",
				"Core features",
				"Community support",
				"Up to 10K events/month"
			],
			cta: "Get Started",
			popular: false,
		},
		{
			name: "Pro",
			description: "For growing teams",
			price: "$20",
			period: "per month",
			features: [
				"Up to 10 Users",
				"30-day log retention",
				"All core features",
				"Slack integration",
				"Up to 1M events/month",
				"Advanced search",
				"Email support"
			],
			cta: "Start Free Trial",
			popular: true,
		},
		{
			name: "Enterprise",
			description: "For large-scale applications",
			price: "Custom",
			period: "pricing",
			features: [
				"Unlimited Users",
				"1-year+ retention",
				"All features",
				"Custom Roles (RBAC)",
				"PagerDuty integration",
				"SAML SSO",
				"Dedicated support",
				"SLA guarantee"
			],
			cta: "Contact Sales",
			popular: false,
		},
	];

	return (
		<section className="bg-muted/20 py-20 sm:py-24 lg:py-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
						Simple, Transparent Pricing
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Choose the plan that fits your team&apos;s needs. Start free and scale as you grow.
					</p>
				</div>

				<div className="mx-auto mt-16 grid max-w-md grid-cols-1 gap-8 lg:max-w-4xl lg:grid-cols-3">
					{plans.map((plan) => (
						<Card
							key={plan.name}
							className={`relative flex flex-col ${
								plan.popular
									? "border-purple-500 shadow-lg shadow-purple-500/25 ring-1 ring-purple-500"
									: "border-border"
							}`}
						>
							{plan.popular && (
								<div className="absolute -top-3 left-1/2 -translate-x-1/2">
									<span className="rounded-full bg-gradient-to-r from-purple-600 to-blue-600 px-3 py-1 text-xs font-medium text-white">
										Most Popular
									</span>
								</div>
							)}
							
							<CardHeader className="pb-4">
								<CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
								<CardDescription className="text-sm">{plan.description}</CardDescription>
								<div className="mt-4">
									<span className="text-3xl font-bold tracking-tight text-foreground">
										{plan.price}
									</span>
									{plan.price !== "Custom" && (
										<span className="text-sm font-medium text-muted-foreground">
											/{plan.period}
										</span>
									)}
								</div>
							</CardHeader>
							
							<CardContent className="flex flex-1 flex-col">
								<ul className="flex-1 space-y-3">
									{plan.features.map((feature) => (
										<li key={feature} className="flex items-start gap-3">
											<Check className="h-4 w-4 shrink-0 text-green-500 mt-0.5" />
											<span className="text-sm text-muted-foreground">{feature}</span>
										</li>
									))}
								</ul>
								
								<div className="mt-8">
									<Button
										className={`w-full ${
											plan.popular
												? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
												: ""
										}`}
										variant={plan.popular ? "default" : "outline"}
										asChild
									>
										<Link href={plan.name === "Enterprise" ? "#contact" : "/dashboard"}>
											{plan.cta}
										</Link>
									</Button>
								</div>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="mx-auto mt-16 max-w-2xl text-center">
					<p className="text-sm text-muted-foreground">
						All plans include our core logging features. Need something custom?{" "}
						<Link href="#contact" className="font-medium text-purple-400 hover:text-purple-300">
							Let&apos;s talk
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
}
