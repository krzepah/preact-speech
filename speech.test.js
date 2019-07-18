import { h } from 'preact';
import render from 'preact-render-to-string';
import htmlLooksLike from 'html-looks-like';

import Speech from './index';

const Link = () => <div>Hello World</div>

describe('Speech component', () => {
    it('should always be instantiable', () => {
        const speech = new Speech();
    });
});
