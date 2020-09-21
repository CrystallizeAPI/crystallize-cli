'use strict';

const React = require('react');
const importJsx = require('import-jsx');
const { Box, Text, useInput, Newline } = require('ink');
const produce = require('immer').default;

const { steps } = importJsx('./steps');
const { Select } = importJsx('./ui-modules/select');
const { Input } = importJsx('./ui-modules/input');

function App(globalOptions) {
	const [stepIndex, setStepIndex] = React.useState(0);
	const [answers, setAnswers] = React.useState({});
	const [staticMessages, setStaticMessages] = React.useState([
		<>
			<Text>
				<Newline />
				<Text>Hi there, let's get started</Text>
			</Text>
		</>,
	]);

	const step = steps[stepIndex];

	function resolveStep(answer) {
		const staticMessages = [];

		let nextAnswers;
		if (step.answer) {
			nextAnswers = produce({ answers, answer }, step.answer).answers;
		}

		function getNextStep(startAt) {
			for (let i = startAt; i < steps.length; i++) {
				const s = steps[i];
				if (!s.when || s.when({ answers: nextAnswers })) {
					if (!s.message && s.staticMessage) {
						staticMessages.push(s.staticMessage({ answers: nextAnswers }));
					} else {
						return i;
					}
				}
			}
		}

		// Collect any static message from the answer
		if (step.staticMessage) {
			staticMessages.push(step.staticMessage({ answers: nextAnswers }));
		}

		let nextStepIndex = getNextStep(stepIndex + 1);

		if (nextAnswers) {
			setAnswers(nextAnswers);
		}
		setStepIndex(nextStepIndex);
		if (staticMessages.length > 0) {
			setStaticMessages((messages) => [...messages, ...staticMessages]);
		}
	}

	if (step) {
		const { render } = step;

		return (
			<Box flexDirection="column" padding={1}>
				{staticMessages.map((m, i) => (
					<Box key={i}>{m}</Box>
				))}
				<Newline />
				{render({ ...globalOptions, answers, resolveStep })}
			</Box>
		);
	}

	return (
		<>
			{staticMessages.map((m, i) => (
				<Box key={i}>{m}</Box>
			))}
			<Text>Todo: end message</Text>
		</>
	);
}

module.exports = App;
