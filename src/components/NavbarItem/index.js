function NavbarItem({ image, title, onClick }) {
  return(
    <button onClick={onClick && onClick}>
      <img src={image} alt='' />
      <p>{title}</p>
    </button>
  );
}

export default NavbarItem;