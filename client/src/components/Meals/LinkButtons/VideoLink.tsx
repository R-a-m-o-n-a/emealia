import {t} from "../../../utils/translate.ts";

import classes from "./VideoLink.module.css";

export function VideoLink({link}: { link: string }) {
    function openLink() {
        window.open(link);
    }

    return (
        <button className={classes.videoLink} onClick={openLink}>
            {t('Video')}
        </button>
    );
}
