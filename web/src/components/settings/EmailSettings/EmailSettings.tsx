import { useState } from "react";

import { Account } from "@/api/openapi-schema";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { AddIcon } from "@/components/ui/icons/Add";
import { CardBox, LStack, WStack, styled } from "@/styled-system/jsx";
import { lstack } from "@/styled-system/patterns";

import { EmailCard } from "./EmailCard";
import { EmailCreateForm } from "./EmailCreateForm";

export type Props = {
  account: Account;
};

export function useEmailSettings({ account }: Props) {
  const [adding, setAdding] = useState(false);

  async function handleStartNewEmail() {
    setAdding(true);
  }

  async function handleCancelNewEmail() {
    setAdding(false);
  }

  async function handleFinishNewEmail() {
    setAdding(false);
  }

  return {
    data: {
      emails: account.email_addresses,
      adding,
    },
    handlers: {
      handleStartNewEmail,
      handleCancelNewEmail,
      handleFinishNewEmail,
    },
  };
}

export function EmailSettings(props: Props) {
  const { data, handlers } = useEmailSettings(props);

  return (
    <CardBox className={lstack()} gap="4">
      <LStack>
        <Heading size="md">Email settings</Heading>
        <p>
          Управляйте своими EMAIL-адресами тут. Вы можете добавить несколько адресов и использовать их для входа в аккаунт.
          Почта будет использоваться для отправки новостей, сообщений и другой информации.
        </p>
      </LStack>

      <LStack>
        <WStack>
          <Heading size="sm">EMAIL-адреса</Heading>
          <Button
            size="xs"
            variant="subtle"
            onClick={handlers.handleStartNewEmail}
          >
            <AddIcon /> новый адрес
          </Button>
        </WStack>

        {data.emails.length === 0 ? (
          <styled.p color="fg.muted">
            К вашей учетной записи не привязано ни одного адреса электронной почты.
          </styled.p>
        ) : (
          data.emails.map((email) => <EmailCard key={email.id} email={email} />)
        )}

        {data.adding && (
          <EmailCreateForm
            onCancel={handlers.handleCancelNewEmail}
            onSuccess={handlers.handleFinishNewEmail}
          />
        )}
      </LStack>
    </CardBox>
  );
}
