import { AuthMode, RegistrationMode } from "@/api/openapi-schema";
import { authProviderList } from "@/api/openapi-server/auth";
import { VStack, styled } from "@/styled-system/jsx";

import { RegisterEmailForm } from "./RegisterEmail/RegisterEmailForm";
import { RegisterHandleForm } from "./RegisterHandle/RegisterHandleForm";
import { RegisterPhoneForm } from "./RegisterPhone/RegisterPhoneForm";

type Props = {
  invitationID?: string;
  registrationMode: RegistrationMode;
};

export async function RegisterScreen({
  invitationID,
  registrationMode,
}: Props) {
  const { data } = await authProviderList({
    cache: "no-store",
  });

  const isInviteOnly = registrationMode === RegistrationMode.invitation;
  if (isInviteOnly && !invitationID) {
    return (
      <VStack textAlign="center">
        <styled.h1 fontWeight="bold">Регистрация осуществляется только по приглашению.</styled.h1>
        <styled.p color="fg.muted" textWrap="balance">
          Обратитесь к участнику сообщества или администратору за ссылкой-приглашением для присоединения.
        </styled.p>
      </VStack>
    );
  }

  const isDisabled = registrationMode === RegistrationMode.disabled;
  if (isDisabled) {
    return (
      <VStack textAlign="center">
        <styled.h1 fontWeight="bold">
          Регистрация в данный момент закрыта.
        </styled.h1>
        <styled.p color="fg.muted" textWrap="balance">
          публичная регистрация аккаунтов закрыта.
        </styled.p>
      </VStack>
    );
  }

  switch (data.mode) {
    case AuthMode.handle:
      return (
        <RegisterHandleForm webauthn={false} invitationID={invitationID} />
      );

    case AuthMode.email:
      return <RegisterEmailForm invitationID={invitationID} />;

    case AuthMode.phone:
      return <RegisterPhoneForm />;

    default:
      console.error("no authentication modes available");

      return (
        <VStack>
          <p>This instance is private.</p>
        </VStack>
      );
  }
}
