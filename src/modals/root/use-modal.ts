import type { MouseEvent } from 'react';
import { useCallback, useMemo, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { IModalItem, IDefaultModalProps } from './context';
import { useModalContext } from './context';

/**
 * Use modal for custom inners
 */
const useModal = <TProps extends object>(
  Component: IModalItem<TProps>['Component'],
  props?: IDefaultModalProps,
  componentProps?: IModalItem<TProps>['componentProps'],
) => {
  const { openModal, hideModal } = useModalContext();

  /**
   * Uniq ID for each hook
   */
  const id = useRef(uuidv4());

  /**
   * Open modal
   */
  const open = useCallback<
    (e?: MouseEvent<any> | null, params?: IModalItem<TProps>['componentProps']) => void
  >(
    (e, params) => {
      openModal<TProps>(Component, props, { ...componentProps, ...params } as TProps, id.current);
    },
    [Component, componentProps, openModal, props],
  );

  /**
   * Hide modal with current uniq ID
   */
  const hide = useCallback(() => hideModal(id.current), [hideModal]);

  return useMemo(() => [open, hide], [hide, open]);
};

export default useModal;
