import { motion } from 'framer-motion';

const variants = {
  up:    { hidden: { opacity: 0, y: 34 },  visible: { opacity: 1, y: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
  left:  { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 40 },  visible: { opacity: 1, x: 0 } }
};

/**
 * Spring-based scroll reveal. Wrap any element/section content in this
 * for the "livelier" entrance motion (replaces the old vanilla
 * IntersectionObserver from the static-HTML version).
 */
export default function Reveal({ children, type = 'up', delay = 0, once = true, className, style, as: Tag = 'div' }) {
  const MotionTag = motion[Tag] || motion.div;
  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={variants[type] || variants.up}
      transition={{ type: 'spring', stiffness: 90, damping: 16, delay }}
    >
      {children}
    </MotionTag>
  );
}
