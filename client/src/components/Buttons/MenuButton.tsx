import {ActionIcon, Drawer, NavLink, Stack} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {Link, useLocation} from 'react-router';
import {TbMenu2} from 'react-icons/tb';
import {sectionNavItems} from '../../navigation/sectionNav.ts';

export function MenuButton() {
    const location = useLocation();
    const [opened, {open, close}] = useDisclosure(false);

    const activeSection = location.pathname.split('/').filter(Boolean)[0] ?? '';

    return (
        <>
            <Drawer
                opened={opened}
                onClose={close}
                position="right"
                padding="md"
            >
                <Stack gap="xs">
                    {sectionNavItems.map(({path, label, Icon}) => (
                        <NavLink
                            key={path}
                            component={Link}
                            to={`/${path}`}
                            label={label}
                            leftSection={<Icon size={18}/>}
                            active={activeSection === path}
                            onClick={close}
                        />
                    ))}
                </Stack>
            </Drawer>

            <ActionIcon
                aria-label="Open menu"
                onClick={open}
            >
                <TbMenu2 size={20}/>
            </ActionIcon>
        </>
    );
}
