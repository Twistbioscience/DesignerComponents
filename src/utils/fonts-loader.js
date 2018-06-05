import WebFont from 'webfontloader';



const FontsLoader = ({callBack}) => {

  WebFont.load({
    google: {
      families: ['Inconsolata', 'Droid Sans Mono']
    },
    active: function() {
      console.info('*** DesignerComponentsController web fonts ready, initializing app');
      callBack()

    }
  });
  return <div>Loading</div>;
};

export default FontsLoader;