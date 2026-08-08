import { UnreadyBanner } from "@/components/site/Unready";

import { LinkButton } from "@/components/ui/link-button";
import { VStack } from "@/styled-system/jsx";

export function NodeNotFoundError() {
  return (
    <VStack p="4" h="dvh" justify="center">
      <VStack maxW="sm" minH="60" gap="8">
        <UnreadyBanner error="Ссылка на эту страницу никуда не вела." />
        <LinkButton variant="subtle" href="/l">
          Библиотека
        </LinkButton>
      </VStack>
    </VStack>
  );
}
