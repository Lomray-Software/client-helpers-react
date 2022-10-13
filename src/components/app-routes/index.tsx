import type { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import type { RouteObject } from 'react-router-dom';

interface IAppRoutes {
  routes: RouteObject[];
}

const AppRoutes: FC<IAppRoutes> = ({ routes }) => useRoutes(routes);

export default AppRoutes;
