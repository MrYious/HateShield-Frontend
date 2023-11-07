'use client'

import { MdContentPaste, MdEmail } from "react-icons/md";
import { useEffect, useState } from "react";

export default function Home() {

	const [mode, setMode] = useState('model') //model-help-result
	const [model, setModel] = useState('logistic') //logistic-hybrid
	const [isValidated, setIsValidated] = useState(false)
	const [isEmpty, setIsEmpty] = useState(true)
	const [result, setResult] = useState('none') //none-hate-nonhate

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

	const hasFiveWords = (inputString) => {
		const words = inputString.split(/\s+/).filter(word => word.trim() !== '');
		return words.length >= 5;
	}

	const switchToLogistic= () => {
		setMode('model')
		setModel('logistic')
	}

	const switchToHybrid = () => {
		setMode('model')
		setModel('hybrid')
	}

	const switchToHelp = () => {
		setMode('help')
		setText('')
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
		} else if(!hasFiveWords(text)){
			setStatusMessage('The text should contain at least 5 words ')
		} else {
			setResult('none')
			setMode('result')
			if(model === 'rule'){
				setResult('nonhate')
			} else if(model === 'hybrid'){
				setResult('hate')
			}
			// fetch('http://localhost:5000/api/')
			// .then(response => response.json())
			// .then(data => {
			// 	console.log(data);
			// })
			// .catch(error => {
			// 	console.error(error);
			// });
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
							Detects hate speech, profanity, and offensive language in Tagalog-written contents
						</div>
					</div>
					{/* Tool */}
					<div className="flex flex-col items-center h-full p-3">
						<div className="flex flex-col w-full h-full sm:w-2/3 md:w-1/2">
							{/* 1 */}
							<div className="flex justify-between">
								<div className="flex text-sm font-semibold tracking-wide shadow-md shadow-gray-600 rounded-tl-md rounded-tr-md ">
									<div onClick={switchToLogistic} className={`p-2 w-52 w w text-center cursor-pointer rounded-tl-md ${mode !== 'help' && model === 'logistic' ? 'bg-red-700 text-white' : 'bg-gray-300 hover:bg-red-300'} `}>
										Logistic Regression
									</div>
									<div onClick={switchToHybrid} className={`p-2 w-28 text-center cursor-pointer rounded-tr-md ${mode !== 'help' && model === 'hybrid' ? 'bg-red-700 text-white' : 'bg-gray-300 hover:bg-red-300'} `}>
										Hybrid
									</div>
								</div>
								<div className="flex text-sm font-semibold tracking-wide shadow-md shadow-gray-600 rounded-t-md">
									<div onClick={switchToHelp} className={`px-3 py-2 ${model !== 'help' && ' hover:bg-blue-700'} text-white bg-blue-600 cursor-pointer  rounded-t-md`}>
										Help
									</div>
								</div>
							</div>
							{/* 2 */}
							<div className={`relative flex flex-col h-full border-t-4 ${mode !== 'help'? 'border-red-700' : 'border-blue-600'} shadow-md shadow-gray-600 rounded-b-md`}>
								{
									mode === 'model'
									?
										<textarea
											placeholder="Enter text here"
											className="h-full p-3 text-sm leading-relaxed bg-white outline-none resize-none rounded-b-md"
											value={text}
											onChange={(e)=>{setText(e.target.value)}}
										></textarea>
									:
									mode === 'help'
									?
										<div className="flex flex-col gap-2 p-3 overflow-y-scroll text-sm max-h-96">
											<div className="py-2 text-base font-semibold tracking-wider text-center">
												INSTRUCTIONS
											</div>
											<div className="flex flex-col gap-2 leading-relaxed text-justify sm:leading-loose">
												<div>
													1. <b>Accessing the Tool:</b> To get started, visit our website and navigate to the hate speech detection tool page.
												</div>
												<div>
													2. <b>Text Input:</b> On the tool page, you will find a designated "Text Area" where you can either type or paste the text you want to evaluate for hate speech. You can input a single sentence or a longer piece of text, as needed.
												</div>
												<div>
													3. <b>Model Selection:</b> You will see a list of available models as tabs. Simply click on the model you prefer to use for your evaluation.
												</div>
												<div>
													4. <b>Initiating the Evaluation:</b> Once you have entered your text and selected a model, click on the "Evaluate" button. This will initiate the process of analyzing the input text to detect any hate-containing statements.
												</div>
												<div>
													5. <b>Processing:</b> The tool will begin processing the text through the selected model. This may take a few moments depending on the length of the text and the model's processing speed.
												</div>
												<div>
													6. <b>Results Display:</b> As soon as the evaluation is complete, the results will be displayed in a dedicated result screen. You will see whether the text is flagged for hate speech, and if so, to what degree. Additionally, you may receive insights or suggestions based on the model's analysis.
												</div>
												<div>
													7. <b>Interpreting the Results:</b> The result screen will provide you with a clear indication of whether the text contains hate speech. If the result is affirmative, you may also receive information on specific elements within the text that triggered the detection. This information can be invaluable for understanding and addressing the issue.
												</div>
												<div>
													8. <b>Taking Action:</b> Based on the results, you can decide on an appropriate course of action. If the text is flagged for hate speech, you can use this information to moderate or address the content as necessary, contributing to a more respectful online environment.
												</div>
												<div>
													9. <b>Feedback and Refinement:</b> We highly value user feedback. If you encounter any issues, have suggestions, or would like to report false positives or negatives, please contact us. This helps us continuously improve the accuracy and effectiveness of our tool.
												</div>
											</div>
										</div>
									:
									mode === 'result'
									?
										<div className="flex flex-col h-full p-3 text-sm text-center">
											{
												result === 'hate' ?
													<>
														{/* DO HERE */}
														<div className="pb-2 text-lg font-bold text-left text-gray-800">EVALUATION RESULT</div>
														<div className="flex items-center gap-2">
															<div>The tool detected the given content as</div>
															<div className="text-lg font-bold text-red-700">HATE SPEECH</div>
														</div>
														<div className="w-full my-4 border-2 border-gray-700 rounded-md "></div>
														<div className="mb-2 text-left">The highlighted words are identified as offensive, derogatory words or slurs.  </div>
														<div className="px-2 py-3 text-sm text-left bg-gray-300 rounded-md shadow-inner justify-left items-left shadow-gray-400">
															{text}
														</div>
													</>
												: result === 'nonhate' ?
													<>
														<div className="pb-3 text-lg font-bold text-left text-gray-800">EVALUATION RESULT</div>
														<div className="px-2 py-3 mx-2 text-sm text-left bg-gray-300 rounded-md shadow-inner justify-left items-left shadow-gray-400">
															{text}
														</div>
														<div className="w-full my-4 border-2 border-gray-700 rounded-md "></div>
														<div className="">The following content has been detected as </div>
														<div className="py-1 text-lg font-bold text-green-700">NON HATE SPEECH</div>
														<div>
															The statement has been assessed and found to be free from any offensive or derogatory language or content.
														</div>
													</>
												:
													<></>
											}
										</div>
									:
										<></>
								}
								{
									(isEmpty && mode === 'model') && <button onClick={handlePasteText} className='absolute flex flex-col items-center gap-2 p-4 font-medium text-red-700 transform -translate-x-1/2 -translate-y-1/2 border-2 border-red-700 rounded-md top-1/2 left-1/2 hover:bg-red-700 hover:text-red-50'>
										<MdContentPaste className="text-3xl "/>
										<div className='text-xs '>Paste Text</div>
									</button>
								}
							</div>
							{/* 3 */}
							{
								mode === 'model' && <div className={`flex items-center ${!isEmpty || statusMessage ? 'justify-between' : 'justify-end'}  pt-3 text-sm`}>
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
							}
							
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
						HateShield is research project aimed to serve as a tool to detect and identify hate-containing texts. Whether you're a content moderator, a concerned user, or a researcher, our tool provides you with a means to identify and mitigate the presence of hate speech in social media posts.
					</div>
					<div className="text-center ">
						We are a passionate team of researchers and our primary goal is to contribute to a safer and more inclusive online environment by enabling the identification and removal of hate-containing statements, fostering a space where users can express themselves freely and respectfully.
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