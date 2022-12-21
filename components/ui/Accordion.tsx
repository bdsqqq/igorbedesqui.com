import * as RadixAccordion from "@radix-ui/react-accordion";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import type {
  AccordionSingleProps,
  AccordionMultipleProps,
  AccordionTriggerProps,
  AccordionContentProps,
} from "@radix-ui/react-accordion";
import { cx } from "class-variance-authority";

const AccordionRoot = ({
  children,
  className,
  ...props
}: (AccordionSingleProps | AccordionMultipleProps) &
  React.RefAttributes<HTMLDivElement>) => (
  <RadixAccordion.Root className={cx("bg-gray-1 p-2", className)} {...props}>
    {children}
  </RadixAccordion.Root>
);

const AccordionTrigger = ({
  children,
  className,
  ...props
}: AccordionTriggerProps & React.RefAttributes<HTMLButtonElement>) => (
  <RadixAccordion.Header>
    <RadixAccordion.Trigger
      className={cx(
        "flex flex-1 items-start justify-between text-left group",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className="transition-transform ease-productive-standard duration-moderate-01 group-data-[state='open']:-rotate-180 h-6 w-6"
        aria-hidden
      />
    </RadixAccordion.Trigger>
  </RadixAccordion.Header>
);

const AccordionContent = ({
  children,
  className,
  ...props
}: AccordionContentProps & React.RefAttributes<HTMLDivElement>) => (
  <RadixAccordion.Content className={cx("", className)} {...props}>
    {children}
  </RadixAccordion.Content>
);

const Accordion = {
  Root: AccordionRoot,
  Item: RadixAccordion.Item,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};

export default Accordion;
