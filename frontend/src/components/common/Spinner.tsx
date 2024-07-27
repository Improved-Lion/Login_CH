import styled from "styled-components";

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  background-color: #fff8e1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const Spinner = () => {
  return (
    <SpinnerContainer>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        width="200"
        height="200"
        style={{
          shapeRendering: "auto",
          display: "block",
          background: "transparent",
        }}
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <g>
          <path
            stroke="none"
            fill="#ffa000"
            d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
          >
            <animateTransform
              values="0 50 51;360 50 51"
              keyTimes="0;1"
              repeatCount="indefinite"
              dur="1s"
              type="rotate"
              attributeName="transform"
            ></animateTransform>
          </path>
          <g></g>
        </g>
      </svg>
    </SpinnerContainer>
  );
};

export default Spinner;
