import React from "react";
import { NavLink } from "react-router-dom";
import "./NavMenu.css";

function NavMenu({ listOfItems }) {
  return (
    <nav>
      <ul className="navList">
        {listOfItems.map((item) => (
          <li key={item}>
            <NavLink
              to={`/${item}`}
              className="link"
              activeStyle={{
                color: "#000",
              }}
            >
              {item}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavMenu;
