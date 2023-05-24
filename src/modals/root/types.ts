import type { ReactNode } from 'react';

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

export interface IModalProps extends IModalToggle {
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
}

export interface IModalState {
  isShow: boolean;
  animationType: ModalAnimationType;
}
