import Image from "next/image";

export default function Home() {
	return (
		<div className="">
			<h1 className="text-4xl font-bold">Welcome to Valtro</h1>
			<p className="mt-4 text-lg">A modern, open-source logging platform.</p>
			<Image
				src="/logo.png"
				alt="Valtro Logo"
				width={150}
				height={150}
				className="mt-6"
			/>
		</div>
	);
}
