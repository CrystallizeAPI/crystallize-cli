import { screen } from './screen';

// Ready made media queries
export const responsive = {
  xs: `@media (max-width: ${screen.xsMax}px)`,
  smAndLess: `@media (max-width: ${screen.smMax}px)`,
  sm: `@media (min-width: ${screen.smMin}px) and (max-width: ${screen.smMax}px)`,
  mdAndLess: `@media (max-width: ${screen.mdMax}px)`,
  md: `@media (min-width: ${screen.mdMin}px) and (max-width: ${screen.mdMax}px)`,
  lg: `@media (min-width: ${screen.lgMin}px)`
};
