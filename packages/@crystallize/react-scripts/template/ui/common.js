import styled from 'styled-components';
import { colors } from './colors';

export const Outer = styled.div`
  margin-bottom: 30px;
  max-width: 1500px;
  padding: 0 50px;
  margin: 0 auto;
  display: block;
`;

export const Header = styled.div`
  position: relative;
  margin-bottom: 150px;
  p {
    max-width: 700px;
    font-size: 1.3rem;
    line-height: 1.3em;
    color: ${colors.darkText};
  }
  img {
    right: 0;
    top: 0;
    position: absolute;
    width: 100px;
  }
`;
