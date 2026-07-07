
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
  <div className={`bg-white minimal-border ${paddings[padding]} ${hover ? 'hover:border-gray-300 transition-all' : ''} ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`border-b border-gray-100 pb-6 mb-6 ${className}`}>{children}</div>
);

const CardBody: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`border-t border-gray-100 pt-6 mt-6 ${className}`}>{children}</div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
