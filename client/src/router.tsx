import {createBrowserRouter, Navigate} from 'react-router';
import {RootLayout} from './components/Layout/RootLayout.tsx';
import {MealDetailPage} from "./components/Meals/MealDetailPage.tsx";
import {FloatingNavLayout} from "./components/Layout/FloatingNavLayout.tsx";

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
                element: <Navigate to="/meals" replace/>,
            },
            {
                Component: FloatingNavLayout,
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
