function NavbarItem({ image, title }) {
  return(
    <button>
      <img src={image} alt='' />
      <p>{title}</p>
    </button>
  );
}

export default NavbarItem;