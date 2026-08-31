import {createBrowserRouter, Navigate} from 'react-router';
import {RootErrorBoundary} from "./components/Errors/RootErrorBoundary.tsx";
import {FloatingNavLayout} from "./components/Layout/FloatingNavLayout.tsx";
import {RootLayout} from './components/Layout/RootLayout.tsx';
import {AddMealPage} from "./components/Meals/AddMeal/AddMealPage.tsx";
import {MealDetailPage} from "./components/Meals/MealDetail/MealDetailPage.tsx";
import {MealsPage} from "./components/Meals/MealsPage.tsx";
import {PlansPage} from "./components/Plans/PlansPage.tsx";
import type {AppRouteHandle} from './navigation/routeHandles.ts';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        ErrorBoundary: RootErrorBoundary,
        children: [
            {
                index: true,
                element: <Navigate to="/meals" replace/>,
            },
            {
                Component: FloatingNavLayout,
                handle: {showAppMenu: true} satisfies AppRouteHandle,
                children: [
                    {
                        path: 'meals',
                        Component: MealsPage,
                    },
                    {
                        path: 'plans',
                        Component: PlansPage,
                    },
                ],
            },
            {
                path: 'meals/add',
                Component: AddMealPage,
            },
            {
                path: 'meals/:id',
                Component: MealDetailPage,
                loader: /*async*/ ({params}) => {
                    // params are available in loaders/actions
                    // let team = await fetchTeam(params.teamId);
                    return {mealId: params.id};
                },
            },
        ],
    },
]);
