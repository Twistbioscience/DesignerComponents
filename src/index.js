import SequenceViewer from './sequence-viewer';
import {WithSelection} from './wrappers/selection';
import {WithConfigSetter} from './wrappers/config-setter';
import {WithFontsLoader} from './wrappers/font-loader';
import {isFontLoaded} from './rendering/fonts';

export const DesignerComponents = isFontLoaded()
  ? WithConfigSetter(WithSelection(SequenceViewer))
  : WithFontsLoader(WithConfigSetter(WithSelection(SequenceViewer)));

export const DesignerComponentsViewer = isFontLoaded()
  ? WithConfigSetter(SequenceViewer)
  : WithFontsLoader(WithConfigSetter(SequenceViewer));
