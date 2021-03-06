// @flow
import SequenceViewer from './sequence-viewer';
import {WithSelection} from './wrappers/selection';
import {WithConfigSetter} from './wrappers/config-setter';
import {WithFontsLoader} from './wrappers/font-loader';
import {isFontLoaded} from './rendering/fonts';

export {detectOrfs} from './utils/sequence';
export {default as Measurer} from './utils/measurer';
export {default as reSiteDefinitions} from './re-site-definitions.json';
export {handleChangeEvent} from './utils/event-handlers';

export const DesignerComponents = isFontLoaded()
  ? WithConfigSetter(WithSelection(SequenceViewer))
  : WithFontsLoader(WithConfigSetter(WithSelection(SequenceViewer)));
