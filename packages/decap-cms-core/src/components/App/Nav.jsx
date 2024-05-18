import React, { useMemo } from 'react';
import { translate } from 'react-polyglot';
import { NavLink as ReactRouterNavLink, useLocation } from 'react-router-dom';
import styled from '@emotion/styled';
import {
  NavMenu,
  NavMenuItem,
  NavMenuGroup,
  NavMenuGroupLabel,
  DecapMark,
} from 'decap-cms-ui-next';

import NestedCollection from '../Collection/NestedCollection';

const StyledCustomLogo = styled.img`
  width: 20px;
  margin: 0.375rem;
`;

function Nav({ collections, showMediaButton, hasWorkflow, siteUrl, logoUrl, t }) {
  const { pathname } = useLocation();

  const { activeNavLinkId } = useMemo(() => {
    const pathnameArray = pathname.split('/');

    if (pathnameArray.length === 0) {
      return { activeNavLinkId: 'dashboard' };
    }

    if (pathnameArray[1] === 'collections') {
      return { activeNavLinkId: `collections-${pathnameArray[2]}` };
    }

    return { activeNavLinkId: pathnameArray[1] };
  }, [pathname]);

  const startCollections = collections
    .filter(collection => collection.get('position') !== 'end')
    .toList();
  const endCollections = collections
    .filter(collection => collection.get('position') === 'end')
    .toList();

  function isExternalResource(collection) {
    return collection.get('url');
  }

  return (
    <NavMenu collapsable={true}>
      <NavMenuItem
        href={siteUrl}
        target="_blank"
        icon={logoUrl ? <StyledCustomLogo src={logoUrl} /> : <DecapMark size="20" />}
      >
        My Website
      </NavMenuItem>

      <NavMenuGroup>
        <NavMenuItem
          as={ReactRouterNavLink}
          to={'/dashboard'}
          active={activeNavLinkId === 'dashboard'}
          onClick={() => false}
          icon="layout"
        >
          Dashboard
        </NavMenuItem>

        {hasWorkflow && (
          <NavMenuItem
            as={ReactRouterNavLink}
            to={'/workflow'}
            active={activeNavLinkId === 'workflow'}
            icon="workflow"
          >
            {t('app.header.workflow')}
          </NavMenuItem>
        )}

        {showMediaButton && (
          <NavMenuItem
            as={ReactRouterNavLink}
            to={'/media'}
            active={activeNavLinkId === 'media'}
            icon="image"
          >
            Media
          </NavMenuItem>
        )}
      </NavMenuGroup>

      <NavMenuGroup>
        <NavMenuGroupLabel>{t('collection.sidebar.collections')}</NavMenuGroupLabel>

        {startCollections.map(collection => {
          const collectionName = collection.get('name');

          if (collection.has('nested')) {
            return (
              <li key={collectionName}>
                <NestedCollection collection={collection} data-testid={collectionName} />
              </li>
            );
          }

          return (
            <NavMenuItem
              as={ReactRouterNavLink}
              to={`/collections/${collectionName}`}
              key={`collections-${collectionName}`}
              active={activeNavLinkId === `collections-${collectionName}`}
              icon={
                collection.get('icon') ??
                (collection.get('type') === 'file_based_collection' ? 'file' : 'folder')
              }
            >
              {collection.get('label')}
            </NavMenuItem>
          );
        })}
      </NavMenuGroup>

      <NavMenuGroup end>
        {endCollections.map(collection => {
          const collectionName = collection.get('name');

          return (
            <NavMenuItem
              as={isExternalResource(collection) ? null : ReactRouterNavLink}
              href={isExternalResource(collection) ? collection.get('url') : null}
              to={`/collections/${collectionName}`}
              key={`collections-${collectionName}`}
              active={activeNavLinkId === `collections-${collectionName}`}
              icon={
                collection.get('icon') ??
                (collection.get('type') === 'file_based_collection' ? 'file' : 'folder')
              }
            >
              {collection.get('label')}
            </NavMenuItem>
          );
        })}
      </NavMenuGroup>
    </NavMenu>
  );
}

export default translate()(Nav);