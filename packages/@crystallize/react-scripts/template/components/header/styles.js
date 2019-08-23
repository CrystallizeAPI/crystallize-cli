import styled from 'styled-components';

import { responsive } from 'ui';

export const Outer = styled.header`
  text-align: center;
  padding: 10px 25px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-width: 1500px;
  margin: 0 auto 150px;
  ${responsive.xs} {
    flex-direction: column;
  }
`;

export const Logo = styled.div`
  height: 84px;
  display: block;
  object-fit: contain;
  img,
  svg {
    height: 100%;
  }
`;

export const Nav = styled.nav`
  display: flex;
  margin: 10px 0 0 15px;
  width: 100%;
  border-left: 1px solid #dfdfdf;
  padding-left: 15px;
`;

export const NavList = styled.ul`
  display: inline-block;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const NavListItem = styled.li`
  margin: 0;
  padding: 0;
  display: inline-block;
  margin: 0 5px;

  > a {
    display: inline-block;
    padding: 10px 10px;
    transition: all 100ms;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Basket = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45px;
  height: 45px;
  padding: 0;
  border-radius: 5px;
  justify-self: flex-end;
  img,
  svg {
    width: 40px;
  }
  &:hover,
  &:active {
    background: rgba(0, 0, 0, 0.05);
  }
`;
export const BasketQuantity = styled.div`
  position: absolute;
  font-weight: 500;
  font-size: 14px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -25%);
`;

export const NavActions = styled.div`
  cursor: pointer;
  margin: 0px 10px;

  a:hover {
    text-decoration: underline;
  }
`;
