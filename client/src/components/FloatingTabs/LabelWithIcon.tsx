import type {IconType} from "react-icons";
import "./LabelWithIcon.css";

interface LabelWithIconProps {
    label: string;
    Icon: IconType;
    value: string;
}

export function LabelWithIcon({label, Icon, value}: LabelWithIconProps) {
    return (
        <span className="LabelWithIcon" data-item-value={value}>
          <span className="LabelWithIcon-iconSlot" aria-hidden="true">
            <span className="LabelWithIcon-iconInner">
              <Icon/>
            </span>
          </span>
          <span className="LabelWithIcon-text">{label}</span>
        </span>
    );
}