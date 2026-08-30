import { SegmentedControl } from '@mantine/core';
import { useLocation, useNavigate } from 'react-router';

export function FloatingTabs() {
    const location = useLocation();
    const navigate = useNavigate();

    const options = [
        {label: 'Meals', value: 'meals'},
        {label: 'Plans', value: 'plans'},
    ]
    // Match the active path, defaulting to the first item if no match exists
    const currentPath = options.find((item) => item.value === location.pathname)?.value;

    return (
        <SegmentedControl value={currentPath} onChange={(value) => navigate(value)} withItemsBorders={false} size="md" radius="xl" data={options} />
    );
}
