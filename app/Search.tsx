'use client';

import algoliasearch from 'algoliasearch/lite';
import { Hit as AlgoliaHit } from 'instantsearch.js';
import React from 'react';
import {
  Hits,
  Highlight,
  SearchBox,
  RefinementList,
  DynamicWidgets,
} from 'react-instantsearch';
import { InstantSearchNext } from 'react-instantsearch-nextjs';

import { Panel } from '../components/Panel';

const client = algoliasearch('5E8H3EJ5AY', '402d8891ec371895bc566751725f5898');

type HitProps = {
  hit: AlgoliaHit<{
    HEADWORD: string;
    ENGLISH_EQUIVALENT: string;
  }>;
};

function Hit({ hit }: HitProps) {
  return (
    <>
      
      <span className="Hit-price">${hit.ENGLISH_EQUIVALENT}</span>
    </>
  );
}

export default function Search() {
  return (
    <InstantSearchNext searchClient={client} indexName="instant_search" routing>
      <div className="Container">
        <div>
          <DynamicWidgets fallbackComponent={FallbackComponent} />
        </div>
        <div>
          <SearchBox />
          <Hits hitComponent={Hit} />
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
