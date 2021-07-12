const fs = require('fs-extra');
const path = require('path');

const { Bootstrapper, EVENT_NAMES } = require('@crystallize/import-utilities');

function bootstrapTenant({
	tenant,
	tenantSpec,
	id,
	secret,
	onUpdate = () => {},
}) {
	return new Promise((resolve) => {
		try {
			const spec = JSON.parse(
				fs.readFileSync(
					path.resolve(__dirname, `./specs/${tenantSpec}.json`),
					'utf-8'
				)
			);
			if (spec) {
				const bootstrapper = new Bootstrapper();

				bootstrapper.setAccessToken(id, secret);

				bootstrapper.setTenantIdentifier(tenant);

				bootstrapper.setSpec(spec);

				bootstrapper.start();

				bootstrapper.on(EVENT_NAMES.STATUS_UPDATE, onUpdate);
				bootstrapper.on(EVENT_NAMES.DONE, resolve);
			}
		} catch (e) {
			console.log(e);
			resolve();
		}
	});
}

module.exports = { bootstrapTenant };
