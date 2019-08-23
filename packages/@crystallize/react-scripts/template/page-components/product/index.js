/* eslint react/no-multi-comp: 0 */
import React, { useState, useContext } from 'react';
import { LayoutContext } from '@crystallize/react-layout';
import Img from '@crystallize/react-image';
import { withRouter } from 'next/router';

import { H1, Button, screen, Outer } from 'ui';
import { CurrencyValue } from 'components/currency-value';
import { useBasket, getVariantVATprops } from 'components/basket';
import Layout from 'components/layout';
import VariantSelector from 'components/variant-selector';
import ShapeComponents from 'components/shape/components';

import {
  Sections,
  Media,
  MediaInner,
  Info,
  Price,
  ProductFooter,
  Description
} from './styles';

const placeHolderImg = '/static/placeholder.png';

const ProductPage = ({ product, defaultVariant }) => {
  const layout = useContext(LayoutContext);
  const basket = useBasket();

  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

  const onSelectedVariantChange = variant => setSelectedVariant(variant);

  const buy = async () => {
    const basketItemToAdd = {
      ...getVariantVATprops({ product, variant: selectedVariant }),
      ...selectedVariant,
      name: product.name
    };

    basket.actions.addItem(basketItemToAdd);
    await layout.actions.showRight();
    basket.actions.pulsateItemInBasket(basketItemToAdd);
  };

  const selectedVariantImg =
    (selectedVariant.image || {}).url || placeHolderImg;

  return (
    <Outer>
      <Sections>
        <Media>
          <MediaInner>
            <Img
              src={selectedVariantImg}
              onError={e => {
                e.target.onerror = null;
                e.target.src = placeHolderImg;
              }}
              sizes={`(max-width: ${screen.sm}px) 400px, 600px`}
              alt={product.name}
            />
          </MediaInner>
        </Media>
        <Info>
          <H1>{product.name}</H1>
          <Description>
            <ShapeComponents components={product.components} />
          </Description>

          <VariantSelector
            variants={product.variants}
            selectedVariant={selectedVariant}
            onChange={onSelectedVariantChange}
          />
          <ProductFooter>
            <Price>
              <strong>
                <CurrencyValue value={selectedVariant.price} />
              </strong>
            </Price>
            <Button onClick={buy}>Add to basket</Button>
          </ProductFooter>
        </Info>
      </Sections>
    </Outer>
  );
};

const ProductPageDataLoader = ({ data }) => {
  const [product] = data.tree;
  const defaultVariant = product.variants.find(v => v.isDefault);

  if (!defaultVariant) {
    return <Layout title={product.name}>This product has no variants</Layout>;
  }

  return (
    <Layout title={product.name}>
      <ProductPage
        key={product.id}
        product={product}
        defaultVariant={defaultVariant}
      />
    </Layout>
  );
};

export default withRouter(ProductPageDataLoader);
