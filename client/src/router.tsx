import { createBrowserRouter, Navigate } from 'react-router';
import { RootLayout } from './components/RootLayout';
import { MealDetailPage } from "./components/Meals/MealDetailPage.tsx";

// Placeholder view components
const MealsPage = () => <div>Meal List View</div>;
const AddMealPage = () => <div>Add Meal</div>;
const PlansPage = () => <div>Plans View</div>;

export const router = createBrowserRouter([
    {
        path: '/',
        Component: RootLayout,
        children: [
            {
                index: true,
                element: <Navigate to="/meals" replace />,
            },
            {
                path: 'meals',
                children: [
                    {
                        index: true,
                        Component: MealsPage,
                    },
                    {
                        path: 'add',
                        Component: AddMealPage,
                    },
                    {
                        path: ':id',
                        Component: MealDetailPage,
                        loader: /*async*/ ({params}) => {
                            // params are available in loaders/actions
                            // let team = await fetchTeam(params.teamId);
                            return {mealId: params.id};
                        },
                    },
                ]
            },
            {
                path: 'plans',
                Component: PlansPage,
            },
        ],
    },
]);
