export default function GlitchText({ children, as: Tag = 'span', className = '' }) {
  return (
    <Tag className={`glitch ${className}`} data-text={typeof children === 'string' ? children : ''}>
      {children}
    </Tag>
  );
}
