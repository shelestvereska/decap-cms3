import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import { Icon, lengths, colors, zIndex } from 'netlify-cms-ui-default';

const SearchContainer = styled.div`
  height: 37px;
  display: flex;
  align-items: center;
  position: relative;
  width: 400px;
  @media (max-width: 800px) {
    width: auto;
  }
`;

const SearchInput = styled.input`
  background-color: #eff0f4;
  border-radius: ${lengths.borderRadius};

  font-size: 14px;
  padding: 10px 6px 10px 32px;
  width: 100%;
  position: relative;
  z-index: ${zIndex.zIndex1};

  &:focus {
    outline: none;
    box-shadow: inset 0 0 0 2px ${colors.active};
  }
`;

const SearchIcon = styled(Icon)`
  position: absolute;
  top: 50%;
  left: 6px;
  z-index: ${zIndex.zIndex2};
  transform: translate(0, -50%);
`;

const MediaLibrarySearch = ({ value, onChange, onKeyDown, placeholder, disabled }) => (
  <SearchContainer>
    <SearchIcon type="search" size="small" />
    <SearchInput
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabled}
    />
  </SearchContainer>
);

MediaLibrarySearch.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
};

export default MediaLibrarySearch;
