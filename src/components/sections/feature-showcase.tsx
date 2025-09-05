import { Monitor, Zap, Search } from "lucide-react";

export function FeatureShowcase() {
	const features = [
		{
			icon: Monitor,
			title: "See the Full Story Behind Every Bug",
			description: "Don't just read an error message. With Valtro's session replay, you can watch the exact sequence of user clicks, network requests, and console events that led to the issue. It's the ultimate context for faster debugging.",
			visual: (
				<div className="relative overflow-hidden rounded-lg border bg-card">
					<div className="p-4">
						<div className="mb-3 flex items-center gap-2">
							<div className="h-3 w-3 rounded-full bg-red-500" />
							<span className="text-sm font-medium">Session Replay</span>
						</div>
						<div className="grid grid-cols-2 gap-4">
							<div className="space-y-2">
								<div className="aspect-video rounded border bg-muted/50 flex items-center justify-center">
									<Monitor className="h-8 w-8 text-muted-foreground" />
								</div>
								<div className="text-xs text-muted-foreground">User Session</div>
							</div>
							<div className="space-y-2">
								<div className="space-y-1">
									<div className="flex items-center gap-2 text-xs">
										<div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
										<span>Click: Login Button</span>
									</div>
									<div className="flex items-center gap-2 text-xs">
										<div className="h-1.5 w-1.5 rounded-full bg-green-500" />
										<span>Network: POST /auth</span>
									</div>
									<div className="flex items-center gap-2 text-xs">
										<div className="h-1.5 w-1.5 rounded-full bg-red-500" />
										<span>Error: 500 Internal</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		},
		{
			icon: Zap,
			title: "From Log Tsunami to Actionable Issues",
			description: "Our intelligent fingerprinting algorithm groups thousands of noisy, repetitive error events into one clean issue. Instantly see the impact, the number of affected users, and the timeline of a bug without the clutter.",
			visual: (
				<div className="relative overflow-hidden rounded-lg border bg-card">
					<div className="p-4">
						<div className="mb-3 flex items-center gap-2">
							<Zap className="h-4 w-4 text-yellow-500" />
							<span className="text-sm font-medium">Intelligent Grouping</span>
						</div>
						<div className="space-y-3">
							<div className="flex items-center justify-between rounded border p-2">
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 rounded-full bg-red-500" />
									<span className="text-sm">Database Connection Error</span>
								</div>
								<div className="rounded bg-red-100 px-2 py-1 text-xs text-red-800 dark:bg-red-900 dark:text-red-200">
									1,247 events
								</div>
							</div>
							<div className="flex items-center justify-between rounded border p-2">
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 rounded-full bg-yellow-500" />
									<span className="text-sm">API Rate Limit</span>
								</div>
								<div className="rounded bg-yellow-100 px-2 py-1 text-xs text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
									523 events
								</div>
							</div>
							<div className="flex items-center justify-between rounded border p-2">
								<div className="flex items-center gap-2">
									<div className="h-2 w-2 rounded-full bg-blue-500" />
									<span className="text-sm">Validation Failed</span>
								</div>
								<div className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900 dark:text-blue-200">
									89 events
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		},
		{
			icon: Search,
			title: "Query Your Logs Like a Database",
			description: "Find exactly what you're looking for, instantly. Our search supports deep filtering on any field, including your custom JSON metadata. Trace requests across services with a single query.",
			visual: (
				<div className="relative overflow-hidden rounded-lg border bg-card">
					<div className="p-4">
						<div className="mb-3 flex items-center gap-2">
							<Search className="h-4 w-4 text-blue-500" />
							<span className="text-sm font-medium">Lightning Search</span>
						</div>
						<div className="space-y-2">
							<div className="rounded border bg-muted/50 p-2">
								<div className="text-xs font-mono text-muted-foreground">
									level:error user.id:&quot;12345&quot; correlation_id:*
								</div>
							</div>
							<div className="space-y-1">
								<div className="rounded border-l-2 border-l-red-500 bg-muted/30 p-2 text-xs">
									<div className="font-medium">Authentication failed</div>
									<div className="text-muted-foreground">user.id: 12345, correlation_id: abc-123</div>
								</div>
								<div className="rounded border-l-2 border-l-red-500 bg-muted/30 p-2 text-xs">
									<div className="font-medium">Database timeout</div>
									<div className="text-muted-foreground">user.id: 12345, correlation_id: abc-123</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			)
		}
	];

	return (
		<section className="py-20 sm:py-24 lg:py-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
						Stop Debugging in the Dark
					</h2>
					<p className="mt-4 text-lg text-muted-foreground">
						Get the full context behind every issue with tools built for modern development workflows
					</p>
				</div>

				<div className="mt-16 space-y-20 lg:mt-20">
					{features.map((feature, index) => {
						const Icon = feature.icon;
						const isReversed = index % 2 === 1;
						
						return (
							<div
								key={feature.title}
								className={`grid gap-8 lg:grid-cols-2 lg:gap-16 ${
									isReversed ? "lg:grid-flow-col-dense" : ""
								}`}
							>
								<div className={`flex flex-col justify-center ${
									isReversed ? "lg:col-start-2" : ""
								}`}>
									<div className="mb-4 inline-flex items-center rounded-lg bg-gradient-to-r from-purple-600/10 to-blue-600/10 p-2 w-fit">
										<Icon className="h-6 w-6 text-purple-400" />
									</div>
									<h3 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
										{feature.title}
									</h3>
									<p className="mt-4 text-lg text-muted-foreground">
										{feature.description}
									</p>
								</div>
								
								<div className={`flex items-center justify-center ${
									isReversed ? "lg:col-start-1" : ""
								}`}>
									{feature.visual}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
