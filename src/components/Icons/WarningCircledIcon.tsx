import { SvgProps } from "../../types/Icon.type";

export const WarningCircledIcon = ({height = 24, width = 24}: SvgProps) => (
    <svg width={width} height={height} strokeWidth="1.5" viewBox="0 0 24 24" fill="none"
         xmlns="http://www.w3.org/2000/svg">
        <path d="M12 7v6M12 17.01l.01-.011M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
              stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
    </svg>
)
