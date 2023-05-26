import { useStoreManagerParentContext } from '@lomray/react-mobx-manager';
import type { IModalItem, IDefaultModalProps } from './context';
import type { IModalParentId } from './types';
import useModal from './use-modal';

/**
 * Use modal for custom inners
 */
const useModalMobx = <TProps extends IModalParentId>(
  Component: IModalItem<TProps>['Component'],
  props?: IDefaultModalProps,
  componentProps?: IModalItem<TProps>['componentProps'],
) => {
  const { parentId } = useStoreManagerParentContext();

  return useModal(Component as never, props, { ...componentProps, parentId } as TProps &
    IModalParentId);
};

export default useModalMobx;
