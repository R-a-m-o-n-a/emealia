import {useMatches} from 'react-router';
import type {AppRouteHandle} from '../../navigation/routeHandles.ts';

export function useShowAppMenu() {
    const matches = useMatches();

    return matches.some(
        (match) => (match.handle as AppRouteHandle | undefined)?.showAppMenu === true,
    );
}
