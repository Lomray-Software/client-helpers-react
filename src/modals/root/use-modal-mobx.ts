import { useStoreManagerParentContext } from '@lomray/react-mobx-manager';
import type { IModalItem, IDefaultModalProps } from './context';
import type { IModalParentId } from './types';
import useModal from './use-modal';

/**
 * Use modal for custom inners
 */
const useModalMobx = <TProps extends object>(
  Component: IModalItem<TProps & IModalParentId>['Component'],
  props?: IDefaultModalProps,
  componentProps?: IModalItem<TProps & IModalParentId>['componentProps'],
) => {
  const parentContext = useStoreManagerParentContext();
  const parentId = typeof parentContext === 'string' ? parentContext : parentContext?.parentId;

  return useModal(Component as never, props, { ...componentProps, parentId });
};

export default useModalMobx;
