export default function Logo({ size = 64 }) {
  return (
    <img
      src="logo-chefgen.png"
      alt="ChefGen Logo"
      width={size}
      height={size}
      className="logo-img"
      style={{
        objectFit: "contain",
        borderRadius: "8px",
      }}
    />
  );
}
