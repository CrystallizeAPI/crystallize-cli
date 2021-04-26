#!/usr/bin/env node
'use strict';

const React = require('react');
const { Text, useInput, Box, Newline } = require('ink');

const { highlightColor } = require('../shared');

/**
 * Due to terminals not always being that large, we need
 * to cap the max amount of options to display to a low
 * number.
 */
const maxOptionsToDisplay = 3;

function Select({ options, compact, onChange, initialSelected = 0 }) {
	const [selected, setSelected] = React.useState(initialSelected);

	useInput((input, key) => {
		if (key.return) {
			setSelected(0);
			onChange(options[selected]);
			return;
		}

		let newSel = selected;
		if (key.upArrow) {
			newSel--;
		} else if (key.downArrow) {
			newSel++;
		}
		if (newSel < 0) {
			newSel = options.length - 1;
		} else if (newSel > options.length - 1) {
			newSel = 0;
		}

		setSelected(newSel);
	});

	let optionsToDisplay = options.slice(
		selected - 1,
		selected - 1 + maxOptionsToDisplay
	);
	if (selected === 0) {
		optionsToDisplay = options.slice(0, maxOptionsToDisplay);
	} else if (selected === options.length - 1) {
		optionsToDisplay = options.slice(-maxOptionsToDisplay);
	}

	let overflowItem = null;
	let lastDisplayedIndex = options.findIndex(
		(o) => o === optionsToDisplay[optionsToDisplay.length - 1]
	);
	if (lastDisplayedIndex < options.length - 1) {
		overflowItem = options[lastDisplayedIndex + 1];
	}

	return (
		<Box flexDirection="column">
			{optionsToDisplay.map((o) => (
				<Box flexDirection="row" marginY={compact ? 0 : 1} key={o.value}>
					<Box width={1} marginRight={2} alignItems="center">
						<Text color={highlightColor}>
							{options[selected].value === o.value ? '>' : ''}
						</Text>
					</Box>
					<Box>
						<Text color={options[selected].value === o.value && highlightColor}>
							{o.render || o.label}
						</Text>
					</Box>
				</Box>
			))}
			{overflowItem && (
				<Box marginLeft={3} flexDirection="row">
					<Text>
						{overflowItem.label}
						<Newline />
						...
					</Text>
				</Box>
			)}
		</Box>
	);
}

module.exports = Select;
