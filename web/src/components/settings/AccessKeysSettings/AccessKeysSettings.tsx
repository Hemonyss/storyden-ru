import { formatDate } from "date-fns";

import { AccessKey, AccessKeyList } from "@/api/openapi-schema";
import { useConfirmation } from "@/components/site/useConfirmation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { AddIcon } from "@/components/ui/icons/Add";
import { CardBox, HStack, LStack, WStack, styled } from "@/styled-system/jsx";
import { CardBox as cardBox, lstack } from "@/styled-system/patterns";
import { useDisclosure } from "@/utils/useDisclosure";

import { CreateAccessKeyModal } from "./CreateAccessKeyModal";
import { useAccessKeySettings } from "./useAccessKeySettings";

type Props = {
  keys: AccessKeyList;
};

export function AccessKeysSettings({ keys }: Props) {
  const createModal = useDisclosure();

  const totalKeys = keys.length;
  const totalActiveKeys = keys.filter(isKeyActive).length;
  const hasInactive = totalKeys != totalActiveKeys;

  return (
    <>
      <CardBox className={lstack()} gap="8">
        <LStack>
          <Heading size="md">Ключи доступа</Heading>

          <p>
            Ключи доступа позволяют аутентифицировать запросы к API.
            Они обладают теми же правами доступа, что и ваша учетная запись.
            Если вашей учетной записи будут присвоены новые роли, ваши ключи доступа унаследуют права доступа, назначенные этим ролям.
          </p>
        </LStack>

        <LStack>
          <WStack alignItems="center" color="fg.muted">
            {hasInactive ? (
              <styled.p>
                {totalKeys} ключей доступа, {totalActiveKeys} активных.
              </styled.p>
            ) : (
              <styled.p>{keys.length} ключи доступа</styled.p>
            )}
            <Button size="xs" variant="subtle" onClick={createModal.onOpen}>
              <AddIcon />
              Создать
            </Button>
          </WStack>

          <AccessKeyItemList keys={keys} />
        </LStack>
      </CardBox>

      <CreateAccessKeyModal
        isOpen={createModal.isOpen}
        onClose={createModal.onClose}
      />
    </>
  );
}

function AccessKeyItemList({ keys }: Props) {
  const { revokeKey } = useAccessKeySettings();

  if (keys.length === 0) {
    return (
      <p style={{ color: "var(--colors-gray-500)", fontStyle: "italic" }}>
        Ключи доступа пока не созданы.
      </p>
    );
  }

  return (
    <ul className={lstack({ gap: "3" })}>
      {keys.map((key) => (
        <AccessKeyItem
          key={key.id}
          accessKey={key}
          onRevoke={() => revokeKey(key.id)}
        />
      ))}
    </ul>
  );
}

type AccessKeyItemProps = {
  accessKey: AccessKeyList[number];
  onRevoke: () => Promise<void>;
};

function AccessKeyItem({ accessKey, onRevoke }: AccessKeyItemProps) {
  const { isConfirming, handleConfirmAction, handleCancelAction } =
    useConfirmation(onRevoke);

  const isExpired = isKeyExpired(accessKey);

  const inactiveStatus = isExpired
    ? "Expired"
    : accessKey.enabled
      ? undefined
      : "Revoked";

  return (
    <li className={cardBox()}>
      <LStack>
        <WStack>
          <Heading size="sm">{accessKey.name}</Heading>

          {inactiveStatus === undefined ? (
            <HStack>
              {isConfirming ? (
                <>
                  <Button
                    size="xs"
                    variant="subtle"
                    bgColor="bg.destructive"
                    onClick={handleConfirmAction}
                  >
                    Подтвердить Отозвать
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={handleCancelAction}
                  >
                    Отозвать
                  </Button>
                </>
              ) : (
                <Button
                  size="xs"
                  variant="outline"
                  bgColor="bg.destructive"
                  onClick={handleConfirmAction}
                >
                  Подтвердить
                </Button>
              )}
            </HStack>
          ) : (
            <Badge>{inactiveStatus}</Badge>
          )}
        </WStack>

        <WStack flexWrap="wrap">
          <styled.p fontSize="xs">
            Создан: <time>{formatDate(accessKey.createdAt, "PPpp")}</time>
          </styled.p>

          {accessKey.expires_at && (
            <Badge gap="1">
              <span>Expiry:</span>
              <time>{formatDate(accessKey.expires_at, "PPpp")}</time>
            </Badge>
          )}
        </WStack>
      </LStack>
    </li>
  );
}

function isKeyActive(key: AccessKey) {
  return key.enabled && !isKeyExpired(key);
}

function isKeyExpired(key: AccessKey) {
  if (key.expires_at === undefined) {
    return false;
  }

  const expiryDate = new Date(key.expires_at);

  if (expiryDate > new Date()) {
    return false;
  }

  return true;
}
