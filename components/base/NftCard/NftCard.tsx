import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Router from 'next/router';

import { NftType } from 'interfaces/index';

import Media from '../Media';
import { CAROUSEL_MODE, GRID_MODE } from './constants';
import { ModeType } from './interfaces';

export interface NftCardProps {
  children?: React.ReactNode;
  className?: string;
  item: NftType;
  mode?: ModeType;
  isDragging?: boolean;
  isHovering?: boolean;
  onMouseOver?: React.MouseEventHandler<HTMLDivElement> | undefined;
  onMouseOut?: React.MouseEventHandler<HTMLDivElement> | undefined;
}

const NftCard: React.FC<NftCardProps> = ({
  children,
  className,
  item,
  mode,
  isDragging,
  isHovering,
  onMouseOut,
  onMouseOver,
}) => {
  const [type, setType] = useState<string | null>(null);

  useEffect(() => {
    async function callBack() {
      try {
        let res = await fetch(item.properties?.preview.ipfs!, {
          method: 'HEAD',
        });
        setType(res.headers.get('Content-Type'));
        return res;
      } catch (err) {
        console.log('Error :', err);
      }
    }

    callBack();
  }, []);

  return (
    <SMediaWrapper
      onClick={() => !isDragging && Router.push(`/nft/${item.id}`)}
      className={className}
      mode={mode}
      onFocus={() => false}
      onBlur={() => false}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <Media src={item.properties?.preview.ipfs!} type={type} alt="imgnft" draggable="false" isHovering={isHovering} />
      {children}
    </SMediaWrapper>
  );
};

const SMediaWrapper = styled.div<{ mode?: ModeType }>`
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;
  border-radius: 12px;
  background: linear-gradient(180deg, #f29fff 0%, #878cff 100%);
  box-shadow: ${({ theme }) => theme.shadows.popupShadow};
  cursor: pointer;
  overflow: hidden;
  transform: translateZ(0);

  ${({ mode, theme }) => {
    switch (mode) {
      case CAROUSEL_MODE: {
        return `
          height: ${theme.sizes.cardHeight.sm};
          width: ${theme.sizes.cardWidth.sm};

          ${theme.mediaQueries.xxl} {
            height: ${theme.sizes.cardHeight.md};
            width: ${theme.sizes.cardWidth.md};
          }
        `;
      }
      case GRID_MODE: {
        return `
          height: ${theme.sizes.cardHeight.md};
          width: ${theme.sizes.cardWidth.md};

          ${theme.mediaQueries.sm} {
            height: ${theme.sizes.cardHeight.sm};
            width: ${theme.sizes.cardWidth.sm};
          }

          ${theme.mediaQueries.md} {
            height: ${theme.sizes.cardHeight.md};
            width: ${theme.sizes.cardWidth.md};
          }

          ${theme.mediaQueries.xxl} {
            height: ${theme.sizes.cardHeight.sm};
            width: ${theme.sizes.cardWidth.sm};
          }
        `;
      }
      default: {
        return `
          height: ${theme.sizes.cardHeight.sm};
          width: ${theme.sizes.cardWidth.sm};
        `
      }
    }
  }}
`;

export default NftCard;
