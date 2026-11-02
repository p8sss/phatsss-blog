import React, {type JSX} from 'react';
import {Redirect} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';

/** The Elements placeholder became the Learn section; keep old links working. */
export default function Elements(): JSX.Element {
  return <Redirect to={useBaseUrl('/learn')} />;
}
