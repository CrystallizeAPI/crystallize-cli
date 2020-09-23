'use strict';

const React = require('react');
const importJsx = require('import-jsx');
const { Box, Text, Newline } = require('ink');
const produce = require('immer').default;

const steps = importJsx('./steps');

function App(globalOptions) {
	const [stepIndex, setStepIndex] = React.useState(0);
	const [answers, setAnswers] = React.useState({});
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

	const step = steps[stepIndex];

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
