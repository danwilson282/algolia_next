'use client';

import algoliasearch from 'algoliasearch/lite';
import { Hit as AlgoliaHit } from 'instantsearch.js';
import React, {useRef} from 'react';
import { FaVolumeUp, FaFileDownload } from "react-icons/fa";
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
  Stats,
  useQueryRules,
  UseQueryRulesProps,
} from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

import { Panel } from '../components/Panel';

const client = algoliasearch('5E8H3EJ5AY', '402d8891ec371895bc566751725f5898');
//const client = algoliasearch(process.env.APPLICATION_ID, process.env.SEARCH_KEY);

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
  function playAudio(url:string){
    let a:HTMLAudioElement = document.getElementById('audio-player') as HTMLAudioElement
    a.src = url
    a.play()
  }
  const style = { color: "#1847BF", fontSize: "1.5em" }
  return (
    <table className="table c-table">
            <thead>
              <tr>
                <th style={{width:'20%'}}>Word</th>
                <th style={{width:'20%'}}>Translation</th>
                <th style={{width:'20%'}}>Part of speech</th>
                <th style={{width:'20%'}}>Tier</th>
                <th style={{width:'20%'}}>Download</th>
              </tr>
            </thead>
            <tbody>
              {hits.map((hit:AlgoliaHit):React.ReactNode => (
              <tr className="js-audio" id={hit.FILENAME} onClick={()=>playAudio(hit.FILENAME)}>
                <td><span className="Hit-headword"><FaVolumeUp style={style}/> {hit.HEADWORD}</span></td>
                <td><span className="Hit-english">{hit.ENGLISH_EQUIVALENT}</span></td>
                <td><span className="Hit-part">{hit.PART_OF_SPEECH}</span></td>
                <td><span className="Hit-tier">{hit.TIER_DISPLAY}</span></td>
                <td><a href={hit.FILENAME} className="Hit-part"><FaFileDownload style={style}/></a></td>
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

function QueryRulesCustomData(props: UseQueryRulesProps) {
  const { items } = useQueryRules(props);

  return (
    <>
      {items.map(({ theme, title }) => (
        <section key={title}>
          <h2>{title}</h2>
          <p>
            Theme: <span className="color-brand-secondary">{theme}</span>
          </p>
        </section>
      ))}
    </>
  );
}

export default function Search() {
  return (
    <InstantSearchNext searchClient={client} indexName="aqa-audio-files" routing>
      <div className="Container row">
        <audio id="audio-player" src="https://filestore.aqa.org.uk/media/GCSE_French/higher/AQA-8652-SF-arriver-arriver-à.mp3"></audio>
        <div className="col-xs col-xs-4 bg-grey-lightest">

        <SearchBox classNames={{input: "c-searchbox__field col-xs col-xs-12"}} placeholder="Search audio files" />
          <div className="c-modal--overlay__container">
            <div className="c-accordion u-sm-p1-5">
              <div className="row">
                <div className="col-xs u-mt1">
                  <ClearRefinements
                  translations={{
                    resetButtonText: 'Clear all filters',
                  }}
                  classNames={{button: 'c-btn c-btn--brand c-btn--full'}}
                  ></ClearRefinements>
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
              <Pagination
                classNames={{root: 's-search c-pagination', list: '', item: 'c-pagination__list o-list-bare u-mb0', link: 'c-pagination__list__item__link'}}
              />
            </div>
            <div className="col-xs col-xs-6">
              <HitsPerPage
                items={[
                { label: '10 hits per page', value: 10 },
                { label: '20 hits per page', value: 20 },
                { label: '50 hits per page', value: 50, default: true },
                { label: '100 hits per page', value: 100 },
                ]}
                classNames={{root: '', select: 'c-form__select', option: ''}}
              />
            </div>
          </div>
          <div className="row">
            <Stats></Stats>
          </div>
          <div className="row">
            <QueryRulesCustomData></QueryRulesCustomData>
          <CustomHits />
          </div>
            
            <div className="row">
            <div className="col-xs col-xs-6">
            <Pagination
                classNames={{root: 's-search c-pagination', list: '', item: 'c-pagination__list o-list-bare u-mb0', link: 'c-pagination__list__item__link'}}
              />
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
            
        </div>
      </div>
    </InstantSearchNext>
  );
}

