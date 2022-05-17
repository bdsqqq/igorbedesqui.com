// Having email links in the UI is a bit of a pain, I never know what is the expected behavior.
// - The label should be "arbitraty" or the email address itself?
// - Should I assume the user wants to copy the email address or open it in an email client?
// This component should allow the user to choose the behavior.

// I want this component to:
// - render inline so I can use it anywhere.
// - onClick, open a popover with:
// - - The email address as text
// - - A button to copy the email address
// - - A button to open the email in an email client
// - - - ? Does this mean I should expose props so I can use specific subjects/sample messages?

const EmailLink = ({
  email = "igorbedesqui@gmail.com",
  label,
}: {
  email: string;
  label: string;
}) => {
  return "email";
};

export default EmailLink;
