import React, { useState } from 'react';
import Link from 'next/link';

import { useBasket, TinyBasket } from 'components/basket';
import { Button } from 'ui';

import { Basket, Header, Footer } from './styles';

const Aside = () => {
  const basket = useBasket();
  const [going, setGoing] = useState(false);

  const onCheckoutClick = evt => {
    if (!basket.state.items.length) {
      evt.preventDefault();
      return;
    }
    setGoing(true);
  };

  if (!basket.state || !basket.state.ready) {
    return '...';
  }

  return (
    <Basket>
      <Header>Basket</Header>
      <TinyBasket />
      <Footer>
        <Link href="/checkout" passHref>
          <Button
            as="a"
            fullWidth
            loading={going}
            disabled={!basket.state.items.length}
            onClick={onCheckoutClick}
          >
            Go to checkout
          </Button>
        </Link>
      </Footer>
    </Basket>
  );
};

export default Aside;
