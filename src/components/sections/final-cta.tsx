import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FinalCTA() {
	return (
		<section className="py-20 sm:py-24 lg:py-32">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/20 via-background to-blue-900/20 px-6 py-24 text-center shadow-2xl sm:px-16">
					{/* Background decoration */}
					<div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]" />
					
					<div className="relative mx-auto max-w-2xl">
						<h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
							Ready to Build Better Software?
						</h2>
						<p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
							Ship with confidence. Valtro gives your team the observability it needs to move fast and fix things.
						</p>
						<div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
							<Button 
								size="lg"
								className="h-12 px-8 text-base bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25"
								asChild
							>
								<Link href="/dashboard">
									Sign Up and Start Logging in Minutes
								</Link>
							</Button>
						</div>
					</div>

					{/* Glow effects */}
					<div className="absolute -top-24 right-0 -z-10 transform-gpu blur-3xl">
						<div
							className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-purple-600/30 to-blue-600/30 opacity-25"
							style={{
								clipPath: 'polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)',
							}}
						/>
					</div>
					<div className="absolute -bottom-24 left-0 -z-10 transform-gpu blur-3xl">
						<div
							className="aspect-[1404/767] w-[87.75rem] bg-gradient-to-r from-blue-600/30 to-purple-600/30 opacity-25"
							style={{
								clipPath: 'polygon(26.4% 48.3%, 8.3% 88.2%, 0% 53.6%, 2.6% 17.8%, 7.5% 15.1%, 24.3% 36%, 44.7% 52.5%, 53.5% 50.6%, 55% 37.1%, 49.7% 12.8%, 78.7% 35.9%, 99.9% 0%, 94.6% 48.9%, 78.6% 36.1%, 41.1% 99.8%, 26.4% 48.3%)',
							}}
						/>
					</div>
				</div>
			</div>
		</section>
	);
}
