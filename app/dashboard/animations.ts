import { stagger, Transition } from 'motion';

export const visible = { opacity: 1, y: 0 };
export const hidden = { opacity: 0, y: 100 };

export const springTransition = (delay?: number) =>
  ({
    type: 'spring',
    bounce: 0.25,
    duration: 0.85,
    ...(delay ? { delay } : {}),
  } as Transition);

export const list = {
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      delayChildren: stagger(0.15),
    },
  },
  hidden: {
    opacity: 0,
    transition: {
      when: 'afterChildren',
      delayChildren: stagger(0.15, { from: 'last' }),
    },
  },
};

export const profileList = {
  visible: {
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
};
