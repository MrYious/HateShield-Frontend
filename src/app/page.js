'use client'

import { MdContentPaste, MdEmail } from "react-icons/md";

import { useState } from "react";

export default function Home() {

	const [model, setModel] = useState('rule')
	const [modalHelp, setModalHelp] = useState(false)

	const switchToRule = () => {
		setModel('rule')
	}

	const switchToHybrid = () => {
		setModel('hybrid')
	}

	return (
		<main className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="flex flex-col h-screen bg-gray-100">
				{/* Horizontal Nav Bar */}
				<nav className="flex justify-between py-1 pl-2 pr-2 sm:pl-10">
					{/* Title & Logo */}
					<div className="flex items-center gap-1 ">
						<div className="text-6xl font-semibold text-red-600">
							H
						</div>
						<div className="text-3xl">
							HateShield
						</div>
					</div>
					{/* Buttons */}
					<div className="flex items-center gap-4 px-2 ">
						<a href="#about" className="px-2 py-1 cursor-pointer border-neutral-100 sm:border-b-4 hover:border-red-600">
							About Us
						</a>
						<a href="#contact" className="px-2 py-1 cursor-pointer border-neutral-100 sm:border-b-4 hover:border-red-600">
							Contact Us
						</a>
					</div>
				</nav>
				{/* Body */}
				<div className="flex flex-col h-full">
					{/* Title */}
					<div className="flex flex-col items-center gap-3 p-3">
						<div className="flex flex-col items-center text-3xl font-medium">
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
					{/* Tool */}
					<div className="flex flex-col items-center h-full p-3">
						<div className="flex flex-col w-full h-full sm:w-2/3 md:w-1/2">
							{/* 1 */}
							{/* TODO: CREATE STATES FOR THESE */}
							<div className="flex justify-between">
								<div className="flex text-sm shadow-md shadow-gray-600 rounded-tl-md rounded-tr-md ">
									<div onClick={switchToRule} className={`p-2 w-28 text-center cursor-pointer rounded-tl-md ${model === 'rule' ? 'bg-red-400' : 'bg-gray-300 hover:bg-red-500'} `}>
										Rule-Based
									</div>
									<div onClick={switchToHybrid} className={`p-2 w-28 text-center cursor-pointer rounded-tr-md ${model === 'hybrid' ? 'bg-red-400' : 'bg-gray-300 hover:bg-red-500'} `}>
										Hybrid
									</div>
								</div>
								<div className="flex text-sm shadow-md shadow-gray-600">
									<div className="px-3 py-2 bg-blue-300 cursor-pointer hover:bg-blue-400">
										Help
									</div>
								</div>
							</div>
							{/* 2 */}
							<div className="relative flex flex-col h-full border-t-4 border-red-400 shadow-md shadow-gray-600 rounded-b-md">
								<textarea
									placeholder="Enter a text here"
									className="h-full p-3 text-sm bg-white outline-none resize-none rounded-b-md "
								></textarea>
								<button className='absolute top-1/2 left-1/2 gap-2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center p-4 text-blue-900 border-[1px] border-blue-800 hover:bg-blue-800 rounded-md hover:text-blue-50'>
                                    <MdContentPaste className="text-3xl "/>
                                    <div className='text-xs '>Paste Text</div>
                                </button>
							</div>
							{/* 3 */}
							<div className="flex justify-end pt-3 text-sm">
								<div className="px-8 py-2 bg-gray-200 rounded-full">
									Evaluate
								</div>
							</div>
						</div>
					</div>
					{/* Opener */}
					<div className="flex justify-center gap-1 py-3 text-sm bg-zinc-300">
						<span>What is</span>
						<span className="text-red-600 ">
							HateShield
						</span>
						<span>?</span>
					</div>
				</div>
			</section>

			{/* About Us */}
			<section id="about" className="flex flex-col items-center gap-3 px-3 py-8 bg-gray-400">
				<div className="text-2xl font-semibold ">
					About Us
				</div>
				<div className="flex flex-col w-full gap-3 text-sm sm:w-2/3 md:w-1/2">
					<div className="text-center ">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum molestias aliquid modi illum impedit tempora quis magnam dicta fugit aspernatur. Est, aspernatur impedit cupiditate ab corporis numquam voluptatum vero sunt?
					</div>
					<div className="text-center ">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cum molestias aliquid modi illum impedit tempora quis magnam dicta fugit aspernatur. Est, aspernatur impedit cupiditate ab corporis numquam voluptatum vero sunt?
					</div>
				</div>
			</section>

			{/* Contact Us & Footer */}
			<section id="contact" className="flex flex-col items-center h-screen gap-3 pt-8 bg-gray-500">
				<div className="text-2xl font-semibold ">
					Contact Us
				</div>
				<div className="flex flex-col w-full h-full gap-3 px-3 sm:w-2/3 md:w-1/2">
					{/* Form */}
					<div className="flex flex-col gap-3">
						<div className="flex gap-2 ">
							<div className="flex flex-col w-1/2 gap-1">
								<div className="">First Name *</div>
								<input type="text" className="px-2 py-3 text-sm rounded-sm outline-none"/>
							</div>
							<div className="flex flex-col w-1/2 gap-1">
								<div className="">Last Name *</div>
								<input type="text" className="px-2 py-3 text-sm rounded-sm outline-none"/>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<div className="">Email Address *</div>
							<input type="text" className="px-2 py-3 text-sm rounded-sm outline-none"/>
						</div>
						<div className="flex flex-col gap-1">
							<div className="">Subject </div>
							<input type="text" className="px-2 py-3 text-sm rounded-sm outline-none"/>
						</div>
						<div className="flex flex-col gap-1">
							<div className="">Message *</div>
							<textarea rows={5} className="px-2 py-3 text-sm rounded-sm outline-none resize-none"/>
						</div>
						<div className="py-2 text-sm text-center bg-gray-200 rounded-full">
							Send Message
						</div>
					</div>

					{/* Information */}
					<div className="">
						<div className="text-lg font-medium">Contact Information</div>
						<div className="flex items-center gap-2">
							<MdEmail className="text-3xl " />
							<div className="text-sm ">
								support@hateshield.com
							</div>
						</div>
					</div>
				</div>
				{/* Footer */}
				<div className="flex flex-col items-center w-full py-2 text-sm bg-red-200">
					© 2023 HateShield. All Rights Reserved
				</div>
			</section>
		</main>
	)
}