'use strict';

const React = require('react');
const { Text, Box, Newline } = require('ink');

const { simplyFetchFromGraph } = require('./fetch-from-crystallize');

const tips = [
	() => (
		<Text>
			Want to learn more about Crystallize? Check out
			https://crystallize.com/learn
		</Text>
	),
];

// Get more tips
(async function getTips() {
	try {
		const {
			data: { blog, comic },
		} = await simplyFetchFromGraph({
			query: `
			{
				blog: catalogue(path: "/blog") {
					...s
				}
				comic: catalogue(path: "/comics") {
					...s
				}
			}

			fragment s on Item {
				subtree(first: 1) {
					edges {
						node {
							name
							path
						}
					}
				}
			}`,
		});

		const blogPost = blog.subtree.edges[0].node;
		const comicPost = comic.subtree.edges[0].node;

		if (blogPost) {
			tips.push(() => (
				<Text>
					Catch up on our last blogpost "{blogPost.name}"
					<Newline />
					https://crystallize.com{blogPost.path}
				</Text>
			));
		}
		if (comicPost) {
			tips.push(() => (
				<Text>
					Like comics? Check out our latest: "{comicPost.name}"{' '}
					(https://crystallize.com{comicPost.path})
				</Text>
			));
		}
	// eslint-disable-next-line no-empty
	} catch (err) {}
})();

function Tips() {
	const [tipsIndex, setTipsIndex] = React.useState(0);

	// Give different tips messages
	React.useEffect(() => {
		const interval = setInterval(() => {
			setTipsIndex((f) => {
				let newI = f + 1;
				if (newI === tips.length) {
					newI = 0;
				}
				return newI;
			});
		}, 8000);
		return () => clearInterval(interval);
	});

	return (
		<Box>
			<Text italic>{tips[tipsIndex]()}</Text>
		</Box>
	);
}

module.exports = Tips;
