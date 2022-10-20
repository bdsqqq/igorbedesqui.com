// Having email links in the UI is a bit of a pain, I never know what is the expected behavior.
// - The label should be "arbitraty" or the email address itself?
// - Should I assume the user wants to copy the email address or open it in an email client?
// This component should allow the user to choose the behavior.

// I want this component to:
// ✓ render inline so I can use it anywhere.
// - onClick, open a popover with:
// ✓ - The email address as text
// ✓ - A button to copy the email address
// ✓ - - Provide feedback
// ✓ - A button to open the email in an email client
// - - - custom subject and sample body to allow i18n (better UX for PT users)
// - - - - ? Does this mean I should expose props so I can use specific subjects/sample messages?

const EmailLink = ({
  email = "igorbedesqui@gmail.com",
  children,
}: {
  email?: string;
  children: React.ReactNode;
}) => {
  return (
    <Popover
      icon={<EnvelopeClosedIcon />}
      content={<PopoverContent email={email} />}
      options={{
        padding: "none",
        noMaxWidth: true,
        softBg: true,
      }}
    >
      <span className="underline">{children}</span>
    </Popover>
  );
};

const PopoverContent = ({ email }: { email: string }) => {
  const commonTranslation = useTranslation("common");
  const t = (translationKey: Leaves<typeof commonNamespace>) => {
    return commonTranslation.t(translationKey);
  };

  const [success, setSuccess] = useState(0);
  const incrementSuccess = () => {
    setSuccess((s) => s + 1);
  };

  useEffect(() => {
    if (!success) return;

    const timeout = setTimeout(() => {
      setSuccess(0);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [success]);

  return (
    <div className="flex">
      <Tooltip
        content={
          <span className="text-sm italic tracking-[0.2px] text-mauve11">
            {t("footer.email.copy")}
          </span>
        }
        options={{ dark: true, padding: "sm" }}
      >
        <Button
          className="rounded-l-sm rounded-r-none"
          onClick={() => {
            if (!navigator.clipboard) {
              console.log(
                "no clipboard! This api requires https on chrome so if you're on localhost I'm sorry"
              );
              return;
            }
            navigator.clipboard.writeText(email).then(incrementSuccess);
          }}
        >
          {success ? <CheckIcon /> : <ClipboardCopyIcon />}
        </Button>
      </Tooltip>
      <span className="bg-mauve3 p-1 border border-mauve7 border-x-0">
        {email}
      </span>
      <Tooltip
        content={
          <span className="text-sm italic tracking-[0.2px] text-mauve11">
            {t("footer.email.send")}
          </span>
        }
        options={{ dark: true, padding: "sm" }}
      >
        <LinkButton
          className="rounded-r-sm rounded-l-none"
          href={`mailto:${email}`}
        >
          <PaperPlaneIcon />
        </LinkButton>
      </Tooltip>
    </div>
  );
};

export default EmailLink;

import useTranslation from "next-translate/useTranslation";
import {
  CheckIcon,
  ClipboardCopyIcon,
  EnvelopeClosedIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";

import Popover from "@/components/ui/Popover";
import { Button, LinkButton } from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";

import commonNamespace from "@/locales/en/common.json";
import { Leaves } from "@/lib/nestedKeyOfTypes";
import { useEffect, useState } from "react";
