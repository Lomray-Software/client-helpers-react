import type { FCC } from '@lomray/client-helpers/interfaces';
import React from 'react';
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

export type IParams<TRoutesConfig extends TRouteConfig> = {
  [field in keyof RequiredFieldsOnly<IRouteParams<TRoutesConfig>>]: string;
} & {
  [field in keyof OptionalFieldsOnly<IRouteParams<TRoutesConfig>>]?: string;
};

export interface IRoute extends RouteObject {
  isPrivate?: boolean;
  isOnlyGuest?: boolean;
}

export interface IRouteServiceParams<TRoutesConfig extends TRouteConfig> {
  routes: TRoutesConfig;
  onBefore?: (element: React.ReactNode, route: IRoute) => React.ReactNode;
  AuthGateway?: FCC<{ isOnlyGuest?: boolean }>;
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
  public buildRoutes = (baseRoutes?: IRoute[], parentPath?: string): RouteObject[] | undefined => {
    const { onBefore, AuthGateway } = this.params;

    return baseRoutes?.map((route) => {
      const { isPrivate = true, isOnlyGuest = false, element, children, path, ...rest } = route;
      const finalElement = onBefore?.(element, route) ?? element;

      return {
        ...rest,
        path: parentPath && path ? path.replace(parentPath, '') : path,
        children: this.buildRoutes(children, path),
        element:
          (isPrivate || isOnlyGuest) && AuthGateway ? (
            <AuthGateway children={finalElement} isOnlyGuest={isOnlyGuest} />
          ) : (
            finalElement
          ),
      };
    });
  };
}

export default Route;
