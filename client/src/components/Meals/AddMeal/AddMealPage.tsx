import "./AddMealPage.css";
import {BackButton} from "../../Buttons/BackButton.tsx";
import {DoneButton} from "../../Buttons/DoneButton.tsx";
import {Navbar} from "../../Navbar/Navbar.tsx";
import {EditMealForm} from "./EditMealForm.tsx";

export function AddMealPage() {
    return (
        <div className={"AddMealPage"}>
            <Navbar>
                <BackButton/>
                New Meal
                <DoneButton/>
            </Navbar>

            <EditMealForm/>
        </div>
    );
}
