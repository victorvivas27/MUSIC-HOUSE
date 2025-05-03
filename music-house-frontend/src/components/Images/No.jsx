export const No = ({ size = 60, color = 'black', fontSize = 50 }) => {
  return (
    <svg
      
      width={size}
      height={size /2}
      viewBox="0 0 100 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="0"
        y="35"
        fontSize={fontSize}
        fill={color}
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >
        NO
      </text>
    </svg>
  )
}