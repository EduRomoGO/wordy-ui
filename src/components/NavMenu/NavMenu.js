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

const NavItem = ({ item }) => {
  return (
    <li>
      <NavLink
        css={css`
          color: #ababab;
          text-decoration: none;
        `}
        to={`/${item}`}
        activeStyle={{
          color: "#000",
        }}
      >
        {item}
      </NavLink>
    </li>
  );
};

function NavMenu({ listOfItems }) {
  return (
    <nav
      css={css`
        border-bottom: 1px solid #ababab;
      `}
    >
      <NavList>
        <NavItem item="words" />
        <NavItem item="phonemes" />
        <NavItem item="spell" />
      </NavList>
    </nav>
  );
}

export default NavMenu;
