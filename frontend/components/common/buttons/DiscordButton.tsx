import { Button, ButtonProps } from '@mantine/core';
import { IconBrandDiscord } from '@tabler/icons-react';

function DiscordIcon() {
  return (
    <IconBrandDiscord stroke={2} />
  );
}

export function DiscordButton(props: ButtonProps & React.ComponentPropsWithoutRef<'button'>) {
  return <Button leftSection={<DiscordIcon />} variant="default" {...props} />;
}