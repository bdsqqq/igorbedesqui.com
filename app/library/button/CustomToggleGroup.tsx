"use client";

import React from "react";
import { Toggle as BaseToggle } from "@base-ui-components/react/toggle";
import { Button, ButtonGroup } from "@/components/ui/Button";
import {
  TextAlignCenterIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from "@radix-ui/react-icons";

const CustomToggleGroup = ({ 
  defaultValue = "left",
  ...props 
}: { 
  defaultValue?: string;
  [key: string]: any;
}) => {
  const [value, setValue] = React.useState(defaultValue);

  return (
    <ButtonGroup data-display-name="ButtonGroup" orientation="horizontal">
      <BaseToggle
        pressed={value === "left"}
        onPressedChange={(pressed) => pressed && setValue("left")}
        render={
          <Button
            icon={<TextAlignLeftIcon data-display-name="TextAlignLeftIcon" />}
          />
        }
      />
      <BaseToggle
        pressed={value === "center"}
        onPressedChange={(pressed) => pressed && setValue("center")}
        render={
          <Button
            icon={<TextAlignCenterIcon data-display-name="TextAlignCenterIcon" />}
          />
        }
      />
      <BaseToggle
        pressed={value === "right"}
        onPressedChange={(pressed) => pressed && setValue("right")}
        render={
          <Button
            icon={<TextAlignRightIcon data-display-name="TextAlignRightIcon" />}
          />
        }
      />
    </ButtonGroup>
  );
};

export default CustomToggleGroup;