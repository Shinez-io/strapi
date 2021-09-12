/**
 *
 * DynamicZoneList
 *
 */

/* eslint-disable import/no-cycle */
import React, { useState } from 'react';
import { pxToRem } from '@strapi/helper-plugin';
import { AddIcon } from '@strapi/icons';
import { Box, Stack, Text } from '@strapi/parts';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import useDataManager from '../../hooks/useDataManager';
import getTrad from '../../utils/getTrad';
import ComponentCard from '../ComponentCard';
import ComponentList from '../ComponentList';
import Tr from '../Tr';

function DynamicZoneList({
  customRowComponent,
  components,
  addComponent,
  mainTypeName,
  name,
  targetUid,
}) {
  const { isInDevelopmentMode } = useDataManager();
  const [activeTab, setActiveTab] = useState(0);
  const { formatMessage } = useIntl();

  const toggle = tab => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleClickAdd = () => {
    addComponent(name);
  };

  const FixedBox = styled(Box)`
    height: ${pxToRem(90)};
    position: absolute;
    width: 100%;
    top: 0;
    left: 0;
  `;

  const ScrollableStack = styled(Stack)`
    width: 100%;
    overflow-x: auto;
  `;

  const ComponentContentBox = styled(Box)`
    padding-top: ${pxToRem(90)};
  `;

  const ComponentStack = styled(Stack)`
    flex-shrink: 0;
    width: ${pxToRem(140)};
    height: ${pxToRem(80)};
    justify-content: center;
    align-items: center;
  `;

  const StyledAddIcon = styled(AddIcon)`
    width: 32px;
    height: 32px;
    padding: 9px;
    border-radius: 64px;
    background: ${({ theme }) => theme.colors.primary100};
    path {
      fill: ${({ theme }) => theme.colors.primary600};
    }
  `;

  return (
    <Tr className="dynamiczone-row" isFromDynamicZone>
      <td colSpan={12}>
        <FixedBox paddingLeft={8}>
          <ScrollableStack horizontal size={2}>
            {isInDevelopmentMode && (
              <button type="button" onClick={handleClickAdd}>
                <ComponentStack as="button" size={1}>
                  <StyledAddIcon />
                  <Text small bold textColor="primary600">
                    {formatMessage({
                      id: getTrad('button.component.add'),
                      formatMessage: 'Add a component',
                    })}
                  </Text>
                </ComponentStack>
              </button>
            )}
            {components.map((component, index) => {
              return (
                <ComponentCard
                  key={component}
                  dzName={name}
                  index={index}
                  component={component}
                  isActive={activeTab === index}
                  isInDevelopmentMode={isInDevelopmentMode}
                  onClick={() => toggle(index)}
                />
              );
            })}
          </ScrollableStack>
        </FixedBox>
        <ComponentContentBox>
          {components.map((component, index) => {
            const props = {
              customRowComponent,
              component,
            };

            return (
              <Box
                tabId={`${index}`}
                key={component}
                style={{ display: activeTab === index ? 'block' : 'none' }}
              >
                <table>
                  <tbody>
                    <ComponentList
                      {...props}
                      isFromDynamicZone
                      dzName={name}
                      mainTypeName={mainTypeName}
                      targetUid={targetUid}
                      key={component}
                    />
                  </tbody>
                </table>
              </Box>
            );
          })}
        </ComponentContentBox>
      </td>
    </Tr>
  );
}

DynamicZoneList.defaultProps = {
  addComponent: () => {},
  components: [],
  customRowComponent: null,
  name: null,
};

DynamicZoneList.propTypes = {
  addComponent: PropTypes.func,
  components: PropTypes.instanceOf(Array),
  customRowComponent: PropTypes.func,
  mainTypeName: PropTypes.string.isRequired,
  name: PropTypes.string,
  targetUid: PropTypes.string.isRequired,
};

export default DynamicZoneList;