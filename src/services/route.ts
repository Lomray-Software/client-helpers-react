import type React from 'react';
import type { FC } from 'react';
import { generatePath } from 'react-router';
import type { RouteObject } from 'react-router-dom';

export type TRouteConfig = {
  [key: string]: {
    URL: string;
    PARAMS?: Record<string, any>;
  };
};

export type RouteKeys<T> = keyof T;

export type IRouteParams<TRoutesConfig extends TRouteConfig> =
  TRoutesConfig[RouteKeys<TRoutesConfig>] extends {
    PARAMS: Record<string, any>;
  }
    ? TRoutesConfig[RouteKeys<TRoutesConfig>]['PARAMS']
    : undefined;

export type RequiredFieldsOnly<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K];
};

export type OptionalFieldsOnly<T> = {
  [K in keyof T as T[K] extends undefined ? never : K]: T[K];
};

export type EnumsFieldsOnly<T> = {
  [K in keyof T as T[K] extends object ? K : never]: T[K];
};

export type IParams<TRoutesConfig extends TRouteConfig> = {
  [field in keyof RequiredFieldsOnly<IRouteParams<TRoutesConfig>>]: string;
} & {
  [field in keyof OptionalFieldsOnly<IRouteParams<TRoutesConfig>>]?: string;
} & {
  [field in keyof EnumsFieldsOnly<
    IRouteParams<TRoutesConfig>
  >]: IRouteParams<TRoutesConfig>[field][keyof IRouteParams<TRoutesConfig>[field]];
};

export interface IRoute<TElement = RouteObject['element'] | FC>
  extends Omit<RouteObject, 'children' | 'element'> {
  element?: TElement | FC;
  children?: IRoute<TElement>[];
  isPrivate?: boolean;
  isOnlyGuest?: boolean;
}

export interface IRouteServiceParams<TRoutesConfig extends TRouteConfig> {
  routes: TRoutesConfig;
  onBefore?: <TE extends React.ReactNode | FC>(element: TE, route: IRoute<TE>) => React.ReactNode;
  onAuthGateway?: <TE extends React.ReactNode | FC>(
    element: TE,
    isOnlyGuest?: boolean,
  ) => React.ReactNode;
}

/**
 * Manage application routes
 */
class Route<TRoutesConfig extends TRouteConfig> {
  /**
   * Application routes config
   * @protected
   */
  protected routes: TRoutesConfig;

  /**
   * Service params
   * @protected
   */
  protected params: Omit<IRouteServiceParams<TRoutesConfig>, 'routes'>;

  /**
   * @constructor
   */
  constructor({ routes, ...params }: IRouteServiceParams<TRoutesConfig>) {
    this.routes = routes;
    this.params = params;
  }

  /**
   * Generate route url with params
   */
  public makeURL = <TKey extends RouteKeys<TRoutesConfig>>(
    routeKey: TKey,
    params?: IParams<TRoutesConfig>,
  ): string => {
    const path = this.routes[routeKey].URL;

    return generatePath(path, params);
  };

  /**
   * Build application routes
   */
  public buildRoutes = <TE extends React.ReactNode | FC>(
    baseRoutes?: IRoute<TE>[],
    parentPath?: string,
  ): RouteObject[] | undefined => {
    const { onBefore, onAuthGateway } = this.params;

    return baseRoutes?.map((route) => {
      const { isPrivate = false, isOnlyGuest = false, element, children, path, ...rest } = route;
      const finalElement = onBefore?.(element, route) ?? (element as unknown as React.ReactNode);

      return {
        ...rest,
        path: parentPath && path ? path.replace(parentPath, '') : path,
        children: this.buildRoutes(children, path),
        element:
          (isPrivate || isOnlyGuest) && onAuthGateway
            ? onAuthGateway(element, isOnlyGuest)
            : finalElement,
      };
    });
  };
}

export default Route;
