import React from "react";
import { Link } from "react-router-dom";
import "./NavMenu.css";

function NavMenu({ listOfItems, action, state }) {
  console.log(listOfItems);

  return (
    <nav>
      <ul className="navList">
        {listOfItems.map((item) => (
          <li key={item}>
            <Link
              to={`/${item}`}
              className={`link ${state === item ? "active" : ""} `}
              onClick={(e) => {
                action(item);
              }}
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default NavMenu;
