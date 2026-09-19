import "./VideoLink.css";
import {t} from "../../../utils/translate.ts";

export function VideoLink({link}: { link: string }) {
    function openLink() {
        window.open(link);
    }

    return (
        <button className={"RecipeLink"} onClick={openLink}>
            {t('Video')}
        </button>
    );
}
