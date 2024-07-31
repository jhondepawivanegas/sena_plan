import styled from "styled-components";
import {
  LinksArray,
  SecondarylinksArray,
  SidebarCard,
} from "../../../index";
import { v } from "../../../styles/variables";
import { NavLink } from "react-router-dom";

export function Sidebar({ state, setState }) {
  return (
    <Main $isopen={state.toString()}>
      <span className="Sidebarbutton" onClick={() => setState(!state)}>
        {/* Puedes reemplazar el ícono según tu diseño */}
        <v.iconoflechaderecha />
      </span>
      <Container $isopen={state.toString()} className={state ? "active" : ""}>
        <div className="Logocontent">
          <div className="imgcontent">
            <img src={v.logo} alt="Logo" />
          </div>
          <h2>Time</h2>
        </div>
        {LinksArray.map(({ icon, label, to }) => (
          <LinkContainer key={label}>
            <NavLink
              to={to}
              className={({ isActive }) => `Links${isActive ? ` active` : ``}`}
            >
              <div className="Linkicon">{icon}</div>
              <span className={state ? "label_ver" : "label_oculto"}>
                {label}
              </span>
            </NavLink>
          </LinkContainer>
        ))}
        <Divider />
        {SecondarylinksArray.map(({ icon, label, to }) => (
          <LinkContainer key={label}>
            <NavLink
              to={to}
              className={({ isActive }) => `Links${isActive ? ` active` : ``}`}
            >
              <div className="Linkicon">{icon}</div>
              <span className={state ? "label_ver" : "label_oculto"}>
                {label}
              </span>
            </NavLink>
          </LinkContainer>
        ))}
        {/* Eliminado ToggleTema */}
        <Divider />
        {state && <SidebarCard />}
      </Container>
    </Main>
  );
}

const Container = styled.div`
  color: ${v.gray};
  background: ${v.gray};
  position: fixed;
  padding-top: 20px;
  z-index: 1;
  height: 100%;
  width: 65px;
  transition: 0.3s ease-in-out;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 6px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${v.gray};
    border-radius: 10px;
  }

  &.active {
    width: 220px;
  }

  .Logocontent {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 60px;
    transition: 0.3s ease-in-out;
    .imgcontent {
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.3s ease-in-out;
      cursor: pointer;
      img {
        width: ${({ $isopen }) => ($isopen === "true" ? "120px" : "50px")}; /* Ajusta el tamaño aquí */
        height: auto;
        transition: width 0.3s ease-in-out;
        animation: flotar 1.7s ease-in-out infinite alternate;
      }
    }
    h2 {
      display: ${({ $isopen }) => ($isopen === "true" ? `block` : `none`)};
      font-size: 1.5em;
      font-weight: bold;
      color: ${v.primary};
      margin-left: 10px;
      transition: 0.3s ease-in-out;
    }
    @keyframes flotar {
      0% {
        transform: translate(0, 0px);
      }
      50% {
        transform: translate(0, 4px);
      }
      100% {
        transform: translate(0, -0px);
      }
    }
  }
`;

const LinkContainer = styled.div`
  margin: 5px 0;
  transition: all 0.3s ease-in-out;
  padding: 0 5%;
  position: relative;
  &:hover {
    background: ${v.gray};
  }
  .Links {
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: calc(${() => v.smSpacing} - 2px) 0;
    color: ${v.gray};
    height: 60px;
    .Linkicon {
      padding: ${() => v.smSpacing} ${() => v.mdSpacing};
      display: flex;
      svg {
        font-size: 25px;
      }
    }
    .label_ver {
      transition: 0.3s ease-in-out;
      opacity: 1;
    }
    .label_oculto {
      opacity: 0;
    }
    &.active {
      color: ${v.gold};
      font-weight: 600;
      &::before {
        content: "";
        position: absolute;
        height: 100%;
        background: ${v.gold};
        width: 4px;
        border-radius: 10px;
        left: 0;
      }
    }
  }
  &.active {
    padding: 0;
  }
`;

const Main = styled.div`
  .Sidebarbutton {
    position: fixed;
    top: 70px;
    left: 42px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${v.primary}; /* Cambiado para un color específico */
    box-shadow: 0 0 4px ${v.gray},
      0 0 7px ${v.gray};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    z-index: 2;
    transform: ${({ $isopen }) =>
      $isopen === "true"
        ? `translateX(162px) rotate(3.142rad)`
        : `initial`};
    color: ${v.text}; /* Cambiado para un color específico */
  }
`;

const Divider = styled.div`
  height: 1px;
  width: 100%;
  background: ${v.gray}; /* Cambiado para un color específico */
  margin: ${() => v.lgSpacing} 0;
`;
