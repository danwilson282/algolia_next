'use client';

import algoliasearch from 'algoliasearch/lite';
import { Hit as AlgoliaHit } from 'instantsearch.js';
import React from 'react';
import {
  SearchBox,
  RefinementList,
  useRefinementList,
  UseRefinementListProps,
  DynamicWidgets,
  useHits,
  UseHitsProps,
  useMenu,
  UseMenuProps,
  ClearRefinements,
  SortBy,
  Pagination,
  HitsPerPage,
} from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

import { Panel } from '../components/Panel';

const client = algoliasearch('5E8H3EJ5AY', '402d8891ec371895bc566751725f5898');

type HitProps = {
  hit: AlgoliaHit<{
    HEADWORD: string;
    ENGLISH_EQUIVALENT: string;
    PART_OF_SPEECH: string;
    TIER_DISPLAY: string;
    FILENAME: string;
  }>;
};

function MenuSelect(props: UseMenuProps) {
  const { items, refine } = useMenu(props);
  const { value: selectedValue } = items.find((item) => item.isRefined) || {
    value: '',
  };

  return (
    <select
      value={selectedValue}
      onChange={(event) => {
        let element: HTMLElement = document.getElementById('clear')?.children[0] as HTMLElement;
        element.click()
        refine((event.target as HTMLSelectElement).value);
      }}
    >
      <option value="">Show all</option>
      {items.map((item) => (
        <option value={item.value}>
          {item.label} ({item.count})
        </option>
      ))}
    </select>
  );
}

function CustomHits(props: UseHitsProps) {
  const { hits } = useHits(props);

  return (
    <table>
            <thead>
              <tr>
                <th>Word</th>
                <th>Translation</th>
                <th>Part of speech</th>
                <th>Tier</th>
                <th>Download</th>
              </tr>
            </thead>
            <tbody>
              {hits.map((hit:AlgoliaHit):React.ReactNode => (
                <tr>
                <td><span className="Hit-headword">{hit.HEADWORD}</span></td>
                <td><span className="Hit-english">{hit.ENGLISH_EQUIVALENT}</span></td>
                <td><span className="Hit-part">{hit.PART_OF_SPEECH}</span></td>
                <td><span className="Hit-tier">{hit.TIER_DISPLAY}</span></td>
                <td><a href={hit.FILENAME} className="Hit-part">Download</a></td>
              </tr>
              ))}
            </tbody>
          </table>
  );
}

function CustomRefinementList(props: UseRefinementListProps) {
  const {
    items,
    refine,
    searchForItems,
    canToggleShowMore,
    isShowingMore,
    toggleShowMore,
  } = useRefinementList(props);

  return (
    <>
      <ul className="o-list-bare u-mb0">
        {items.map((item) => (
          <li key={item.label}>
            <div className="row">
              <div className="col-xs col-xs-1">
              <input
                type="checkbox"
                checked={item.isRefined}
                onChange={() => refine(item.value)}
              />
              </div>
              <div className="col-xs col-xs-11">
                <span>{item.label}</span>
                <span> ({item.count})</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Search() {
  return (
    <InstantSearchNext searchClient={client} indexName="aqa-audio-files" routing>
      <div className="Container row">
        <div className="col-xs col-xs-4 bg-grey-lightest">
        <SearchBox className="c-searchbox__field col-xs col-xs-12" placeholder="Search audio files" />
          <div className="c-modal--overlay__container">
            <div className="c-accordion u-sm-p1-5">
              <div className="row">
                <div className="col-xs u-mt1">
                  <ClearRefinements></ClearRefinements>
                </div>
              </div>
            <div className="panel-group flb-panel">
              <dl className="c-accordion">
                <div className="panel panel-default">
                  <dt className="panel-heading">
                    <span className="c-accordion__title c-accordion__title__btn is-expanded">Theme 1: People and lifestyle</span>
                  </dt>
                  <dd className="c-accordion__item is-scrollable is-expanded bg-color-white">
                  <MenuSelect attribute="A_PEOPLE_AND_LIFESTYLE"/>
                  </dd>
                </div>
                <div className="panel panel-default">
                  <dt className="panel-heading">
                    <span className="c-accordion__title c-accordion__title__btn is-expanded">Theme 2: Popular culture</span>
                  </dt>
                  <dd className="c-accordion__item is-scrollable is-expanded bg-color-white">
                  <MenuSelect attribute="B_POPULAR_CULTURE"/>
                  </dd>
                </div>
                <div className="panel panel-default">
                  <dt className="panel-heading">
                    <span className="c-accordion__title c-accordion__title__btn is-expanded">Theme 3: Communication</span>
                  </dt>
                  <dd className="c-accordion__item is-scrollable is-expanded bg-color-white">
                  <MenuSelect attribute="C_COMMUNICATION"/>
                  </dd>
                </div>
                <div className="panel panel-default">
                  <dt className="panel-heading">
                    <span className="c-accordion__title c-accordion__title__btn is-expanded">General</span>
                  </dt>
                  <dd className="c-accordion__item is-scrollable is-expanded bg-color-white">
                    <CustomRefinementList attribute="GENERAL"/>
                  </dd>
                </div>
                <div className="panel panel-default">
                  <dt className="panel-heading">
                    <span className="c-accordion__title c-accordion__title__btn is-expanded">Cultural</span>
                  </dt>
                  <dd className="c-accordion__item is-scrollable is-expanded bg-color-white">
                    <CustomRefinementList attribute="CULTURAL"/>
                  </dd>
                </div>
                <div className="panel panel-default">
                  <dt className="panel-heading">
                    <span className="c-accordion__title c-accordion__title__btn is-expanded">Tier</span>
                  </dt>
                  <dd className="c-accordion__item is-scrollable is-expanded bg-color-white">
                    <CustomRefinementList attribute="TIER"/>
                  </dd>
                </div>
                <div className="panel panel-default">
                  <dt className="panel-heading">
                    <span className="c-accordion__title c-accordion__title__btn is-expanded">Part of speech</span>
                  </dt>
                  <dd className="c-accordion__item is-scrollable is-expanded bg-color-white">
                    <CustomRefinementList attribute="PART_OF_SPEECH"/>
                  </dd>
                </div>
                <div className="panel panel-default">
                  <dt className="panel-heading">
                    <span className="c-accordion__title c-accordion__title__btn is-expanded">Sort by:</span>
                  </dt>
                  <dd className="c-accordion__item is-scrollable is-expanded bg-color-white">
                  <SortBy
                    items={[
                      { label: 'Word', value: 'headword_asc' },
                      { label: 'Translation', value: 'trans_asc' },
                      { label: 'Part of speech', value: 'part_asc' },
                      { label: 'Tier', value: 'tier_asc' },
                    ]}
                  />
                  </dd>
                </div>
              </dl>
            </div>
            </div>
          </div>
          <ClearRefinements id="clear" style={{display:'none'}} includedAttributes={['A_PEOPLE_AND_LIFESTYLE', 'B_POPULAR_CULTURE', 'C_COMMUNICATION']}></ClearRefinements>
          
        </div>
        <div className="col col-xs-8">
          <div className="row">
            <div className="col-xs col-xs-6">
              <Pagination/>
            </div>
            <div className="col-xs col-xs-6">
              <HitsPerPage
                items={[
                { label: '10 hits per page', value: 10 },
                { label: '20 hits per page', value: 20 },
                { label: '50 hits per page', value: 50, default: true },
                { label: '100 hits per page', value: 100 },
                ]}
              />
            </div>
          </div>
            <HitsPerPage
              items={[
               { label: '10 hits per page', value: 10 },
               { label: '20 hits per page', value: 20 },
               { label: '50 hits per page', value: 50, default: true },
               { label: '100 hits per page', value: 100 },
              ]}
            />
            <CustomHits />
            <Pagination/>
            
        </div>
      </div>
    </InstantSearchNext>
  );
}

function FallbackComponent({ attribute }: { attribute: string }) {
  return (
    <Panel header={attribute}>
      <RefinementList attribute={attribute} />
    </Panel>
  );
}
