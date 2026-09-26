
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const paddings = {
  sm: 'p-6',
  md: 'p-8',
  lg: 'p-10',
};

const Card: React.FC<CardProps> & { Header: typeof CardHeader; Body: typeof CardBody; Footer: typeof CardFooter } = ({
  children,
  className = '',
  padding = 'md',
  hover = false,
}) => (
  <div className={`bg-card text-card-foreground minimal-border rounded-lg ${paddings[padding]} ${hover ? 'hover:border-muted-foreground transition-all' : ''} ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`border-b border-border pb-6 mb-6 ${className}`}>{children}</div>
);

const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`border-t border-border pt-6 mt-6 ${className}`}>{children}</div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
