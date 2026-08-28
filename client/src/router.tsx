import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from './components/RootLayout';

// Placeholder view components
const MealsPage = () => <div>Meal List View</div>;
const MealDetailPage = () => <div>Meal Detail View</div>;
const AddMealPage = () => <div>Add Meal</div>;
const PlansPage = () => <div>Plans View</div>;

export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <MealsPage />,
            },
            {
                path: 'meals/add',
                element: <AddMealPage />,
            },
            {
                path: 'meals/:id',
                element: <MealDetailPage />,
            },
            {
                path: 'plans',
                element: <PlansPage />,
            },
        ],
    },
]);
