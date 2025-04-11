import { useCallback, useState } from "react";

export interface UseDisclosureProps {
  defaultOpen?: boolean;
}

export function useDisclosure(props: UseDisclosureProps = {}) {
  const [open, setOpen] = useState(props.defaultOpen ?? false);

  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  const onOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const onToggle = useCallback(() => {
    if (open) {
      onClose();
    } else {
      onOpen();
    }
  }, [open, onOpen, onClose]);

  return {
    open,
    onOpen,
    onClose,
    onToggle,
  };
}
