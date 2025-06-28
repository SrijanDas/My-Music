import React from "react";

export type ModalProps = {
  onOpenChange(open: boolean): void;
  open: boolean;
};

export default function useModal(
  props: { defaultOpen?: boolean } = {},
): ModalProps {
  const [isOpen, setIsOpen] = React.useState(props.defaultOpen ?? false);

  const onOpenChange = (open: boolean) => setIsOpen(open);

  return {
    open: isOpen,
    onOpenChange,
  };
}
