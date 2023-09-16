'use client'

import { MdContentPaste, MdEmail } from "react-icons/md";
import { useEffect, useState } from "react";

export default function Home() {

	const [model, setModel] = useState('rule')
	const [modalHelp, setModalHelp] = useState(false)
	const [isValidated, setIsValidated] = useState(false)
	const [isEmpty, setIsEmpty] = useState(true)

	const [text, setText] = useState('')
	const [statusMessage, setStatusMessage] = useState('')

	useEffect(() => {
		if (text.length === 0) {
			setIsValidated(false)
			setIsEmpty(true)
		} else {
			setIsValidated(true)
			setIsEmpty(false)
		}
		setStatusMessage('')
	}, [text])


	const switchToRule = () => {
		setModel('rule')
	}

	const switchToHybrid = () => {
		setModel('hybrid')
	}

	const handlePasteText = async () => {
        const clipboardData = await navigator.clipboard.readText();
        setText(clipboardData);
    }

	const handleClearText = () => {
		setText('');
	}

	const handleSend = () => {
		
	}

	const handleEvaluate = () => {
		if(isEmpty){
			setStatusMessage('Please enter text in the field')
		} else if(!isValidated){
			setStatusMessage('The text should contain at least 2 words ')
		} else {
			fetch('http://localhost:5000/api/')
			.then(response => response.json())
			.then(data => {
				console.log(data);
				// Handle the data in your frontend
			})
			.catch(error => {
				console.error(error);
				// Handle errors gracefully
			});
		}
	}

	return (
		<main className="flex flex-col min-h-screen">
			{/* Hero Section */}
			<section className="flex flex-col h-screen bg-zinc-100">
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
							<div className="text-red-600 ">
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
							<div className="flex justify-between">
								<div className="flex text-sm font-semibold tracking-wide shadow-md shadow-gray-600 rounded-tl-md rounded-tr-md ">
									<div onClick={switchToRule} className={`p-2 w-28 text-center cursor-pointer rounded-tl-md ${model === 'rule' ? 'bg-red-700 text-white' : 'bg-gray-300 hover:bg-red-300'} `}>
										Rule-Based
									</div>
									<div onClick={switchToHybrid} className={`p-2 w-28 text-center cursor-pointer rounded-tr-md ${model === 'hybrid' ? 'bg-red-700 text-white' : 'bg-gray-300 hover:bg-red-300'} `}>
										Hybrid
									</div>
								</div>
								<div className="flex text-sm font-semibold tracking-wide shadow-md shadow-gray-600 rounded-t-md">
									<div onClick={()=>{}} className="px-3 py-2 text-white bg-blue-600 cursor-pointer hover:bg-blue-700 rounded-t-md">
										Help
									</div>
								</div>
							</div>
							{/* 2 */}
							<div className="relative flex flex-col h-full border-t-4 border-red-700 shadow-md shadow-gray-600 rounded-b-md">
								<textarea
									placeholder="Enter a text here"
									className="h-full p-3 text-sm bg-white outline-none resize-none rounded-b-md "
									value={text}
									onChange={(e)=>{setText(e.target.value)}}
								></textarea>
								{
									isEmpty && <button onClick={handlePasteText} className='absolute flex flex-col items-center gap-2 p-4 font-medium text-red-700 transform -translate-x-1/2 -translate-y-1/2 border-2 border-red-700 rounded-md top-1/2 left-1/2 hover:bg-red-700 hover:text-red-50'>
										<MdContentPaste className="text-3xl "/>
										<div className='text-xs '>Paste Text</div>
									</button>
								}
							</div>
							{/* 3 */}
							<div className={`flex items-center ${!isEmpty || statusMessage ? 'justify-between' : 'justify-end'}  pt-3 text-sm`}>
								{/* TODO: ADD CLEAR ALL BUTTON */}
								{
									!isEmpty && <button onClick={handleClearText} className={`p-2 w-28 text-gray-50 font-semibold tracking-wider ${ isValidated ? 'bg-red-700 hover:bg-red-800' : 'bg-gray-300 text-gray-700'} rounded-full shadow-sm shadow-gray-600`}>
										Clear All
									</button>
								}
								{
									statusMessage && <div className="px-3 border-l-4 border-red-700">
										{statusMessage}
									</div>
								}
								<button onClick={handleEvaluate} className={`p-2 w-28 text-gray-50 font-semibold tracking-wider ${ isValidated ? 'bg-red-700 hover:bg-red-800' : 'bg-gray-300 text-gray-700'} rounded-full shadow-sm shadow-gray-600`}>
									Evaluate
								</button>
							</div>
						</div>
					</div>
					{/* Hot Label */}
					<div className="flex justify-center gap-1 py-3 text-sm bg-zinc-200">
						<span>What is</span>
						<a href="#about" className="font-semibold text-red-700 ">
							HateShield
						</a>
						<span>?</span>
					</div>
				</div>
			</section>

			{/* About Us */}
			<section id="about" className="flex flex-col items-center gap-6 px-3 py-8 bg-zinc-100">
				<div className="flex gap-1 text-2xl font-semibold">
					<div className="">About</div>
					<div className="text-red-600">Us</div>
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
			<section id="contact" className="flex flex-col items-center h-screen gap-6 pt-8 bg-zinc-200">
				<div className="flex gap-1 text-2xl font-semibold ">
					<div className="">Contact</div>
					<div className="text-red-600">Us</div>
				</div>
				<div className="flex flex-col w-full h-full gap-3 px-3 sm:w-2/3 md:w-1/2">
					{/* Form */}
					<div className="flex flex-col gap-3">
						<div className="flex gap-2 ">
							<div className="flex flex-col w-1/2 gap-1">
								<div className="">First Name *</div>
								<input type="text" className="px-2 py-3 text-sm rounded-sm outline-none drop-shadow-md "/>
							</div>
							<div className="flex flex-col w-1/2 gap-1">
								<div className="">Last Name *</div>
								<input type="text" className="px-2 py-3 text-sm rounded-sm outline-none drop-shadow-md"/>
							</div>
						</div>
						<div className="flex flex-col gap-1">
							<div className="">Email Address *</div>
							<input type="text" className="px-2 py-3 text-sm rounded-sm outline-none drop-shadow-md"/>
						</div>
						<div className="flex flex-col gap-1">
							<div className="">Subject </div>
							<input type="text" className="px-2 py-3 text-sm rounded-sm outline-none drop-shadow-md"/>
						</div>
						<div className="flex flex-col gap-1">
							<div className="">Message *</div>
							<textarea rows={5} className="px-2 py-3 text-sm rounded-sm outline-none resize-none drop-shadow-md"/>
						</div>
						<button onClick={handleSend} className="py-2 text-sm font-medium tracking-wider text-center bg-red-700 rounded-full hover:bg-red-800 text-gray-50 drop-shadow-md">
							Send Message
						</button>
					</div>

					{/* Information */}
					<div className="">
						<div className="text-lg font-medium">Contact Information</div>
						<div className="flex items-center gap-2">
							<MdEmail className="text-3xl text-blue-600 " />
							<div className="text-sm ">
								support@hateshield.com
							</div>
						</div>
					</div>
				</div>
				{/* Footer */}
				<div className="flex flex-col items-center w-full py-2 text-sm bg-zinc-300">
					© 2023 HateShield. All Rights Reserved
				</div>
			</section>
		</main>
	)
}