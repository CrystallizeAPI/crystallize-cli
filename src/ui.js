#!/usr/bin/env node
'use strict';

const React = require('react');
const { Box, Text, useStdin } = require('ink');
const produce = require('immer').default;

const { highlightColor } = require('./shared');

function App({ journey, ...globalOptions }) {
	const { isRawModeSupported } = useStdin();
	const [stepIndex, setStepIndex] = React.useState(0);

	const [answers, setAnswers] = React.useState(journey.baseAnswers);
	const [staticMessages, setStaticMessages] = React.useState([
		() => journey.welcomeMessage,
	]);

	const { steps } = journey;
	let step = steps[stepIndex];

	React.useEffect(() => {
		if (stepIndex === -1) {
			setTimeout(() => {
				process.exit(0);
			}, 1000);
		}
	}, [stepIndex]);

	/**
	 * If we cannot receive user input, we will just defer to the
	 * Next.JS boilerplate with standard settings
	 */
	if (!isRawModeSupported) {
		const newIndex = steps.findIndex((s) => s.name === 'download');
		setStepIndex(newIndex);
		setAnswers({
			nextjs: true,
			boilerplate: 'Next.js',
			tenant: answers.defaultTenant,
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

		if (nextAnswers) {
			setAnswers(nextAnswers);
		}

		// Collect any static message from the answer
		if (step.staticMessage) {
			staticMessages.push(step.staticMessage);
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
				<Box flexDirection="column" marginBottom={1}>
					{staticMessages.map((m, i) => (
						<Box key={i} flexDirection="column">
							{m({ ...globalOptions, answers })}
						</Box>
					))}
				</Box>

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
