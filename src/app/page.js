export default function Home() {
	return (
		<main className="flex flex-col min-h-screen">
			{/* LANDING PAGE */}
			<section className="flex flex-col h-screen ">
				<nav className="flex justify-between py-1 pl-2 pr-2 bg-gray-300 sm:pl-10">
					{/* Title & Logo */}
					<div className="flex items-center gap-1">
						<div className="text-6xl">
							H
						</div>
						<div className="text-3xl ">
							HateShield
						</div>
					</div>
					{/* Buttons */}
					<div className="flex items-center gap-4 px-2 ">
						<div className="px-2 py-1 bg-gray-100 border-gray-100 cursor-pointer sm:border-b-4 hover:border-black">
							About Us
						</div>
						<div className="px-2 py-1 bg-gray-100 border-gray-100 cursor-pointer sm:border-b-4 hover:border-black">
							Contact Us
						</div>
					</div>
				</nav>
				<div className="flex flex-col h-full bg-red-100">
					{/* TITLE */}
					<div className="flex flex-col items-center gap-3 p-3 bg-gray-200">
						<div className="flex flex-col items-center text-2xl font-medium">
							<div className="text-red-500 ">
								Hate Speech
							</div>
							<div>
								Detection Tool
							</div>
						</div>
						<div className="text-sm ">
							Detects hate speech, profanity, and offensive language
						</div>
					</div>
					{/* TOOL */}
					<div className="flex flex-col h-full bg-gray-500">
						<div>
							{/* HERE */}
						</div>
					</div>
					{/* OPENER */}
					<div className="flex justify-center gap-1 py-2 text-sm bg-gray-300">
						<span>What is</span>
						<span className="text-red-600 ">
							HateShield
						</span>
						<span>?</span>
					</div>
				</div>
			</section>
			{/*  */}
			<section className="min-h-screen bg-black">
			</section>
		</main>
	)
}