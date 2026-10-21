import {t} from "../../../utils/translate.ts";

import classes from "./RecipeLink.module.css";

export function RecipeLink({link}: { link: string }) {
    function openLink() {
        window.open(link);
    }

    return (
        <button className={classes.recipeLink} onClick={openLink}>
            {t('Blog')}
        </button>
    );
}
