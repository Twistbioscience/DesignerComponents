import SequenceViewer from './sequence-viewer';
import {WithSelection} from './wrappers/selection';
import {WithConfigSetter} from './wrappers/config-setter';
import {WithFontsLoader} from './wrappers/font-loader';
import {isFontLoaded} from './rendering/fonts';
import AutoSizer from './utils/auto-sizer';

export const DesignerComponents = isFontLoaded()
  ? WithConfigSetter(WithSelection(SequenceViewer))
  : WithFontsLoader(WithConfigSetter(WithSelection(SequenceViewer)));

export const DesignerComponentsViewer = isFontLoaded()
  ? WithConfigSetter(SequenceViewer)
  : WithFontsLoader(WithConfigSetter(SequenceViewer));

export const Autosizer = AutoSizer;
