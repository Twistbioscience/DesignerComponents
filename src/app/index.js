import {header, h1, a, div} from '/utils/components'

const Header = props => (
  header({ className: `header` },
    h1({ className: `header__title` }, `Know It All`),
    a(
      {
        className: `header__help`,
        target: `_blank`,
        rel: `noopener noreferrer`,
        title: `Find out more about know it all, version ${props.version}`,
        href: `https://hackernoon.com/what-you-dont-know-about-web-development-d7d631f5d468#.ex2yp6d64`,
      },
      `What is this??`,
    ),
  )
);

const Table = props => div({ className: `skill-table` }, props.rows);

const App = props => (
  div({ id: `app` },
    Header({ version: props.version }),
    Table({ rows: props.rows }),
  )
);

document.body.appendChild(App('someData'));