/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

const NavList = styled.ul`
  display: flex;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  width: 320px;
  margin: 25px auto;
  text-transform: uppercase;
  font-weight: 700;
`;

function NavMenu({ listOfItems }) {
  return (
    <nav
      css={css`
        border-bottom: 1px solid #ababab;
      `}
    >
      <NavList className="navList">
        {listOfItems.map((item) => (
          <li key={item}>
            <NavLink
              to={`/${item}`}
              css={css`
                color: #ababab;
                text-decoration: none;
              `}
              activeStyle={{
                color: "#000",
              }}
            >
              {item}
            </NavLink>
          </li>
        ))}
      </NavList>
    </nav>
  );
}

export default NavMenu;
