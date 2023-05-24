import type { FC } from 'react';
import React from 'react';
import { ModalConsumer } from './context';
import type { IModalProps, IModalToggle } from './types';

export interface IModalRoot {
  Modal: FC<IModalProps & IModalToggle>;
}

/**
 * ModalRoot Consumer
 * @constructor
 */
const ModalRoot: FC<IModalRoot> = ({ Modal }) => (
  <ModalConsumer>
    {({ state }) =>
      state.map(({ Component, type, id, props, componentProps = {} }, index) => {
        if (!Component) {
          return null;
        }

        if (type !== 'DEFAULT') {
          return <Component {...props} key={`${id}${index}`} />;
        }

        return (
          <Modal {...props} key={`${id}${index}`}>
            <Component {...componentProps} toggle={props.toggle} isVisible={props.isVisible} />
          </Modal>
        );
      })
    }
  </ModalConsumer>
);

export default ModalRoot;
