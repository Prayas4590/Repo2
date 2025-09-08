import React from "react";

interface MdIconProps {
  name: string;
  size?: number; // px
  fill?: 0 | 1;
  weight?: number; // 100..700
  grade?: number; // -50..200
  opticalSize?: number; // 20..48
  className?: string;
  "aria-label"?: string;
}

export const MdIcon: React.FC<MdIconProps> = ({
  name,
  size = 24,
  fill = 0,
  weight = 400,
  grade = 0,
  opticalSize = 24,
  className = "",
  ...rest
}) => {
  return (
    <span
      className={`material-symbols-rounded ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
        fontSize: size,
        lineHeight: 1,
        display: 'inline-block',
      }}
      aria-hidden={rest["aria-label"] ? undefined : true}
      {...rest}
    >
      {name}
    </span>
  );
};

export default MdIcon;
