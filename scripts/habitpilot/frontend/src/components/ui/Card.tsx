import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Card container variants
const cardVariants = cva(
  'rounded-lg border bg-card text-card-foreground',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800',
        elevated: 'border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow dark:border-gray-700 dark:bg-gray-800',
        outline: 'border-gray-300 bg-transparent dark:border-gray-600',
        ghost: 'border-transparent shadow-none',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        default: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cardVariants({ variant, padding, className })}
      {...props}
    />
  )
);
Card.displayName = 'Card';

// Card Header component
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 ${className}`}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

// Card Title component
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-xl font-semibold leading-none tracking-tight ${className}`}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

// Card Description component
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={`text-sm text-muted-foreground ${className}`}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

// Card Content component
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`pt-0 ${className}`} {...props} />
));
CardContent.displayName = 'CardContent';

// Card Footer component
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center pt-0 ${className}`}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

// Interactive Card component with hover effects
export interface InteractiveCardProps extends CardProps {
  onClick?: () => void;
  selected?: boolean;
}

const InteractiveCard = React.forwardRef<HTMLDivElement, InteractiveCardProps>(
  ({ className, selected, onClick, ...props }, ref) => (
    <Card
      ref={ref}
      className={`
        cursor-pointer transition-all duration-200
        hover:shadow-md hover:scale-[1.02]
        ${selected ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
        ${className}
      `}
      onClick={onClick}
      {...props}
    />
  )
);
InteractiveCard.displayName = 'InteractiveCard';

// Task Card component (specific to HabitPilot)
export interface TaskCardProps {
  title: string;
  completed?: boolean;
  importance?: 1 | 2 | 3;
  onToggle?: () => void;
  className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  title,
  completed = false,
  importance = 1,
  onToggle,
  className,
}) => {
  const importanceColors = {
    1: 'border-l-4 border-l-gray-400',
    2: 'border-l-4 border-l-primary-400',
    3: 'border-l-4 border-l-warning-500',
  };

  return (
    <InteractiveCard
      className={`
        ${importanceColors[importance]}
        ${completed ? 'opacity-60' : ''}
        ${className}
      `}
      onClick={onToggle}
      padding="sm"
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <div
            className={`
              w-5 h-5 rounded-full border-2 flex items-center justify-center
              ${completed 
                ? 'bg-success-500 border-success-500' 
                : 'border-gray-300 dark:border-gray-600'
              }
            `}
          >
            {completed && (
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
        </div>
        <p
          className={`
            flex-1 text-sm
            ${completed ? 'line-through text-gray-500' : ''}
          `}
        >
          {title}
        </p>
      </div>
    </InteractiveCard>
  );
};
TaskCard.displayName = 'TaskCard';

// Export all components
export {
  cardVariants,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  InteractiveCard,
  TaskCard,
};

// Usage examples:
// <Card>
//   <CardHeader>
//     <CardTitle>Today's Tasks</CardTitle>
//     <CardDescription>Complete these to boost your score</CardDescription>
//   </CardHeader>
//   <CardContent>
//     <TaskCard title="Morning meditation" importance={2} />
//     <TaskCard title="Exercise 30 minutes" importance={3} completed />
//   </CardContent>
// </Card>