import styled from '@emotion/styled';

export const editorStyleVars = {
  stickyDistanceBottom: '100px',
};

export const EditorControlBar = styled.div`
  z-index: 3;
  position: sticky;
  top: 0;
  margin-bottom: ${editorStyleVars.stickyDistanceBottom};
`;
