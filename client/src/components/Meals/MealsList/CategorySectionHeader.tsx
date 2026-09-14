import "./CategorySectionHeader.css";

export function CategorySectionHeader({name, id}: { name: string; id: string }) {
    return (
        <div className={"CategorySectionHeader"}>
            <h2>{name}</h2>
        </div>
    );
}
