import "./RecipeLink.css";
import {t} from "../../../utils/translate.ts";

export function RecipeLink({link}: { link: string }) {
    function openLink() {
        window.open(link);
    }

    return (
        <button className={"RecipeLink"} onClick={openLink}>
            {t('Blog')}
        </button>
    );
}
