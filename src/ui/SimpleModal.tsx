import React, { ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  ModalBodyProps,
  ModalFooterProps,
  ButtonProps,
} from "@nextui-org/react";
import { cn } from "./utils";

export default function SimpleModal(p: {
  title?: string;
  trigger?: ReactNode;
  triggerProps?: ButtonProps;
  children?: ReactNode;
  bodyProps?: ModalBodyProps;
  footer?: ReactNode;
  footerProps?: ModalFooterProps;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      {typeof p.trigger == "string" ? (
        <Button onPress={onOpen} color="primary" {...(p.triggerProps || {})}>
          {p.trigger}
        </Button>
      ) : (
        p.trigger
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{p.title}</ModalHeader>
              <ModalBody {...(p.bodyProps || {})}>{p.children}</ModalBody>
              {p.footer && (
                <ModalFooter {...(p.footerProps || {})} className={cn("flex justify-center gap-5 items-center", p.footerProps?.className)}>
                  {p.footer}
                </ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
