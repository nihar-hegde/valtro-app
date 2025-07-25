const DashboardPage = () => {
	return (
		<main className="container mx-auto px-4 py-8">
			<header className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Dashboard</h1>
				<p className="text-muted-foreground">
					Welcome to your dashboard! This is a basic page with some text.
				</p>
			</header>
			<section aria-labelledby="stats-heading">
				<h2 id="stats-heading" className="text-2xl font-semibold mb-4">
					Dashboard Stats
				</h2>
				<p className="text-muted-foreground">
					Here you can add your dashboard content, charts, and data.
				</p>
			</section>
		</main>
	);
};

export default DashboardPage;
