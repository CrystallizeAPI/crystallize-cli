#!/usr/bin/env node
'use strict';

const React = require('react');
const { Text, Newline, Box } = require('ink');
const importJsx = require('import-jsx');
const { UncontrolledTextInput } = require('ink-text-input');

const { highlightColor } = require('../../shared');

const { DownloadProject } = importJsx('../../cli-utils/download-project');
const { InitProject } = importJsx('../../cli-utils/init-project');
// const GetPaymentMethods = importJsx('../../cli-utils/get-payment-methods');
const GetMultilingual = importJsx('../../cli-utils/get-multilingual');
const Tips = importJsx('../../cli-utils/tips');
const Select = importJsx('../../ui-modules/select');
const { stepBootstrapTenant, RunBootstrapper } = importJsx(
	'../_shared/step-bootstrap-tenant.js'
);

function NodeStartCommand({ shouldUseYarn }) {
	return (
		<Text color={highlightColor}>
			{shouldUseYarn ? 'yarn dev' : 'npm run dev'}
		</Text>
	);
}

function InstallDepsAndBootstrap(props) {
	const [initDone, setInitDone] = React.useState(false);
	const [bootstrappingDone, setBootstrappingDone] = React.useState(
		props.answers.bootstrapTenant === 'no'
	);

	React.useEffect(() => {
		if (initDone && bootstrappingDone) {
			props.resolveStep();
		}
	}, [initDone, bootstrappingDone, props]);

	return (
		<>
			{!initDone && <InitProject {...props} onDone={() => setInitDone(true)} />}
			{props.answers.bootstrapTenant !== 'no' && (
				<Box flexDirection="column" marginBottom={1}>
					<Box marginBottom={1}>
						<Text>Bootstrapping {props.answers.tenant}</Text>
					</Box>
					<RunBootstrapper
						{...props}
						onDone={() => setBootstrappingDone(true)}
					/>
				</Box>
			)}
			<Tips />
		</>
	);
}

const steps = [
	{
		render({ projectName, resolveStep }) {
			return (
				<>
					<Text>
						Please select a boilerplate for{' '}
						<Text color={highlightColor}>{projectName}</Text>
					</Text>
					<Select
						onChange={(answer) => resolveStep(answer)}
						options={[
							{
								value: 'nextjs',
								label: 'Next.js',
								render: (
									<>
										<Text>Next.js</Text>
										<Newline />
										<Text dimColor>Complete hybrid SSG/SPA/SSR ecommerce</Text>
										<Newline />
										<Text dimColor>
											React, SSG &amp; SSR, Ecommerce with basket &amp; checkout
										</Text>
										<Newline />
										<Text dimColor>
											Demo: https://furniture.superfast.shop/
										</Text>
									</>
								),
							},
							{
								value: 'nextjs-content-commerce',
								label: 'Next.js - Content and commerce',
								render: (
									<>
										<Text>Next.js - Content and commerce</Text>
										<Newline />
										<Text dimColor>React, SSG</Text>
										<Newline />
										<Text dimColor>
											Beautiful commerce with longform storytelling
										</Text>
										<Newline />
										<Text dimColor>Demo: https://story.superfast.shop/</Text>
									</>
								),
							},
							{
								value: 'nextjs-subscription-commerce',
								label: 'Next.js - Subscription Commerce',
								render: (
									<>
										<Text>Next.js - Subscription Commerce</Text>
										<Newline />
										<Text dimColor>React, SSG</Text>
										<Newline />
										<Text dimColor>
											Software As A Service boilerplate, providing access to
											digital photos.
										</Text>
										<Newline />
										<Text dimColor>
											Demo: https://photofinder.superfast.shop/
										</Text>
									</>
								),
							},
							{
								value: 'nextjs-conference',
								label: 'Next.js - Conference',
								render: (
									<>
										<Text>Next.js - Conference</Text>
										<Newline />
										<Text dimColor>React, SSG</Text>
										<Newline />
										<Text dimColor>
											A boilerplate for conferences.
										</Text>
										<Newline />
										<Text dimColor>
											Demo: https://conference.superfast.shop/
										</Text>
									</>
								),
							},
							{
								value: 'gatsby',
								label: 'Gatsby',
								render: (
									<>
										<Text>Gatsby</Text>
										<Newline />
										<Text dimColor>
											React, SSG + SPA, Ecommerce with basket
										</Text>
										<Newline />
										<Text dimColor>
											Static Site Generation (SSG) on steroids!
										</Text>
										<Newline />
										<Text dimColor>
											Demo: https://crystallize-gatsby-boilerplate.vercel.app/
										</Text>
									</>
								),
							},
							{
								label: 'Nuxt.js - Content and product listing',
								value: 'nuxtjs',
								render: (
									<>
										<Text>Nuxt.js - Content and product listing</Text>
										<Newline />
										<Text dimColor>Vue, SSG + SPA</Text>
										<Newline />
										<Text dimColor>For the Vue fans out there</Text>
										<Newline />
										<Text dimColor>Demo: https://nuxt.superfast.shop/</Text>
									</>
								),
							},
							{
								value: 'service-api',
								label: 'Service API - Backend for any of the frontends',
								render: (
									<>
										<Text>Service API - Backend for any of the frontends</Text>
										<Newline />
										<Text dimColor>
											User authentication, basket and checkout management,
											webhooks ++
										</Text>
									</>
								),
							},
							{
								value: 'rn',
								label: 'React Native',
								render: (
									<>
										<Text>React Native</Text>
										<Newline />
										<Text dimColor>
											Go the App way. Currently just support for iOS
										</Text>
									</>
								),
							},
						]}
					/>
				</>
			);
		},
		answer({ answers, answer }) {
			answers[answer.value] = {};
			answers.boilerplate = answer.label;

			if (answer.value === 'nextjs-content-commerce') {
				answers.defaultTenant = 'voyage';
			} else if (answer.value === 'nextjs-subscription-commerce') {
				answers.defaultTenant = 'photofinder';
			} else if (answer.value === 'nextjs-conference') {
				answers.defaultTenant = 'conference-boilerplate';
			}
		},
		staticMessage(props) {
			return (
				<Text>
					<Newline />
					All right,{' '}
					<Text color={highlightColor}>{props.answers.boilerplate}</Text> it is
				</Text>
			);
		},
	},
	{
		render({ resolveStep }) {
			return (
				<>
					<Text>Which platform do you want to host it on?</Text>
					<Select
						onChange={(answer) => resolveStep(answer)}
						options={[
							{
								value: 'serverless-aws',
								label: 'Serverless (AWS)',
								render: (
									<>
										<Text>Serverless (AWS)</Text>
										<Newline />
										<Text dimColor>Using the serverless framework</Text>
										<Newline />
										<Text dimColor>https://www.serverless.com/</Text>
									</>
								),
							},
							{
								value: 'vercel',
								label: 'Serverless (Vercel)',
								render: (
									<>
										<Text>Serverless (Vercel)</Text>
										<Newline />
										<Text dimColor>Using Vercel cloud functions</Text>
										<Newline />
										<Text dimColor>
											https://vercel.com/docs/serverless-functions/introduction
										</Text>
									</>
								),
							},
						]}
					/>
				</>
			);
		},
		when({ answers }) {
			return answers['service-api'];
		},
		answer({ answers, answer }) {
			answers.serviceAPIPlatform = answer.value;
			answers.serviceAPIPlatformLabel = answer.label;
		},
		staticMessage({ answers }) {
			return (
				<Text>
					On{' '}
					<Text color={highlightColor}>{answers.serviceAPIPlatformLabel}</Text>
				</Text>
			);
		},
	},
	{
		staticMessage({ projectName }) {
			return (
				<Text>
					In folder <Text color={highlightColor}>./{projectName}</Text>
				</Text>
			);
		},
	},
	{
		render({ resolveStep, answers }) {
			return (
				<>
					<Text>
						Please select a Crystallize tenant
						<Newline />
						<Text dimColor>
							Don't have a tenant yet? Create one at
							https://crystallize.com/signup
						</Text>
					</Text>
					<Select
						onChange={(answer) => resolveStep(answer)}
						options={[
							{
								value: answers.defaultTenant,
								render: (
									<>
										<Text>Our demo tenant ({answers.defaultTenant})</Text>
										<Newline />
										<Text dimColor>Lots of demo data here already</Text>
									</>
								),
							},
							{
								value: '[use-own-tenant]',
								render: (
									<>
										<Text>My own tenant</Text>
									</>
								),
							},
						]}
					/>
				</>
			);
		},
		answer({ answers, answer }) {
			answers.tenant = answer.value;
		},
	},
	{
		render({ resolveStep, answers }) {
			return (
				<Box>
					<Box marginRight={1}>
						<Text>Enter your tenant identifier:</Text>
					</Box>
					<UncontrolledTextInput
						placeholder={answers.defaultTenant}
						onSubmit={(query) => resolveStep(query)}
					/>
				</Box>
			);
		},
		answer({ answers, answer }) {
			answers.tenant = answer;
			answers.useOwnTenant = true;
		},
		when({ answers }) {
			return answers.tenant === '[use-own-tenant]';
		},
	},
	{
		staticMessage(props) {
			return (
				<Text>
					Using Crystallize tenant{' '}
					<Text color={highlightColor}>{props.answers.tenant}</Text>
				</Text>
			);
		},
	},

	// {
	// 	render({ resolveStep }) {
	// 		return <GetPaymentMethods onChange={(answer) => resolveStep(answer)} />;
	// 	},
	// 	when({ answers }) {
	// 		return answers.serviceAPI;
	// 	},
	// 	answer({ answers, answer }) {
	// 		answers.paymentMethods = answer;
	// 	},
	// 	staticMessage({ answers }) {
	// 		const { paymentMethods } = answers;

	// 		if (paymentMethods && paymentMethods.length > 0) {
	// 			return (
	// 				<Text>
	// 					With <Text color={highlightColor}>{paymentMethods.join(', ')}</Text>{' '}
	// 					for payments
	// 				</Text>
	// 			);
	// 		}

	// 		return (
	// 			<Text>
	// 				With <Text color={highlightColor}>no payment methods</Text>
	// 			</Text>
	// 		);
	// 	},
	// },
	...stepBootstrapTenant,

	{
		render({ resolveStep }) {
			return <GetMultilingual onChange={(answer) => resolveStep(answer)} />;
		},
		when({ answers }) {
			return answers.nextjs || answers.gatsby;
		},
		answer({ answers, answer }) {
			answers.multilingual = answer;
		},
		staticMessage({ answers }) {
			const { multilingual } = answers;

			if (multilingual) {
				return (
					<Text>
						In these languages:{' '}
						<Text color={highlightColor}>{multilingual.join(', ')}</Text>
					</Text>
				);
			}

			return (
				<Text>
					In a <Text color={highlightColor}>single language</Text>
				</Text>
			);
		},
	},
	{
		render({ resolveStep, answers }) {
			return (
				<>
					<Text>
						Please provide the Service API URI
						<Newline />
						<Text dimColor>
							What is the Service API?
							https://www.youtube.com/watch?v=Dx-9eqp_MFk
						</Text>
					</Text>
					<Select
						onChange={(answer) => resolveStep(answer)}
						options={[
							{
								value: answers.defaultServiceAPIURL,
								render: (
									<>
										<Text>Our demo API ({answers.defaultServiceAPIURL})</Text>
										<Newline />
										<Text dimColor>
											User authentication, basket and checkout using the
											furniture tenant
										</Text>
									</>
								),
							},
							{
								value: '[use-own-service-api]',
								render: (
									<>
										<Text>My own Service API</Text>
									</>
								),
							},
						]}
					/>
				</>
			);
		},
		answer({ answers, answer }) {
			answers.serviceAPIURL = answer.value;
		},
		when({ answers }) {
			return answers.nextjs || answers.gatsby || answers.rn || answers.nuxtjs;
		},
	},
	{
		render({ resolveStep, answers }) {
			return (
				<Box>
					<Box marginRight={1}>
						<Text>Enter the URI to your Service API:</Text>
					</Box>
					<UncontrolledTextInput
						placeholder={answers.defaultServiceAPIURL}
						onSubmit={(query) => resolveStep(query)}
					/>
				</Box>
			);
		},
		answer({ answers, answer }) {
			answers.serviceAPIURL = answer;
		},
		when({ answers }) {
			return answers.serviceAPIURL === '[use-own-service-api]';
		},
	},
	{
		when({ answers }) {
			return answers.nextjs || answers.gatsby;
		},
		staticMessage({ answers }) {
			if (answers.serviceAPIURL === answers.defaultServiceAPIURL) {
				return (
					<Text>
						With the <Text color={highlightColor}>demo Service API</Text>
					</Text>
				);
			}
			return (
				<Text>
					With Service API URI:{' '}
					<Text color={highlightColor}>{answers.serviceAPIURL}</Text>
				</Text>
			);
		},
	},
	{
		render(props) {
			return (
				<>
					<DownloadProject {...props} />
					<Newline />
					<Tips />
				</>
			);
		},
	},
	{
		render(props) {
			return <InstallDepsAndBootstrap {...props} />;
		},
	},
	{
		staticMessage({ projectName, projectPath, answers, shouldUseYarn }) {
			return (
				<Box flexDirection="column" marginTop={2}>
					<Box flexDirection="column" marginBottom={2} width={400}>
						<Text>
							✨ "{projectName}" is ready ✨
							<Newline />
							<Text>{projectPath}</Text>
						</Text>
					</Box>
					{answers['service-api'] && (
						<>
							<Box flexDirection="column" marginBottom={1}>
								<Text>
									Configure tokens and secrets in the .env.local file:
								</Text>
								<Box
									flexDirection="column"
									borderStyle="round"
									paddingX={1}
									width={50}
								>
									<Text>
										CRYSTALLIZE_ACCESS_TOKEN_ID=
										<Newline />
										CRYSTALLIZE_ACCESS_TOKEN_SECRET=
										<Newline />
										...and so on
									</Text>
								</Box>
							</Box>
							<Box flexDirection="column" marginBottom={2}>
								<Text>
									Configure the app language, price variant and such in{' '}
									<Text color={highlightColor}>app.config.json</Text>
								</Text>
							</Box>
							{answers.serviceAPIPlatform === 'vercel' && (
								<Box flexDirection="column" marginBottom={2}>
									<Text>
										Read here on how to setup Vercel env values:
										<Newline />
										https://vercel.com/blog/environment-variables-ui
									</Text>
								</Box>
							)}
						</>
					)}
					<Box flexDirection="column" marginBottom={2}>
						<Text>
							<Text>
								Now, navigate to the project and start creating magic.
							</Text>
							<Newline />
							{answers['nextjs-subscription-commerce'] || answers['nextjs-conference'] ? (
								<>
									<Newline />
									<Text>Website</Text>
									<Newline />
									<Text color={highlightColor}>
										cd ./{projectName}/website &amp;&amp;{' '}
									</Text>
									<NodeStartCommand shouldUseYarn={shouldUseYarn} />
									<Newline />
									<Newline />
									<Text>Service API</Text>
									<Newline />
									<Text color={highlightColor}>
										cd ./{projectName}/service-api &amp;&amp;{' '}
									</Text>
									<NodeStartCommand shouldUseYarn={shouldUseYarn} />
									<Newline />
									<Text dimColor>
										Psst: remember to setup keys in .env.local
									</Text>
								</>
							) : (
								<>
									<Text color={highlightColor}>cd ./{projectName}</Text>
									<Newline />
									<NodeStartCommand shouldUseYarn={shouldUseYarn} />
								</>
							)}
						</Text>
					</Box>
					<Box flexDirection="column" marginBottom={2}>
						<Text>
							<Text color={highlightColor}>Go fast and prosper!</Text>
							<Newline />
							<Text dimColor>The milliseconds are with you</Text>
						</Text>
					</Box>
					<Box flexDirection="column" marginBottom={2}>
						<Box flexDirection="column">
							<Text>
								Want to get in touch with us? We would love to hear from you!
							</Text>
						</Box>
						<Text>Reach us at: https://crystallize.com/about#contact</Text>
					</Box>
				</Box>
			);
		},
	},
];

module.exports = steps;
