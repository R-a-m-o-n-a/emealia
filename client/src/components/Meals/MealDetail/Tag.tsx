import "./Tag.css";

export function Tag({name}: { name: string }) {
    return (
        <div className={"Tag"}>
            {name}
        </div>
    );
}
