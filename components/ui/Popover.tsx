import * as Popover from "@radix-ui/react-popover";
interface Pop {
  content: React.ReactNode;
  dark?: boolean;
}

const Pop: React.FC<Pop> = ({ children, content, dark }) => (
  <Popover.Root>
    <Popover.Trigger>{children}</Popover.Trigger>
    <Popover.Content
      side="top"
      className={`relative p-4 w-64 rounded-sm shadow-md border ${
        !dark
          ? "bg-sand-sand3 text-sand-sand12 border-sand-sand7"
          : "bg-sandDark-sand3 text-sandDark-sand12 border-sandDark-sand7"
      }`}
    >
      <Popover.Close className="absolute top-2 right-2 w-6 h-6 p-1">
        <svg
          className={`w-full h-full ${
            !dark ? "stroke-sand-sand12" : "stroke-sandDark-12"
          }`}
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
            fill="currentColor"
            fill-rule="evenodd"
            clip-rule="evenodd"
          ></path>
        </svg>
      </Popover.Close>
      {content}
      <Popover.Arrow
        className={`fill-current filter drop-shadow stroke-1 ${
          !dark
            ? "text-sand-sand3 stroke-sand-sand7"
            : "text-sandDark-sand3 stroke-sandDark-sand7"
        }`}
      />
    </Popover.Content>
  </Popover.Root>
);

export default Pop;
