#!/usr/bin/env node
'use strict';

const React = require('react');
const { Text, useInput, Box } = require('ink');

const { highlightColor } = require('../shared');

function MultiSelect({ options, compact, onChange }) {
	const [selected, setSelected] = React.useState(
		options.reduce((acc, item, index) => {
			if (item.checked) {
				acc.push(index);
			}
			return acc;
		}, [])
	);
	const [highlight, setHighlight] = React.useState(0);

	useInput(
		(input, key) => {
			if (key.return) {
				setSelected([]);
				setHighlight(0);
				onChange(selected.map((s) => options[s]));
				return;
			}

			let newHighlight = highlight;
			if (key.upArrow) {
				newHighlight--;
			} else if (key.downArrow) {
				newHighlight++;
			}
			if (newHighlight < 0) {
				newHighlight = options.length - 1;
			} else if (newHighlight > options.length - 1) {
				newHighlight = 0;
			}

			setHighlight(newHighlight);

			if (input === ' ') {
				const newSelected = [...selected];
				const index = newSelected.indexOf(highlight);

				if (index === -1) {
					setSelected([...newSelected, highlight]);
				} else {
					newSelected.splice(index, 1);
					setSelected(newSelected);
				}
			}
		},
		[selected, highlight, setSelected, setHighlight]
	);

	return (
		<Box flexDirection="column">
			{options.map((o, i) => (
				<Box flexDirection="row" marginY={compact ? 0 : 1} key={o.value}>
					<Box width={3} marginRight={2} alignItems="center">
						<Text color={i === highlight && highlightColor}>
							{selected.includes(i) ? '[✓]' : '[ ]'}
						</Text>
					</Box>
					<Box>
						<Text color={i === highlight && highlightColor}>
							{o.render || o.label}
						</Text>
					</Box>
				</Box>
			))}
		</Box>
	);
}

module.exports = MultiSelect;
