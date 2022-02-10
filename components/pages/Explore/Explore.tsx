import React, { useState } from 'react';
import styled from 'styled-components';

import { getNFTs } from 'actions/nft';
import { SortDate, SortPopularity } from 'components/base/FiltersSort';
import { ModalFilters, ModalSort } from 'components/base/Modal';
import NftsGrid from 'components/base/NftsGrid';
import Button from 'components/ui/Button';
import { Container, Title, Wrapper } from 'components/layout';
import { EXPLORE_TAB } from 'components/pages/Profile';
import { CustomResponse, NftType } from 'interfaces';

import { FiltersSortDefaultState, CATEGORIES_FILTER } from './constants';
import { FiltersType, SortTypesType } from './interfaces';

const filterSortPromiseMapping = (filtersSort: FiltersType & SortTypesType, currentPage: number): Promise<CustomResponse<NftType>> => {
  const categoryCodes = filtersSort[CATEGORIES_FILTER];
  if (categoryCodes !== null) {
    return getNFTs(categoryCodes, (currentPage + 1).toString(), undefined, true);
  } else {
    console.log('default');
    return getNFTs(undefined, (currentPage + 1).toString(), undefined, true);
  }
};

export interface ExploreProps {
  NFTs: NftType[];
  hasNextPage: boolean;
  totalCount?: number;
}

const Explore: React.FC<ExploreProps> = ({ NFTs, hasNextPage, totalCount }) => {
  const [filtersSort, setFiltersSort] = useState<FiltersType & SortTypesType>(FiltersSortDefaultState);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataNfts, setDataNfts] = useState(NFTs);
  const [dataNftsHasNextPage, setDataNftsHasNextPage] = useState(hasNextPage);
  const [dataTotalCount] = useState(totalCount ?? 0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadMoreLoading, setIsLoadMoreLoading] = useState(false);
  const [isModalFiltersExpanded, setIsModalFiltersExpanded] = useState(false);
  const [isModalSortDateExpanded, setIsModalSortDateExpanded] = useState(false);
  const [isModalSortPopularityExpanded, setIsModalSortPopularityExpanded] = useState(false);

  const toggleModalFiltersExpanded = () => {
    setIsModalFiltersExpanded((prevState) => !prevState);
  };

  const toggleModalSortDateExpanded = () => {
    setIsModalSortDateExpanded((prevState) => !prevState);
  };

  const toggleModalSortPopularityExpanded = () => {
    setIsModalSortPopularityExpanded((prevState) => !prevState);
  };

  const loadMoreNfts = async () => {
    setIsLoadMoreLoading(true);
    try {
      if (dataNftsHasNextPage) {
        const promise = filterSortPromiseMapping(filtersSort, currentPage);
        const { data, hasNextPage } = (await promise) ?? { data: [], hasNextPage: false };
        setCurrentPage((prevCount) => prevCount + 1);
        setDataNftsHasNextPage(hasNextPage);
        setDataNfts((prevState) => prevState.concat(data));
        setIsLoadMoreLoading(false);
      }
    } catch (err) {
      console.log(err);
      setIsLoadMoreLoading(false);
    }
  };

  return (
    <>
      <Container>
        <Wrapper>
          <STopContainer>
            <STitleContainer>
              <STitle>Explore</STitle>
              {/* TODO: add totalCount based on filters, remove filtersSort condition */}
              {dataTotalCount > 0 && !Object.values(filtersSort).some((item) => item !== null) && (
                <STotalInsight>{`${dataTotalCount} NFTs to discover`}</STotalInsight>
              )}
            </STitleContainer>
            <SFiltersButtonContainer>
              <SSortButton onClick={toggleModalSortDateExpanded}>Sort by date</SSortButton>
              <SSortButton onClick={toggleModalSortPopularityExpanded}>Sort by popularity</SSortButton>
              <Button color="primary500" icon="filters" onClick={toggleModalFiltersExpanded} size="medium" text="Filters" variant="contained" />
            </SFiltersButtonContainer>
          </STopContainer>
          <NftsGrid
            NFTs={dataNfts}
            isLoading={isLoading}
            isLoadMoreLoading={isLoadMoreLoading}
            isLoadMore={dataNftsHasNextPage}
            loadMore={loadMoreNfts}
            noNftBody={
              <>
                Come later to discover new NFTs.
                <br />
                <br />
                Thanks !
              </>
            }
            noNftTitle="All NFTs are sold !"
            tabId={EXPLORE_TAB}
          />
        </Wrapper>
      </Container>
      {isModalSortDateExpanded && (
        <ModalSort setIsExpanded={setIsModalSortDateExpanded} title="Sort">
          <SortDate />
        </ModalSort>
      )}
      {isModalSortPopularityExpanded && (
        <ModalSort setIsExpanded={setIsModalSortPopularityExpanded} title="Sort">
          <SortPopularity />
        </ModalSort>
      )}
      {isModalFiltersExpanded && (
        <ModalFilters
          filters={filtersSort}
          setData={setDataNfts}
          setDataHasNextPage={setDataNftsHasNextPage}
          setDataCurrentPage={setCurrentPage}
          setDataIsLoading={setIsLoading}
          setIsExpanded={setIsModalFiltersExpanded}
          setFilters={setFiltersSort}
        />
      )}
    </>
  );
};

const STopContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
  }
`;

const STitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    align-items: baseline;
  }
`;

const STitle = styled(Title)`
  font-size: 3.2rem;

  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 4.8rem;
    margin: 0 auto;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    font-size: 4.8rem;
    margin: 0;
  }
`;

const STotalInsight = styled.span`
  color: ${({ theme }) => theme.colors.neutral300};
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 1.6rem;
  margin-top: 0.8rem;

  ${({ theme }) => theme.mediaQueries.lg} {
    margin-top: 0;
    margin-left: 1.6rem;
  }
`;

const SFiltersButtonContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 2.4rem;

  > * {
      &:not(:first-child) {
        margin-top: 0.8rem;
      }
    }

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    
    > * {
      &:not(:first-child) {
        margin-left: 1.6rem;
        margin-top: 0;
      }
    }
  }
`;

const SSortButton = styled.button`
  color: ${({ theme }) => theme.colors.contrast};
  font-family: ${({ theme }) => theme.fonts.bold};
  font-size: 1.6rem;
  text-decoration-line: underline;
`;

export default Explore;
