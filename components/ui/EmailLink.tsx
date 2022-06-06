// Having email links in the UI is a bit of a pain, I never know what is the expected behavior.
// - The label should be "arbitraty" or the email address itself?
// - Should I assume the user wants to copy the email address or open it in an email client?
// This component should allow the user to choose the behavior.

// I want this component to:
// ✓ render inline so I can use it anywhere.
// - onClick, open a popover with:
// ✓ - The email address as text
// ✓ - A button to copy the email address
// - - - Provide feedback
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
      <Text
        css={{
          textDecoration: "underline",
        }}
      >
        {children}{" "}
      </Text>
    </Popover>
  );
};

const PopoverContent = ({ email }: { email: string }) => {
  const commonTranslation = useTranslation("common");
  const t = (translationKey: Leaves<typeof commonNamespace>) => {
    return commonTranslation.t(translationKey);
  };

  return (
    <Box css={{ display: "flex" }}>
      <Tooltip
        content={<Text presetStyle={"caption"}>{t("footer.email.copy")}</Text>}
        options={{ dark: true, padding: "sm" }}
      >
        <Button
          css={{
            borderRadius: "$md 0 0 $md",
          }}
          onClick={() => {
            navigator.clipboard.writeText(email);
          }}
        >
          <CopyIcon />
        </Button>
      </Tooltip>
      <Text
        css={{
          backgroundColor: "$mauve3",
          padding: "0.25rem",
          border: "1px solid $mauve7",
          borderRight: "none",
          borderLeft: "none",
        }}
      >
        {email}
      </Text>
      <Tooltip
        content={<Text presetStyle={"caption"}>{t("footer.email.send")}</Text>}
        options={{ dark: true, padding: "sm" }}
      >
        <LinkButton
          css={{
            borderRadius: "0 $md $md 0",
          }}
          href={`mailto:${email}`}
        >
          <PaperPlaneIcon />
        </LinkButton>
      </Tooltip>
    </Box>
  );
};

export default EmailLink;

import useTranslation from "next-translate/useTranslation";
import {
  CopyIcon,
  EnvelopeClosedIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";

import Popover from "@/components/ui/Popover";
import { Box } from "@/components/ui/primitives";
import Text from "@/components/ui/Text";
import { Button, LinkButton } from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";

import commonNamespace from "@/locales/en/common.json";
import { Leaves } from "@/lib/nestedKeyOfTypes";
