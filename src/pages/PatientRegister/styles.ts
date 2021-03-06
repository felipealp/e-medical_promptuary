import styled from 'styled-components';
import colors from '../../styles/colors';

export const StyledContentPatientRegister = styled.div`
  height: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .action {
    display: grid;
    grid-template-columns: 3fr 1fr;
    padding: 1rem;
    display: flex;

    margin-top: 3rem;

    div {
      text-align: center;
      max-width: 350px;
      margin: 0 2rem;
      font-size: 15px;
      color: ${colors.primaryColor};
    }
  }
`;

export const StyledButton = styled.div`
  margin: 0 30px;
  padding: 10px 15px;
  border-radius: 3px;
  cursor: pointer;
  color: ${colors.white} !important;
  background: ${colors.primaryColor};

  &:hover {
    background: ${colors.boxShadow};
    color: ${colors.primaryColor}!important;
  }
`;

export const StyledForm = styled.div`
  width: 820px;
  padding: 1rem;
  margin-top: 1rem;
`;
