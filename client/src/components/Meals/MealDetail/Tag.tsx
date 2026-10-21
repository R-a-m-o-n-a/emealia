import classes from "./Tag.module.css";

export function Tag({name}: { name: string }) {
    return (
        <div className={classes.tag}>
            {name}
        </div>
    );
}
