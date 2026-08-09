import { Unready } from "@/components/site/Unready";

import { Heading } from "@/components/ui/heading";
import { CardBox, LStack } from "@/styled-system/jsx";
import { lstack } from "@/styled-system/patterns";

import { OAuth } from "./OAuth/OAuth";
import { Password } from "./Password/Password";
import { useAuthMethodSettings } from "./useAuthMethodSettings";

export function AuthMethodSettings() {
  const { ready, error, data } = useAuthMethodSettings();
  if (!ready) {
    return <Unready error={error} />;
  }

  const { active, available } = data;

  return (
    <CardBox className={lstack()} gap="4">
      <LStack>
        <Heading size="md">Способы входа</Heading>
        <p>
          Мы рекомендуем использовать больше способов входа. 
          Это поможет востановить аккаунт в случае утери одного из них
        </p>
      </LStack>

      {available.password && <Password active={active.password.length > 0} />}

      {/* NOTE: WebAuthn is not enabled as a 2FA yet. */}
      {/* {available.webauthn && <Devices active={active.webauthn} />} */}

      {(available.oauth.length > 0 || active.methods.length > 0) && (
        <OAuth active={active.methods} available={available.oauth} />
      )}
    </CardBox>
  );
}
