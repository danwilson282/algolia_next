'use client';

import algoliasearch from 'algoliasearch/lite';
import { Hit as AlgoliaHit } from 'instantsearch.js';
import React from 'react';
import {
  SearchBox,
  RefinementList,
  DynamicWidgets,
  useHits,
  UseHitsProps,
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
              {hits.map((hit:any):React.ReactNode => (
                <tr>
                <td><span className="Hit-headword">{hit.HEADWORD}</span></td>
                <td><span className="Hit-english">{hit.ENGLISH_EQUIVALENT}</span></td>
                <td><span className="Hit-part">{hit.PART_OF_SPEECH}</span></td>
                <td><span className="Hit-tier">{hit.TIER_DISPLAY}</span></td>
                <td><span className="Hit-part">{hit.FILENAME}</span></td>
              </tr>
              ))}
            </tbody>
          </table>
  );
}


export default function Search() {
  return (
    <InstantSearchNext searchClient={client} indexName="aqa-audio-files" routing>
      <div className="Container row">
        <div className="col col-xs-4">
          <SearchBox />
          <DynamicWidgets fallbackComponent={FallbackComponent} />
        </div>
        <div className="col col-xs-8">
            <CustomHits />
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
