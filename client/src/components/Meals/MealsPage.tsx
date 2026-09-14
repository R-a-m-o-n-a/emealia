import "./MealsPage.css";
import {Title} from "@mantine/core";
import {ButtonGroup} from "../Buttons/ButtonGroup.tsx";
import {MenuButton} from "../Buttons/MenuButton.tsx";
import {SearchButton} from "../Buttons/SearchButton.tsx";
import {Navbar} from "../Navbar/Navbar.tsx";
import {MealsList} from "./MealsList/MealsList.tsx";

export function MealsPage() {
    return (
        <div className={"MealsPage"}>
            <Navbar>
                <Title>Meals</Title>
                <ButtonGroup>
                    <SearchButton/>
                    <MenuButton/>
                </ButtonGroup>
            </Navbar>
            <MealsList/>
        </div>
    );
}
