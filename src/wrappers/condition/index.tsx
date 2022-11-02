import type { FC, ReactElement } from 'react';

interface ICondition {
  condition: boolean;
  wrapper: (children: ReactElement) => ReactElement;
  children: ReactElement;
}

const Condition: FC<ICondition> = ({ condition, wrapper, children }) =>
  condition ? wrapper(children) : children;

export default Condition;
