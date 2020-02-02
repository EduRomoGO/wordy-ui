import React from 'react'
import './NavMenu.css';

const NavMenu = ({
  listOfItems,
  action,
  state
}) => (
  <nav>
    <ul 
      className="navList"
    >
      {listOfItems.map((item) => (
        <li
          key={item}
        >
          <a
            className={`link ${state === item ? 'active' : ''} `}
            onClick={(e) => {
              e.preventDefault()
              action(item)
            }}
            href={item}
          >
            {item}
          </a>
        </li>
      ))}
    </ul>
  </nav>
)

export default NavMenu
