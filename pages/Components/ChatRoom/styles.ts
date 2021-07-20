import styled from 'styled-components';

export const Container = styled.main`
  max-width: 728px;
  margin: 0 auto;
  text-align: center;
`;

export const Content = styled.div`
  padding: 10px;
  min-height: 85vh;
  margin: 10vh 0 5vh 0;
  overflow-y: hidden;
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 0.25rem;
    background: transparent;
  }

  &::-webkit-scrollbar-track {
    background: #1e1e24;
  }

  &::-webkit-scrollbar-thumb {
    background: #6649b8;
  }
`;

export const Chatroom = styled.ul`
  li {
    display: flex;
    align-items: center;
  }

  span {
    color: gray;
  }
`;

export const Chatform = styled.form`
  max-width: 728px;
  background: rgb(58, 58, 58);
  border-radius: 50px;
  height: 5vh;
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  font-size: 1.5em;

  input {
    line-height: 1.5;
    width: 100%;
    font-size: 1.5rem;
    background: rgb(58, 58, 58);
    color: white;
    outline: none;
    border: none;
    padding: 0 10px;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
  }

  button {
    width: 20%;
    background-color: rgb(56, 56, 143);
    color: white;
    cursor: pointer;
    padding: 5px 10px;
    font-size: 1.25rem;
    display: inline-block;
    border: none;
    text-align: center;
    border-top-right-radius: 50px;
    border-bottom-right-radius: 50px;
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
