import "./AddMealPage.css";
import {BackButton} from "../../Buttons/BackButton.tsx";
import {DoneButton} from "../../Buttons/DoneButton.tsx";
import {Navbar} from "../../Navbar/Navbar.tsx";

export function AddMealPage({}) {
    return (
        <div className={"AddMealPage"}>
            <Navbar>
                <BackButton/>
                New Meal
                <DoneButton/>
            </Navbar>
            Add Meal
        </div>
    );
}
