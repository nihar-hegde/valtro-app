export function SocialProof() {
	const companies = [
		"Vercel",
		"Stripe", 
		"GitHub",
		"Figma",
		"Notion",
		"Linear"
	];

	return (
		<section className="border-t bg-muted/20 py-12 sm:py-16">
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-2xl text-center">
					<p className="text-sm font-semibold leading-7 text-muted-foreground">
						The Modern Stack for World-Class Engineering Teams
					</p>
				</div>
				
				<div className="mx-auto mt-8 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-6">
					{companies.map((company) => (
						<div
							key={company}
							className="col-span-1 flex justify-center opacity-60 grayscale transition-all hover:opacity-100 hover:grayscale-0"
						>
							<div className="flex h-12 items-center justify-center rounded-lg border bg-card/50 px-6 text-sm font-semibold text-muted-foreground">
								{company}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
