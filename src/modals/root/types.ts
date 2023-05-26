import type { ReactNode } from 'react';
import type useModal from './use-modal';

export type ModalAnimation =
  | 'zoom'
  | 'fade'
  | 'flip'
  | 'door'
  | 'rotate'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'mobileMenuOpen'
  | 'mobileMenuClose';

export type ModalAnimationType = 'enter' | 'leave';

export interface IModalToggle {
  isVisible: boolean;
  toggle: () => void;
}

export interface IModalParentId {
  parentId: string;
}

export interface IModalHookRef<TProps extends object> {
  open: ReturnType<typeof useModal<TProps>>[0];
  hide: ReturnType<typeof useModal<TProps>>[1];
}

export interface IModalProps<TProps extends object = Record<string, any>> extends IModalToggle {
  animation?: ModalAnimation;
  enterAnimation?: ModalAnimation;
  leaveAnimation?: ModalAnimation;
  shouldCloseOnEsc?: boolean;
  willCloseMaskOnClick?: boolean;
  isShowMask?: boolean;
  onAnimationEnd?: () => void;
  onClose?: () => void;
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
  closeButton?: (defaultProps: { onClick: () => void; className: string }) => ReactNode;
  hookRef?: IModalHookRef<TProps>;
}

export interface IModalState {
  isShow: boolean;
  animationType: ModalAnimationType;
}
