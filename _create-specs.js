require('dotenv').config();

const { writeFileSync } = require('fs');
const { resolve } = require('path');

const { Bootstrapper } = require('@crystallize/import-utilities');

if (
  !process.env.CRYSTALLIZE_ACCESS_TOKEN_ID ||
  !process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET
) {
  throw new Error(
    'CRYSTALLIZE_ACCESS_TOKEN_ID and CRYSTALLIZE_ACCESS_TOKEN_SECRET must be set'
  );
}

function getFullSpec(tenantIdentifier) {
  const bootstrapper = new Bootstrapper();

  bootstrapper.setAccessToken(
    process.env.CRYSTALLIZE_ACCESS_TOKEN_ID,
    process.env.CRYSTALLIZE_ACCESS_TOKEN_SECRET
  );

  bootstrapper.setTenantIdentifier(tenantIdentifier);

  return bootstrapper.createSpec({
    grids: true,
    items: true,
    languages: true,
    priceVariants: true,
    shapes: true,
    topicMaps: true,
    vatTypes: true,
  });
}

function removeItemCataloguePath(item) {
  delete item.cataloguePath;

  if (item.children) {
    item.children.forEach(removeItemCataloguePath);
  }
}

async function furniture() {
  const spec = await getFullSpec('furniture');

  const itemShop = spec.items.find((i) => i.cataloguePath === '/shop');
  const itemStories = spec.items.find((i) => i.cataloguePath === '/stories');
  const itemAbout = spec.items.find((i) => i.cataloguePath === '/about');
  const itemAssets = spec.items.find((i) => i.cataloguePath === '/assets');
  const itemFrontpage = spec.items.find(
    (i) => i.cataloguePath === '/frontpage-2021'
  );

  // Only include a few shop sub folders
  itemShop.children = itemShop.children.filter((c) =>
    ['/shop/plants', '/shop/chairs'].includes(c.cataloguePath)
  );

  spec.items = [itemShop, itemStories, itemAbout, itemFrontpage, itemAssets];

  // Remove references as we do not want to update existing items
  spec.items.forEach(removeItemCataloguePath);

  writeFileSync(
    resolve(__dirname, `./src/journeys/_shared/specs/furniture.json`),
    JSON.stringify(spec, null, 1),
    'utf-8'
  );

  console.log(`✔ furniture done`);
}

async function voyage() {
  const spec = await getFullSpec('voyage');

  // Remove references as we do not want to update existing items
  spec.items.forEach(removeItemCataloguePath);

  writeFileSync(
    resolve(__dirname, `./src/journeys/_shared/specs/voyage.json`),
    JSON.stringify(spec, null, 1),
    'utf-8'
  );

  console.log(`✔ voyage done`);
}

(async function createSpecs() {
  await furniture();
  await voyage();
  process.exit(0);
})();
