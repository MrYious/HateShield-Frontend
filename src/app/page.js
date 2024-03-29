'use client'

import { MdContentPaste, MdEmail } from "react-icons/md";
import { useEffect, useState } from "react";

import { CircularProgressBar } from "react-percentage-bar";

// Hybrid == Ensemble

export default function Home() {

	const [mode, setMode] = useState('model') 			//model-help-result
	const [model, setModel] = useState('logistic') 		//logistic-hybrid
	const [isValidated, setIsValidated] = useState(false)
	const [isEmpty, setIsEmpty] = useState(true)
	const [text, setText] = useState('')
	const [statusMessage, setStatusMessage] = useState('')
	const [countChar, setCountChar] = useState(0)

	const [logisticData, setLogisticData] = useState({
		prediction: -1,
		prob_0: 0,
		prob_1: 0,
	})

	const [hybridData, setHybridData] = useState({
		display: [],

		prediction: -1,
		selected: 'none', //none-both-rule-logreg

		rule: 0,
		hateWords: [],
		hatePairs: [],
		negation_words_pair: [],
		quotations: [],

		prob_0: 0,
		prob_1: 0,
	});

	useEffect(() => {
		if (text.length === 0) {
			setIsValidated(false)
			setIsEmpty(true)
		} else {
			setIsValidated(true)
			setIsEmpty(false)
		}
		setStatusMessage('')
		setCountChar(text.length)
	}, [text])

	useEffect(() => {
		// RESET
		setLogisticData({
			prediction: -1,
			prob_0: 0,
			prob_1: 0,
		})
		setHybridData({
			display: [],

			prediction: -1,
			selected: 'none', //none-both-rule-logreg

			rule: 0,
			hateWords: [],
			hatePairs: [],
			negation_words_pair: [],
			quotations: [],

			prob_0: 0,
			prob_1: 0,
		})
	}, [model])

	const hasFiveWords = (inputString) => {
		const words = inputString.split(/\s+/).filter(word => word.trim() !== '');
		return words.length >= 5;
	}

	const displayTextSplitter = (subWords, rule) => {
		let newText = text;
		let textQuotations = [];

		if (rule === 3) {
			const pattern = /["']([^"']*)["']/g;

			newText = newText.replace(pattern, (match, group) => {
				textQuotations.push(match); // Push the matched quotation to the array
				return '(|)';
			});
		}

		subWords.forEach(subWord => {
			const regex = new RegExp(subWord, 'i'); // 'i' for case-insensitive match
			newText = newText.replace(regex, '(/)');
		});

		const splitter = newText.split('(/)')

		let lowerText = text.toLowerCase();

		let newSubWord = [];

		for (let i = 0; i < subWords.length; i++) {
			let index = lowerText.indexOf(subWords[i].toLowerCase());
			if (index !== -1) {
				newSubWord.push(text.substr(index, subWords[i].length));
			}
		}

		const resultArray = [];

		const maxLength = Math.max(splitter.length, newSubWord.length);
		for (let i = 0; i < maxLength; i++) {
			if (i < splitter.length) {
				resultArray.push([splitter[i], -1]);
			}
			if (i < newSubWord.length) {
				resultArray.push([newSubWord[i], rule]);
			}
		}

		for (let i = 0; i < resultArray.length; i++) {
			let currentArray = resultArray[i];
			let currentString = currentArray[0];

			// Replace each instance of '(|)' with the next value from textQuotations
			currentArray[0] = currentString.replace(/\(\|\)/g, () => {
				// Use the next value from textQuotations and remove it
				let replacement = textQuotations.shift();
				return replacement || ''; // Use the replacement or an empty string if textQuotations is empty
			});
		}

		return resultArray
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

	const handleSend = () => {}

	const handleEvaluate = () => {
		if(isEmpty){
			setStatusMessage('Please enter text in the field')
		} else if(!hasFiveWords(text)){
			setStatusMessage('The text should contain at least 5 words ')
		} else if(countChar > 280){
			setStatusMessage('The text should be less than 280 characters ')
		} else {
			const data = {
				text
			};

			if(model === 'logistic'){
				const url = 'http://localhost:5000/api/logistic'
				fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				})
				.then(response => {
					if (response.ok) {
						return response.json();
					} else {
						throw new Error('Request failed');
					}
				})
				.then(data => {

					setLogisticData({
						...logisticData,
						prediction: data.prediction,
						prob_0: (data.probability_0 * 100).toFixed(2),
						prob_1: (data.probability_1 * 100).toFixed(2),
					})
					setMode('result')
				})
				.catch(error => {
					// Handle any errors that occurred during the fetch
					console.error(error);
				});

			} else if(model === 'hybrid'){
				const url = 'http://localhost:5000/api/hybrid'
				fetch(url, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(data),
				})
				.then(response => {
					if (response.ok) {
						return response.json();
					} else {
						throw new Error('Request failed');
					}
				})
				.then(data => {
					let display = [];

					if (data.rule === 4) {
						let newText = text
						let pattern1 = /(?<=[a-zA-Z])\'(?=[a-zA-Z])/g;
						newText = newText.replace(pattern1, '');

						let pattern2 = /["']([^"']*)["']/g
						const textQuotations = newText.match(pattern2)
						const selectedQuotations = data.quotations.map(index => textQuotations[index]);
						display = displayTextSplitter(selectedQuotations, data.rule)

					} else if (data.rule === 3) {
						let result = [];
						let text1 = text.toLowerCase()   // Convert the input text to lowercase
						let temp = text1;
						let pairs = data.negation_words_pair.map(pair => pair.map(word => word.toLowerCase()));  // Convert negation word pairs to lowercase

						for (let i = 0; i < pairs.length; i++) {
							let startWord = pairs[i][0];
							let endWord = pairs[i][1];

							let startIndex = temp.indexOf(startWord);

							while (startIndex !== -1) {
								let endIndex = temp.indexOf(endWord, startIndex + startWord.length);

								if (endIndex !== -1) {
									let substring = text1.slice(startIndex, endIndex + endWord.length).trim();
									result.push(substring);

									// Remove the processed substring from the original text to avoid duplicates
									text1 = text1.slice(0, startIndex) + text1.slice(endIndex + endWord.length);
									temp = text1.toLowerCase(); // Update the lowercase version of the text
									console.log('TEMP', temp);
								}

								// Look for the next occurrence of the start word
								startIndex = temp.indexOf(startWord, startIndex + 1);
							}
						}

						display = displayTextSplitter(result, data.rule)

					} else if (data.rule === 2) {
						let result = [];
						let text1 = text.toLowerCase()   // Convert the input text to lowercase

						text1 = text1.replace(/"([^"]*)"/g, '');
						text1 = text1.replace(/'([^']*)'/g, '');

						let temp = text1;
						let pairs = data.hate_words_pairs.map(pair => pair.map(word => word.toLowerCase()));  // Convert negation word pairs to lowercase

						for (let i = 0; i < pairs.length; i++) {
							let startWord = pairs[i][0];
							let endWord = pairs[i][1];

							let startIndex = temp.indexOf(startWord);

							while (startIndex !== -1) {
								let endIndex = temp.indexOf(endWord, startIndex + startWord.length);

								if (endIndex !== -1) {
									let substring = text1.slice(startIndex, endIndex + endWord.length).trim();
									result.push(substring);

									// Remove the processed substring from the original text to avoid duplicates
									text1 = text1.slice(0, startIndex) + text1.slice(endIndex + endWord.length);
									temp = text1.toLowerCase(); // Update the lowercase version of the text
									console.log('TEMP', temp);
								}

								// Look for the next occurrence of the start word
								startIndex = temp.indexOf(startWord, startIndex + 1);
							}
						}

						display = displayTextSplitter(result, data.rule)

					} else if (data.rule === 1) {
						display = displayTextSplitter(data.hate_detected_words, data.rule)
					} else if (data.rule === 5) {
						display = displayTextSplitter([], data.rule)
					}

					setHybridData({
						...hybridData,

						display: display,

						prediction: data.prediction,
						selected: data.selected, //none-both-rule-logreg

						rule: data.rule,
						hateWords: data.hate_detected_words,
						hatePairs: data.hate_words_pairs,
						negation_words_pair: data.negation_words_pair,
						quotations: data.quotations,

						prob_0: (data.probability_0 * 100).toFixed(2),
						prob_1: (data.probability_1 * 100).toFixed(2),
					})

					setMode('result')
				})
				.catch(error => {
					// Handle any errors that occurred during the fetch
					console.error(error);
				});
			}
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
										Ensemble
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
													1. <b>Accessing the Tool:</b> Upon entering the website, the Hate Speech Detection Tool section will be directly shown to the users.
												</div>
												<div>
													2. <b>Text Input:</b> On the tool page, you will find a designated &quot;Text Area&quot; where you can either type or paste the text you want to evaluate for hate speech. You can input a single sentence or a longer piece of text, as needed. A requirement of at least 5 words for the input ensures the inclusion of ample features.
												</div>
												<div>
													3. <b>Model Selection:</b> The top-left corner of the tool displays a selection of available models. Simply click on the model you prefer to use in evaluating your text input.
												</div>
												<div>
													4. <b>Initiating the Evaluation:</b> Once you have entered your text and selected a model, click on the &quot;Evaluate&quot; button. This will initiate the process of analyzing the input text to detect hate-containing statements.
												</div>
												<div>
													5. <b>Processing:</b> The tool will begin processing the text through the selected model. This may take a few moments depending on the length of the text and the model&apos;s processing speed.
												</div>
												<div>
													6. <b>Results Display:</b> As soon as the evaluation is complete, the results will be displayed in a dedicated result screen. You will see whether the text is flagged for hate speech, and if so, to what degree.
												</div>
												<div>
													7. <b>Interpreting the Results:</b> The result screen will provide you with a clear indication of whether the text contains hate speech. If the result is positive, you may also receive information on specific elements within the text that triggered the detection. This information can be invaluable for understanding and addressing the issue.
												</div>
												<div>
													8. <b>Taking Action:</b> Based on the results, you can decide on an appropriate course of action. If the text is flagged for hate speech, you can use this information to moderate or address the content as necessary, contributing to a more respectful online environment.
												</div>
												<div>
													9. <b>Feedback and Refinement:</b> We highly value user feedback. If you encounter any issues, have suggestions, or would like to report false positives or negatives, please message us via the Contact Us form below. This helps us continuously improve the accuracy and effectiveness of our tool.
												</div>
											</div>
										</div>
									:
									mode === 'result'
									?
										<div className="flex flex-col p-3 overflow-y-auto text-sm text-center max-h-96">
											{
												// LOGISTIC REGRESSION MODEL
												logisticData.prediction === 1 && model === 'logistic' ?
													<>
														<div className="flex flex-col gap-2 py-2">
															<div>The following content has been detected as </div>
															<div className="flex items-center justify-center">
																<CircularProgressBar
																	percentageStyle={{
																		fontSize: "18px",
																		fontWeight: "500",
																		color: "#991b1b",
																		fontStyle:"normal",
																	}}
																	color={"#991b1b"}
																	percentage={Math.floor(logisticData.prob_1)}
																	size={"10px"}
																	radius={"40px"}
																	shadow={true}
																/>
															</div>
															<div className="py-1 text-lg font-bold text-red-700">HATE SPEECH</div>
															<div>
																The statement has been assessed and found to be containing offensive, derogatory or discriminatory language.
															</div>
														</div>
														<div className="w-full my-4 border-2 border-gray-700 rounded-md "></div>
														<div className="h-20 px-2 py-3 mx-2 overflow-y-auto text-sm text-left bg-gray-300 rounded-md shadow-inner shadow-gray-400">
															{text}
														</div>
														<div className="py-1 mx-2 text-xs text-right">
															Model: Logistic Regression
														</div>
													</>
												: logisticData.prediction === 0 && model === 'logistic' ?
													<>
														<div className="flex flex-col gap-2 py-4">
															<div>The following content has been detected as </div>
															<div className="py-1 text-lg font-bold text-green-700">NON HATE SPEECH</div>
															<div>
																The statement has been assessed and found to be free from any offensive, derogatory or discriminatory language.
															</div>
														</div>
														<div className="w-full my-4 border-2 border-gray-700 rounded-md "></div>
														<div className="h-40 px-2 py-3 mx-2 overflow-y-auto text-sm text-left bg-gray-300 rounded-md shadow-inner shadow-gray-400">
															{text}
														</div>
														<div className="py-1 mx-2 text-xs text-right">
															Model: Logistic Regression
														</div>
													</>
												:
													<></>
											}
											{
												// HYBRID CLASSIFICATION MODEL
												model === 'hybrid' ?
													<>
														<div className="flex flex-col gap-2 py-2">
															<div>The following content has been detected as</div>
															{
																(hybridData.selected === 'both' || hybridData.selected === 'logreg') && hybridData.prediction === 1  ?
																	<div className="flex items-center justify-center">
																		<CircularProgressBar
																			percentageStyle={{
																				fontSize: "18px",
																				fontWeight: "500",
																				color: "#991b1b",
																				fontStyle:"normal",
																			}}
																			color={"#991b1b"}
																			percentage={Math.floor(hybridData.prob_1)}
																			size={"10px"}
																			radius={"40px"}
																			shadow={true}
																		/>
																	</div>
																:
																	<></>
															}
															{
																hybridData.prediction === 0 ?
																	<div className="py-1 text-lg font-bold text-green-700">NON HATE SPEECH</div>
																: hybridData.prediction === 1 ?
																	<div className="text-lg font-bold text-red-700">HATE SPEECH</div>
																:
																	<></>
															}
															{
																hybridData.prediction === 0 ?
																	<div>
																		The statement has been assessed and found to be free from any offensive, derogatory or discriminatory language.
																	</div>
																: hybridData.prediction === 1 ?
																	<div>
																		The statement has been assessed and found to be containing offensive, derogatory or discriminatory language.
																	</div>
																:
																	<></>
															}
														</div>
														<div className="w-full my-4 border-2 border-gray-700 rounded-md "></div>
														<div className="h-24 px-2 py-3 mx-2 overflow-y-auto text-sm text-left bg-gray-300 rounded-md shadow-inner shadow-gray-400">
															{
																hybridData.display.map((value, index) => {
																	return value[1] === -1 ? (
																		<span className="pb-1 border-b-2 border-transparent" key={index}>{value[0]}</span>
																	) : value[1] === 1 || value[1] === 2 ? (
																		<>
																			<span key={index} className="pb-1 font-bold text-red-800 border-b-2 border-red-800 ">
																				{value[0]}
																			</span>
																		</>
																	) : value[1] === 3 || value[1] === 4 ? (
																		<>
																			<span key={index} className="pb-1 font-bold text-green-800 border-b-2 border-green-800">
																				{value[0]}
																			</span>
																		</>
																	) : <></>
																})
															}
														</div>
														<div className="py-1 mx-2 text-xs text-right">
															{
																hybridData.selected === 'both' ?
																	`Model: Ensemble - Rule [${hybridData.rule}] & Logistic`
																: hybridData.selected === 'rule' ?
																	`Model: Ensemble - Rule [${hybridData.rule}]`
																: hybridData.selected === 'logreg' ?
																	`Model: Ensemble - Logistic`
																:
																	<></>
															}
														</div>
														<div className="py-2 mx-5 text-xs">
															{
																hybridData.rule === 1 ?
																	"This rule examines the statement for the presence of words that are deemed as hate-containing."
																:
																hybridData.rule === 2 ?
																	"This rule checks for the usage of offensive words that implies hate towards other person."
																:
																hybridData.rule === 3 ?
																	"This rule checks for the usage of negation words which not necessarily suggest hate in the statements."
																:
																hybridData.rule === 4 ?
																	"This rule checks for the usage of quotations which not necessarily suggest hate in the statements."
																:
																hybridData.rule === 5 ?
																	"The default rule, the text didn't match to any rules that implies the use of hate speech"
																:
																	""
															}
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
								{
									(mode === 'model') && <div className={` ${countChar > 280 ? 'text-red-700 ' : 'text-green-700 '} absolute flex flex-col items-center gap-2 p-2 font-medium text-sm transform bottom-0 right-0 `}>
										{countChar} / 280
									</div>
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
						HateShield is research project aimed to serve as a tool to detect and identify hate-containing texts. Whether you&apos;re a content moderator, a concerned user, or a researcher, our tool provides you with a means to identify and mitigate the presence of hate speech in social media posts.
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