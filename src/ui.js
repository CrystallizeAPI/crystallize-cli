'use strict';

const React = require('react');
const importJsx = require('import-jsx');
const { Box, Text, Newline, useStdin } = require('ink');
const produce = require('immer').default;

const steps = importJsx('./steps');
const { highlightColor } = require('./shared');

function App(globalOptions) {
	const { isRawModeSupported } = useStdin();
	const [stepIndex, setStepIndex] = React.useState(0);
	const [answers, setAnswers] = React.useState({
		defaultTenant: 'furniture',
	});
	const [staticMessages, setStaticMessages] = React.useState([
		() => (
			<>
				<Text>
					<Text underline>Crystallize Headless PIM</Text>
					<Newline />
					<Text>Hi you, let's make something awesome!</Text>
				</Text>
			</>
		),
	]);

	let step = steps[stepIndex];

	/**
	 * If we cannot receive user input, we will just defer to the
	 * Next.JS boilerplate with standard settings
	 */
	if (!isRawModeSupported) {
		if (stepIndex === 0) {
			const newIndex = steps.findIndex((s) => s.name === 'download');
			setStepIndex(newIndex);
			setAnswers({
				nextjs: true,
				boilerplate: 'Next.js',
				tenant: answers.defaultTenant,
				paymentMethods: ['stripe'],
				multilingual: ['en'],
			});
			setStaticMessages((messages) => [
				...messages,
				() => (
					<Text>
						Using boilerplate <Text color={highlightColor}>Next.js</Text>
					</Text>
				),
				() => (
					<Text>
						In folder{' '}
						<Text color={highlightColor}>./{globalOptions.projectName}</Text>
					</Text>
				),
			]);
			return null;
		}
	}

	function resolveStep(answer) {
		const staticMessages = [];

		function getNextStepIndex() {
			const startAt = stepIndex + 1;
			for (let i = startAt; i < steps.length; i++) {
				const s = steps[i];
				if (!s.when || s.when({ answers: nextAnswers })) {
					if (!s.render && s.staticMessage) {
						staticMessages.push(s.staticMessage);
					} else {
						return i;
					}
				}
			}
			return -1;
		}

		let nextAnswers;
		if (step.answer) {
			nextAnswers = produce({ answers, answer }, step.answer).answers;
		}

		// Collect any static message from the answer
		if (step.staticMessage) {
			staticMessages.push(step.staticMessage);
		}

		if (nextAnswers) {
			setAnswers(nextAnswers);
		}

		let nextStepIndex = getNextStepIndex();
		if (staticMessages.length > 0) {
			setStaticMessages((messages) => [...messages, ...staticMessages]);
		}

		setStepIndex(nextStepIndex);
	}

	if (step) {
		const { render } = step;

		return (
			<Box flexDirection="column" padding={1}>
				{staticMessages.map((m, i) => (
					<Box key={i} flexDirection="column">
						{m({ ...globalOptions, answers })}
					</Box>
				))}
				<Newline />
				{render({ ...globalOptions, answers, resolveStep })}
			</Box>
		);
	}

	return (
		<Box flexDirection="column" padding={1}>
			{staticMessages.map((m, i) => (
				<Box key={i} flexDirection="column">
					{m({ ...globalOptions, answers })}
				</Box>
			))}
		</Box>
	);
}

module.exports = App;
