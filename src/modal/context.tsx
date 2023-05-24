import type { FCC } from '@lomray/client-helpers/interfaces/fc-with-children';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import type { IModalProps, IModalToggle } from './types';

export interface IModalItem<TProps extends object = Record<string, any>> {
  props: IModalProps;
  Component: FCC<TProps & IModalToggle> | null;
  id: string;
  type: string;
  componentProps?: TProps;
}

interface IModalContextState<TComponentProps extends object = Record<string, any>> {
  state: IModalItem<TComponentProps>[];
}

type OmitBaseModalProps<TProps> = Omit<TProps, 'isVisible' | 'toggle'>;

export type IDefaultModalProps = OmitBaseModalProps<IModalProps>;

export interface IModalContext extends IModalContextState {
  openModal: <TProps extends object = Record<string, any>>(
    Component: IModalItem<TProps>['Component'],
    props?: IDefaultModalProps,
    componentProps?: IModalItem<TProps>['componentProps'],
    id?: string,
  ) => void;
  createModal: <TProps extends object = Record<string, any>>(
    Component: IModalItem<TProps>['Component'],
    type: string,
  ) => (props: OmitBaseModalProps<TProps>) => void;
  hideModal: (id?: string | object) => void;
}

/**
 * Init state for context Provider
 */
const initContextState: IModalContext = {
  state: [],
  createModal: () => () => undefined,
  openModal: () => undefined,
  hideModal: () => undefined,
};

/**
 * Global modal context
 */
const ModalContext = React.createContext(initContextState);

/**
 * Global modal context provider
 * @constructor
 */
export const ModalProvider: FCC = ({ children }) => {
  const [state, setState] = useState<IModalItem[]>([]);

  /**
   * Clear modal state
   */
  const clearModalState: IModalContext['hideModal'] = useCallback(
    (id) => setState((prevState) => prevState.filter((el) => el.id !== id)),
    [],
  );

  /**
   * Hide modal with animation
   */
  const hideModal: IModalContext['hideModal'] = useCallback(
    (id) => {
      const isIdNotFound = !id || typeof id === 'object';

      clearModalState(id);

      setState((prevState) =>
        prevState.map((el) => {
          if (isIdNotFound || el.id === id) {
            return { ...el, props: { ...el.props, isVisible: false } };
          }

          return el;
        }),
      );
    },
    [clearModalState],
  );

  /**
   * Build modal item structure
   */
  const buildModalItem: IModalContext['openModal'] = useCallback(
    (Component, props, componentProps, id): IModalItem => ({
      Component: Component as never,
      props: { ...props, isVisible: true, toggle: () => hideModal(id) },
      id: id ?? 'DEFAULT',
      type: 'DEFAULT',
      componentProps,
    }),
    [hideModal],
  );

  /**
   * Open modal
   * Component - modal body component. Modal wrapper already added in consumer
   */
  const openModal: IModalContext['openModal'] = useCallback(
    (Component, props, componentProps, id) => {
      setState((prevState) => {
        const isIdExists = prevState.some((el) => el.id === id);

        // In some cases need to rewrite modal state (like one modal state changing)
        if (isIdExists) {
          return prevState.map((el) => {
            if (el.id === id) {
              return buildModalItem(Component, props, componentProps, id) as never;
            }

            return el;
          });
        }

        // Push to state new modal
        return [...prevState, buildModalItem(Component, props, componentProps, id)] as never;
      });
    },
    [buildModalItem],
  );

  /**
   * Create modal helper
   *
   * Example:
   * const openMyModal = createModal<IMyModalProps>(MyModalComponent, 'MY_MODAL_ID');
   *
   * How to use created modal:
   *
   * Open:
   * const hideMyModal = openMyModal(props);
   *
   * Close:
   * hideMyModal()
   * or
   * hideModal('MY_MODAL_ID')
   */
  const createModal: IModalContext['createModal'] = useCallback(
    (Component, type) => (props) => {
      setState((prevState) => [
        ...prevState,
        {
          Component: Component as never,
          props: { ...props, isVisible: true, toggle: () => hideModal(type) },
          id: type,
          type,
        },
      ]);

      return hideModal(type);
    },
    [hideModal],
  );

  /**
   * Context Provider value
   */
  const value: IModalContext = useMemo(
    () => ({
      state,
      createModal,
      openModal,
      hideModal,
    }),
    [state, createModal, openModal, hideModal],
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};

/**
 * useModalContext hook
 */
export const useModalContext = (): IModalContext => useContext(ModalContext);

/**
 * ModalConsumer
 * @see {ModalRoot}
 */
export const ModalConsumer = ModalContext.Consumer;
