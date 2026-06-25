import { useInView } from '../hooks/useInView';

const variants = {
  'fade-up': 'translate-y-6',
  'fade-up-lg': 'translate-y-12',
  'fade-down': '-translate-y-6',
  'fade-left': 'translate-x-6',
  'fade-right': '-translate-x-6',
  'scale-in': 'scale-95',
  'fade': '',
};

export default function Reveal({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 700,
  className = '',
  as: Tag = 'div',
  ...rest
}) {
  const [ref, inView] = useInView({ threshold: 0.1 });

  const baseTransform = variants[variant] || variants['fade-up'];
  const transition = `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;

  return (
    <Tag
      ref={ref}
      className={`${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translate(0, 0) scale(1)' : undefined,
        transition,
      }}
      data-reveal-variant={variant}
      data-reveal-state={inView ? 'visible' : 'hidden'}
      {...rest}
    >
      <div
        className={`${baseTransform} will-change-transform`}
        style={{
          transform: inView ? 'translate(0, 0) scale(1)' : undefined,
          transition: `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
        }}
      >
        {children}
      </div>
    </Tag>
  );
}
